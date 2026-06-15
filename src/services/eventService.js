import { api } from "./api";
import defaultEventImage from "../assets/images/idbJovemOne.png";
import { toDriveImageUrl } from "../utils/driveImage";

const DEFAULT_EVENT_IMAGE = defaultEventImage;

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeSlug(id, nome) {
  return `${id}-${slugify(nome)}`;
}

export function parseEventId(slugOrId) {
  const match = String(slugOrId ?? "").match(/^\d+/);
  return match ? Number(match[0]) : null;
}

const pad = (n) => String(n).padStart(2, "0");

/* Lê os componentes literais de uma data ISO ("relógio de parede"), ignorando
   qualquer fuso (Z/offset). O horário que o usuário digitou é o que aparece —
   o back guarda os mesmos números e os devolve marcados como UTC, mas aqui não
   convertemos, evitando o deslocamento (e o "drift" a cada edição). */
function parseWallClock(value) {
  if (!value) return null;
  const m = String(value).match(
    /(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/
  );
  if (!m) return null;
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
    hour: m[4] ? Number(m[4]) : 0,
    minute: m[5] ? Number(m[5]) : 0,
  };
}

export function formatDate(isoDate) {
  const p = parseWallClock(isoDate);
  if (!p) return "";
  return `${pad(p.day)}/${pad(p.month)}/${p.year}`;
}

export function extractDayMonth(isoDate) {
  const p = parseWallClock(isoDate);
  if (!p) return { day: "--", month: "---" };
  /* Date construído com componentes locais (sem parse de fuso) só para o nome do mês */
  const d = new Date(p.year, p.month - 1, p.day);
  const month = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
  return { day: pad(p.day), month: month.charAt(0).toUpperCase() + month.slice(1) };
}

