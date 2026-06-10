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
