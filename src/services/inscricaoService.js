import { listarInscricoes } from "./api/formularioApi";

/**
 * Inscricoes (respostas de formulario) de um evento.
 * API:   { evento_id, voluntario_id, nome, email, status, resposta_id, link_resposta }
 * Front: { id, eventId, name, email, status, respostaId, linkResposta }
 */
function toInscricao(api) {
  return {
    id: api.voluntario_id,
    eventId: api.evento_id,
    name: api.nome,
    email: api.email,
    status: api.status,
    respostaId: api.resposta_id,
    linkResposta: api.link_resposta,
  };
}

/**
 * Lista as inscricoes de um evento.
 * @param {number|string} eventId
 * @returns {Promise<Array>}
 */
export async function fetchInscricoesByEvent(eventId) {
  const data = await listarInscricoes(eventId);
  return data.map(toInscricao);
}
