import { useState, useEffect, useCallback } from "react";

const geolocationSupported =
  typeof navigator !== "undefined" && "geolocation" in navigator;

/* Solicita a localização do usuário via API de Geolocalização do navegador. status: "idle" | "requesting" | "granted" | "denied" | "unavailable" */
export default function useGeolocation({ immediate = true } = {}) {
  const [position, setPosition] = useState(null); // { lat, lng, accuracy }
  const [status, setStatus] = useState(() => {
    if (!immediate) return "idle";
    return geolocationSupported ? "requesting" : "unavailable";
  });
  const [error, setError] = useState(() =>
    immediate && !geolocationSupported
      ? "Seu navegador não suporta geolocalização."
      : null
  );

  const locate = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setStatus("granted");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setError("Permissão de localização negada.");
        } else if (err.code === err.TIMEOUT) {
          setStatus("unavailable");
          setError("Tempo esgotado ao obter sua localização.");
        } else {
          setStatus("unavailable");
          setError("Não foi possível obter sua localização.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const request = useCallback(() => {
    if (!geolocationSupported) {
      setStatus("unavailable");
      setError("Seu navegador não suporta geolocalização.");
      return;
    }
    setStatus("requesting");
    setError(null);
    locate();
  }, [locate]);

  useEffect(() => {
    if (immediate && geolocationSupported) locate();
  }, [immediate, locate]);

  return { position, status, error, request };
}
