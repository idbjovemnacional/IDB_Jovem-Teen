import {
  listarVoluntarios,
  buscarVoluntario,
  listarVoluntariosPorEvento,
  atualizarStatusVoluntario,
  contarVoluntariosPorEvento,
} from "./api/voluntarioApi";
import { fetchInscricoesByEvent } from "./inscricaoService";

/**
 * Adapters API (pt-BR) -> front.
 * Voluntario:        { voluntario_id, nome, email } -> { id, name, email }
 * Vinculo c/ evento: { voluntario_id, evento_id, status, resposta_id }
 *                    -> { id, eventId, status, respostaId }
 */
function toVoluntario(api) {
  if (!api) return null;
  return { id: api.voluntario_id, name: api.nome, email: api.email };
}

function toVinculoEvento(api) {
  return {
    id: api.voluntario_id,
    eventId: api.evento_id,
    status: api.status,
    respostaId: api.resposta_id,
  };
}

// Leitura

export async function getAllVolunteers() {
  const data = await listarVoluntarios();
  return data.map(toVoluntario);
}

export async function getVolunteerById(id) {
  const data = await buscarVoluntario(id);
  return toVoluntario(data);
}

export async function getVolunteersByEventId(eventId) {
  const data = await listarVoluntariosPorEvento(eventId);
  return data.map(toVinculoEvento);
}

/**
 * Lista usada na tabela de Detalhes: nome, email, status e link do formulario.
 * Vem das INSCRICOES (o endpoint /voluntarios/evento/{id} nao traz nome/email).
 */
export async function fetchVolunteersByEvent(eventId) {
  return fetchInscricoesByEvent(eventId);
}

export async function countVolunteersByEvent(eventId) {
  return contarVoluntariosPorEvento(eventId);
}

// Escrita

export async function updateVolunteerStatus(volunteerId, eventId, status) {
  const data = await atualizarStatusVoluntario(volunteerId, eventId, status);
  return toVinculoEvento(data);
}

// Stats (calculadas a partir da lista de inscritos)

const VALID_STATUSES = ["pendente", "aprovado", "reprovado"];

/** Pura: conta os status de uma lista ja carregada (evita refetch). */
export function computeVolunteerStats(list = []) {
  return {
    total: list.length,
    aprovados: list.filter((v) => v.status === "aprovado").length,
    pendentes: list.filter((v) => v.status === "pendente").length,
    reprovados: list.filter((v) => v.status === "reprovado").length,
  };
}

export async function getVolunteerStats(eventId) {
  const list = await fetchVolunteersByEvent(eventId);
  return computeVolunteerStats(list);
}

/* ----- Handler com validacao + tratamento de erro ----- */

export async function handleUpdateStatus(volunteerId, eventId, status) {
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Status inválido." };
  }

  try {
    const volunteer = await updateVolunteerStatus(volunteerId, eventId, status);
    return { success: true, volunteer };
  } catch (err) {
    return {
      success: false,
      error: resolveError(err, "Não foi possível atualizar o status."),
    };
  }
}

function resolveError(err, fallback) {
  const status = err?.response?.status;
  if (status === 401 || status === 403) {
    return "Sessão expirada ou sem permissão. Faça login novamente.";
  }
  return err?.response?.data?.detail || fallback;
}
