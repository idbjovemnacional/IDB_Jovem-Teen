import { api } from "./api";

const DEFAULT_SPEAKER_IMAGE = "/images/galeria/idb-jovem-one.jpg";

function adaptSpeaker(apiSpeaker) {
  if (!apiSpeaker) return null;
  return {
    id: apiSpeaker.participante_id,
    name: apiSpeaker.nome,
    image: apiSpeaker.link_foto || DEFAULT_SPEAKER_IMAGE,
    role: apiSpeaker.profissao || "",
  };
}

function toApiSpeaker(form) {
  return {
    nome: form.name,
    link_foto: form.image || null,
    profissao: form.role || null,
  };
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.detail || error?.message || fallback;
}

export async function fetchSpeakers() {
  const { data } = await api.get("/banda-palestrante/");
  return data.map(adaptSpeaker);
}

export async function fetchSpeakerById(participanteId) {
  const { data } = await api.get(`/banda-palestrante/${participanteId}`);
  return adaptSpeaker(data);
}

/* Palestrantes/bandas de um evento específico.
   BLOQUEADO: o backend ainda não expõe a relação evento↔participante
   (a tabela N:N `participa` existe, mas não há rota). Assim que existir
   `GET /evento/{id}/participantes`, basta trocar a implementação abaixo —
   o restante do front (SpeakerList) já consome este formato. */
export async function fetchSpeakersByEvent(/* eventId */) {
  // TODO(backend): const { data } = await api.get(`/evento/${eventId}/participantes`);
  //                return data.map(adaptSpeaker);
  return [];
}

export async function handleCreateSpeaker(form) {
  if (!form.name?.trim()) {
    return { success: false, error: "Nome do participante é obrigatório." };
  }
  try {
    const { data } = await api.post("/banda-palestrante/", toApiSpeaker(form));
    return { success: true, speaker: adaptSpeaker(data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao criar participante.") };
  }
}

export async function handleDeleteSpeaker(participanteId) {
  try {
    await api.delete(`/banda-palestrante/${participanteId}`);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao excluir participante.") };
  }
}
