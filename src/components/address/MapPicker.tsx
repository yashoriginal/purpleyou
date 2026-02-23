"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface MapPickerProps {
  onSelectLocation: (latitude: string, longitude: string) => void;
  initialLatitude?: string;
  initialLongitude?: string;
}

// Dynamically import map container only (no SSR)
const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center bg-[#f8f5f2] rounded-lg">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#e6e0da] border-t-[#5540b7] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#6b6b6b]">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPicker({
  onSelectLocation,
  initialLatitude,
  initialLongitude,
}: MapPickerProps) {
  const [lat, setLat] = useState<number>(
    initialLatitude ? parseFloat(initialLatitude) : 28.6139
  );
  const [lng, setLng] = useState<number>(
    initialLongitude ? parseFloat(initialLongitude) : 77.209
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasGeolocation, setHasGeolocation] = useState(false);

  useEffect(() => {
    // Get user's current location if not provided
    if (!initialLatitude || !initialLongitude) {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            setHasGeolocation(true);
            setIsLoading(false);
          },
          (error) => {
            console.warn("Geolocation error:", error);
            setIsLoading(false);
          }
        );
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [initialLatitude, initialLongitude]);

  const handleConfirmLocation = () => {
    onSelectLocation(lat.toString(), lng.toString());
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[#f8f5f2] rounded-lg">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e6e0da] border-t-[#5540b7] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6b6b6b]">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 rounded-lg overflow-hidden border border-[#e6e0da]">
        <MapContent
          lat={lat}
          lng={lng}
          onMapClick={(newLat, newLng) => {
            setLat(newLat);
            setLng(newLng);
          }}
        />
      </div>

      <div className="bg-[#f8f5f2] p-4 rounded-lg">
        <p className="text-sm text-[#6b6b6b] mb-3">
          Click on the map to select your location or use the coordinates below
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-[#e6e0da] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-[#e6e0da] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirmLocation}
        className="w-full px-4 py-3 bg-[#5540b7] text-white font-medium rounded-lg hover:bg-[#3d2d7f] transition-colors"
      >
        Confirm Location
      </button>

      {hasGeolocation && (
        <p className="text-xs text-green-600 text-center">
          ✓ Using your current location
        </p>
      )}
    </div>
  );
}
