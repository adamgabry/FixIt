'use client';

import { useEffect, useState } from "react";

export const useLocation = (autoRequest = false) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (autoRequest) requestLocation();
  }, [autoRequest]);

  return {
    coords,
    error,
    loading,
    requestLocation,
  };
};