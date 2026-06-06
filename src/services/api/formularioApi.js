import { api } from "../api";

/**
 * Inscricao de um voluntario num evento (resposta de formulario).
 * @typedef {Object} Inscricao
 * @property {number} evento_id
 * @property {number} voluntario_id
 * @property {string} nome
 * @property {string} email
 * @property {string} status
 * @property {string} resposta_id
 * @property {string} link_resposta
 */

/**
 * GET /formulario/eventos/{evento_id}/inscricoes (publico)
 * @param {number} eventoId
 * @returns {Promise<Inscricao[]>}
 */
export async function listarInscricoes(eventoId) {
  const { data } = await api.get(`/formulario/eventos/${eventoId}/inscricoes`);
  return data;
}
