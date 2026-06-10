import { api } from "./api";

export async function fetchEndereco(latitude, longitude) {
  if (latitude == null || longitude == null) return null;
  try {
    const { data } = await api.get("/mapa/endereco", {
      params: { latitude, longitude },
    });
    return data?.nome_local || null;
  } catch {
    return null;
  }
}
