import { useState, useEffect } from "react";
import { mockEvents, nextEvent } from "../../../data/mockEvents";
import { mockProducts } from "../../../data/mockProducts";
import { mockGallery } from "../../../data/mockGallery";
import { getCountdown } from "../../../utils/formatDate";

export function useHomeData() {
  const [countdown, setCountdown] = useState(getCountdown(nextEvent?.date));
  const [events] = useState(mockEvents);
  const [products] = useState(mockProducts);
  const [gallery] = useState(mockGallery);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(nextEvent.date));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { countdown, events, products, gallery, nextEvent };
}
