import { api } from "./api";
import idbJovemOne from "../assets/images/idbJovemOne.png";
import { toBackendImageUrl } from "../utils/driveImage";

const DEFAULT_SPEAKER_IMAGE = idbJovemOne;

function adaptSpeaker(apiSpeaker) {
  if (!apiSpeaker) return null;
  return {
    id: apiSpeaker.participante_id,
    name: apiSpeaker.nome,
    photoLink: apiSpeaker.link_foto || "",
    image: apiSpeaker.link_foto ? toBackendImageUrl(apiSpeaker.link_foto) : DEFAULT_SPEAKER_IMAGE,
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
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) {
    const msg = detail
      .map((d) => (typeof d === "string" ? d : d?.msg))
      .filter(Boolean)
      .join("; ");
    if (msg) return msg;
  }
  if (typeof detail === "string" && detail) return detail;
  if (detail && typeof detail === "object" && detail.msg) return detail.msg;
  return error?.message || fallback;
}

export async function fetchSpeakers() {
  const { data } = await api.get("/banda-palestrante/");
  return data.map(adaptSpeaker);
}

export async function fetchSpeakerById(participanteId) {
  const { data } = await api.get(`/banda-palestrante/${participanteId}`);
  return adaptSpeaker(data);
}

export async function fetchSpeakersByEvent(eventId) {
  const { data } = await api.get(`/evento/${eventId}/participantes`);
  const isBanda = (s) => (s.profissao || "") === "Banda";
  const ordenados = [...data].sort((a, b) => Number(isBanda(a)) - Number(isBanda(b)));
  return ordenados.map(adaptSpeaker);
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

export async function handleUpdateSpeaker(participanteId, form) {
  try {
    const { data } = await api.put(`/banda-palestrante/${participanteId}`, toApiSpeaker(form));
    return { success: true, speaker: adaptSpeaker(data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao atualizar participante.") };
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
