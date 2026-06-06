/**
 * Armazenamento do access token EM MEMORIA.
 *
 * Decisao de seguranca: o token NAO vai para localStorage/sessionStorage, que sao
 * legiveis por qualquer JS e portanto vulneraveis a roubo via XSS. Mantido apenas
 * numa variavel de modulo. Some ao recarregar a pagina — o login do Keycloak
 * (silent SSO / refresh) sera responsavel por re-emitir e chamar setToken().
 *
 * Nunca logar o valor do token.
 */

let accessToken = null;

/** @returns {string | null} */
export function getToken() {
  return accessToken;
}

/** @param {string | null} token */
export function setToken(token) {
  accessToken = token || null;
}

export function clearToken() {
  accessToken = null;
}
