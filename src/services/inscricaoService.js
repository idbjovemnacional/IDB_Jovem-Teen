import { listarInscricoes } from "./api/formularioApi";

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
 * @param {number|string} eventId
 * @returns {Promise<Array>}
 */
export async function fetchInscricoesByEvent(eventId) {
  const data = await listarInscricoes(eventId);
  return data.map(toInscricao);
}