function formatTime(isoDate) {
  const p = parseWallClock(isoDate);
  if (!p) return "";
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

function formatTimeRange(start, end) {
  const s = formatTime(start);
  const e = formatTime(end);
  if (s && e) return `${s} - ${e}`;
  return s || e || "";
}

export function toInputDateTime(isoDate) {
  const p = parseWallClock(isoDate);
  if (!p) return "";
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/* Separa um ISO em { day: "YYYY-MM-DD", time: "HH:mm" } (relógio de parede) */
export function splitDateTime(isoDate) {
  const p = parseWallClock(isoDate);
  if (!p) return { day: "", time: "" };
  return {
    day: `${p.year}-${pad(p.month)}-${pad(p.day)}`,
    time: `${pad(p.hour)}:${pad(p.minute)}`,
  };
}

export function isFutureEvent(isoDate) {
  const p = parseWallClock(isoDate);
  if (!p) return false;
  const eventDate = new Date(p.year, p.month - 1, p.day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

/* Evento que ainda vai acontecer ou está acontecendo: continua visível enquanto
   a data de término (ou a de início, se não houver término) for hoje ou no futuro.
   Difere de isFutureEvent por considerar o término — eventos de vários dias que já
   começaram permanecem visíveis até acabarem. */
export function isOngoingOrFuture(event) {
  const p = parseWallClock(event?.endDate || event?.date);
  if (!p) return false;
  const endDate = new Date(p.year, p.month - 1, p.day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return endDate >= today;
}

/* Monta a URL do Google Calendar para criar o evento na conta do usuário.
   Usa o formato "TEMPLATE" (pré-preenchido): o usuário revisa e salva no próprio
   calendário. As datas vão como relógio de parede (sem Z), no fuso do usuário. */
export function buildGoogleCalendarUrl(event) {
  if (!event?.date) return null;
  const toGCal = (iso) => {
    const { day, time } = splitDateTime(iso);
    if (!day) return null;
    return `${day.replace(/-/g, "")}T${(time || "00:00").replace(":", "")}00`;
  };
  const start = toGCal(event.date);
  const end = toGCal(event.endDate || event.date) || start;
  if (!start) return null;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title || "Evento",
    dates: `${start}/${end}`,
    details: event.description || "",
    location: event.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function toFormResponseUrl(url) {
  if (!url || typeof url !== "string") return url || "";
  let result = url.trim();
  if (!/docs\.google\.com\/forms\//i.test(result)) return result;
  result = result.replace(/#.*$/, "");
  result = result.replace(/\/edit(?=$|\?)/i, "/viewform");
  return result;
}

function adaptEvent(apiEvent) {
  if (!apiEvent) return null;
  return {
    id: apiEvent.evento_id,
    title: apiEvent.nome,
    slug: makeSlug(apiEvent.evento_id, apiEvent.nome),
    description: apiEvent.descricao || "",
    date: apiEvent.data_inicio,
    endDate: apiEvent.data_fim,
    time: formatTimeRange(apiEvent.data_inicio, apiEvent.data_fim),
    location: apiEvent.nome_local || "",
    latitude: apiEvent.local_latitude,
    longitude: apiEvent.local_longitude,
    linkGaleria: apiEvent.link_galeria || "",
    linkFormularioVoluntarios: apiEvent.formulario_link || "",
    calendarioEventoId: apiEvent.calendario_evento_id || null,
    tipoEvento: apiEvent.tipo_evento || "",
    /* URL da imagem de capa (Drive). image = valor exibido (com fallback);
       linkImagem = valor cru para o formulário (vazio quando não há). */
    linkImagem: apiEvent.link_imagem || "",
    image: toDriveImageUrl(apiEvent.link_imagem) || DEFAULT_EVENT_IMAGE,
    /* category espelha tipo_evento para alimentar o filtro da página de eventos */
    category: apiEvent.tipo_evento || "Outros",
    featured: false,
    totalParticipantes: 0,
    totalVoluntarios: 0,
    speakers: [],
    schedule: [],
    galeria: [],
    palestrantes: "",
    bandas: "",
  };
}

function toApiEvent(form) {
  const toIso = (v) => (v ? `${v}:00`.slice(0, 19) : null);
  return {
    nome: form.title,
    tipo_evento: form.tipoEvento || null,
    descricao: form.description || null,
    local_latitude: Number(form.latitude),
    local_longitude: Number(form.longitude),
    data_inicio: toIso(form.date),
    data_fim: toIso(form.endDate),
    link_galeria: form.linkGaleria || null,
    formulario_link: form.linkFormularioVoluntarios || null,
    link_imagem: (form.image && form.image.trim()) || null,
  };
}

function adaptActivity(apiAct) {
  const { day, month } = extractDayMonth(apiAct.horario_inicio);
  return {
    id: apiAct.atividade_id,
    eventId: apiAct.evento_id,
    name: apiAct.nome,
    activity: apiAct.nome,
    description: apiAct.descricao || "",
    start: apiAct.horario_inicio,
    end: apiAct.horario_termino,
    time: formatTime(apiAct.horario_inicio),
    startTime: formatTime(apiAct.horario_inicio),
    endTime: formatTime(apiAct.horario_termino),
    day,
    month,
  };
}

function toApiActivity(form, eventDate) {
  const dia = (eventDate ? String(eventDate) : new Date().toISOString()).slice(0, 10);
  const combinar = (hora) => (hora ? `${dia}T${hora}:00` : null);
  return {
    nome: form.name,
    descricao: form.description || null,
    horario_inicio: combinar(form.start || form.time),
    horario_termino: combinar(form.end || form.start || form.time),
  };
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.detail || error?.message || fallback;
}

export async function fetchAllEvents() {
  const { data } = await api.get("/evento/");
  return data.map(adaptEvent);
}

export async function searchEvents(termo) {
  const { data } = await api.get("/evento/buscar", { params: { termo } });
  return data.map(adaptEvent);
}

export async function fetchEventById(slugOrId) {
  const id = parseEventId(slugOrId);
  if (!id) return null;
  const { data } = await api.get(`/evento/${id}`);
  return adaptEvent(data);
}

export async function getGroupedEvents() {
  const all = await fetchAllEvents();
  const proximos = all.filter((e) => isFutureEvent(e.date));
  const anteriores = all.filter((e) => !isFutureEvent(e.date));
  return { proximos, anteriores };
}

export const TIPOS_EVENTO = ["Conferência", "Acampamento", "Outros"];

export async function handleCreateEvent(data) {
  if (!data.title || !data.title.trim()) {
    return { success: false, error: "Nome do evento é obrigatório." };
  }
  if (!TIPOS_EVENTO.includes(data.tipoEvento)) {
    return { success: false, error: "Selecione o tipo de evento." };
  }
  if (!data.date || !data.endDate) {
    return { success: false, error: "Datas de início e término são obrigatórias." };
  }
  if (data.latitude === "" || data.longitude === "" || data.latitude == null || data.longitude == null) {
    return { success: false, error: "Latitude e longitude são obrigatórias." };
  }
  try {
    const { data: created } = await api.post("/evento/", toApiEvent(data));
    return { success: true, event: adaptEvent(created) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao criar evento.") };
  }
}

export async function handleUpdateEvent(slugOrId, data) {
  if (!data.title || !data.title.trim()) {
    return { success: false, error: "Nome do evento é obrigatório." };
  }
  if (!TIPOS_EVENTO.includes(data.tipoEvento)) {
    return { success: false, error: "Selecione o tipo de evento." };
  }
  const id = parseEventId(slugOrId);
  try {
    const { data: updated } = await api.put(`/evento/${id}`, toApiEvent(data));
    return { success: true, event: adaptEvent(updated) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao atualizar evento.") };
  }
}

export async function handleDeleteEvent(slugOrId) {
  const id = parseEventId(slugOrId);
  try {
    await api.delete(`/evento/${id}`);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao excluir evento.") };
  }
}

export async function fetchActivities(eventId) {
  const id = parseEventId(eventId);
  const { data } = await api.get(`/evento/${id}/atividade`);
  return data.map(adaptActivity);
}

export async function fetchEventGallery(eventId) {
  const id = parseEventId(eventId);
  if (!id) return [];
  try {
    const { data } = await api.get(`/evento/${id}/galeria`);
    return data.map((foto) => ({
      id: foto.id,
      nome: foto.nome,
      url: foto.url_visualizacao,
    }));
  } catch {
    /* evento sem link_galeria, pasta inexistente (404) ou falha no Drive (502) */
    return [];
  }
}

/* Galeria geral: agrega as fotos de todos os eventos que têm galeria.
   (não há endpoint público de galeria geral; montamos a partir dos eventos) */
export async function fetchAggregatedGallery() {
  const events = await fetchAllEvents();
  const comGaleria = events.filter((e) => e.linkGaleria);
  const grupos = await Promise.all(
    comGaleria.map(async (ev) => {
      const fotos = await fetchEventGallery(ev.id);
      return fotos.map((foto) => ({
        id: foto.id,
        image: foto.url,
        event: ev.title,
        location: ev.location || "",
      }));
    })
  );
  return grupos.flat();
}

export async function handleCreateActivity(eventId, data, eventDate) {
  const id = parseEventId(eventId);
  if (!data.name || !data.name.trim()) {
    return { success: false, error: "Nome da atividade é obrigatório." };
  }
  try {
    const { data: created } = await api.post(
      `/evento/${id}/atividade`,
      toApiActivity(data, eventDate)
    );
    return { success: true, data: adaptActivity(created) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao criar atividade.") };
  }
}

export async function handleUpdateActivity(activityId, data, eventDate) {
  try {
    const { data: updated } = await api.put(
      `/evento/atividade/${activityId}`,
      toApiActivity(data, eventDate)
    );
    return { success: true, data: adaptActivity(updated) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao atualizar atividade.") };
  }
}

export async function handleDeleteActivity(activityId) {
  try {
    await api.delete(`/evento/atividade/${activityId}`);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Erro ao excluir atividade.") };
  }
}
