import axios from "axios";
import { getToken, setToken, clearToken } from "./auth/tokenStore";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error(
    "VITE_API_URL nao definida. Crie .env.development / .env.production a partir de .env.example."
  );
}

if (import.meta.env.PROD && !baseURL.startsWith("https://")) {
  throw new Error("VITE_API_URL deve usar https:// em producao.");
}

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Redireciona via URL evitando loop quando ja se esta na pagina destino. */
function redirectTo(path) {
  if (window.location.pathname !== path) {
    window.location.assign(path);
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearToken();
      redirectTo("/login");
    } else if (status === 403) {
      redirectTo("/unauthorized");
    }

    return Promise.reject(error);
  }
);
