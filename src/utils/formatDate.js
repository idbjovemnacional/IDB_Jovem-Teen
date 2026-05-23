/**
 * Formata uma data ISO para exibição em pt-BR
 * @param {string|Date} date
 * @param {Object} options - Intl.DateTimeFormat options
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("pt-BR", { ...defaultOptions, ...options }).format(
    new Date(date)
  );
}

/**
 * Retorna a diferença em dias/horas/minutos/segundos entre agora e uma data futura
 * @param {string|Date} targetDate
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, expired: boolean }}
 */
export function getCountdown(targetDate) {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}
