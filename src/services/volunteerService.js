import {
  listarVoluntarios,
  buscarVoluntario,
  listarVoluntariosPorEvento,
  atualizarStatusVoluntario,
  contarVoluntariosPorEvento,
} from "./api/voluntarioApi";
import { fetchInscricoesByEvent } from "./inscricaoService";

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

export async function fetchVolunteersByEvent(eventId) {
  return fetchInscricoesByEvent(eventId);
}

export async function countVolunteersByEvent(eventId) {
  return contarVoluntariosPorEvento(eventId);
}

export async function updateVolunteerStatus(volunteerId, eventId, status) {
  const data = await atualizarStatusVoluntario(volunteerId, eventId, status);
  return toVinculoEvento(data);
}

const VALID_STATUSES = ["pendente", "aprovado", "reprovado"];

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
