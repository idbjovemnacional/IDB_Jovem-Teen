import { api } from "../api";

/**
 * @typedef {Object} Voluntario
 * @property {number} voluntario_id
 * @property {string} nome
 * @property {string} email
 */

/**
 * @typedef {Object} VoluntarioInput
 * @property {string} nome
 * @property {string} email
 */

/**
 * Vinculo de um voluntario com um evento.
 * @typedef {Object} VoluntarioEvento
 * @property {number} voluntario_id
 * @property {number} evento_id
 * @property {string} status
 * @property {string} resposta_id
 */

/**
 * GET /voluntarios/ (admin)
 * @returns {Promise<Voluntario[]>}
 */
export async function listarVoluntarios() {
  const { data } = await api.get("/voluntarios/");
  return data;
}

/**
 * POST /voluntarios/ (admin)
 * @param {VoluntarioInput} body
 * @returns {Promise<Voluntario>}
 */
export async function criarVoluntario(body) {
  const { data } = await api.post("/voluntarios/", body);
  return data;
}

/**
 * GET /voluntarios/{id} (admin)
 * @param {number} id
 * @returns {Promise<Voluntario>}
 */
export async function buscarVoluntario(id) {
  const { data } = await api.get(`/voluntarios/${id}`);
  return data;
}

/**
 * DELETE /voluntarios/{id} (admin)
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deletarVoluntario(id) {
  await api.delete(`/voluntarios/${id}`);
}

/**
 * GET /voluntarios/evento/{evento_id} (admin)
 * @param {number} eventoId
 * @returns {Promise<VoluntarioEvento[]>}
 */
export async function listarVoluntariosPorEvento(eventoId) {
  const { data } = await api.get(`/voluntarios/evento/${eventoId}`);
  return data;
}

/**
 * PATCH /voluntarios/{voluntario_id}/evento/{evento_id}/status?novo_status=<valor> (admin)
 * O status vai na QUERY STRING, nao no body.
 * @param {number} voluntarioId
 * @param {number} eventoId
 * @param {string} novoStatus
 * @returns {Promise<VoluntarioEvento>}
 */
export async function atualizarStatusVoluntario(voluntarioId, eventoId, novoStatus) {
  const { data } = await api.patch(
    `/voluntarios/${voluntarioId}/evento/${eventoId}/status`,
    null,
    { params: { novo_status: novoStatus } }
  );
  return data;
}

/**
 * GET /voluntarios/evento/{evento_id}/contagem (admin)
 * @param {number} eventoId
 * @returns {Promise<number>}
 */
export async function contarVoluntariosPorEvento(eventoId) {
  const { data } = await api.get(`/voluntarios/evento/${eventoId}/contagem`);
  return data;
}
