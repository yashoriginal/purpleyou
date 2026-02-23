"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapContentProps {
  lat: number;
  lng: number;
  onMapClick: (lat: number, lng: number) => void;
}

export default function MapContent({ lat, lng, onMapClick }: MapContentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 15);

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(mapInstanceRef.current);

      // Handle map clicks
      mapInstanceRef.current.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    // Update marker position
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
    }

    // Update map center
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
    }

    return () => {
      // Don't destroy the map on unmount to preserve state
    };
  }, [lat, lng, onMapClick]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
