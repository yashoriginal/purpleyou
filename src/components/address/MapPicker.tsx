"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface MapPickerProps {
  onSelectLocation: (latitude: string, longitude: string) => void;
  initialLatitude?: string;
  initialLongitude?: string;
}

interface GeolocationCoords {
  latitude: number;
  longitude: number;
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
        // Request location permission explicitly
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            setHasGeolocation(true);
            setIsLoading(false);
          },
          (error) => {
            // Handle permission denied or other errors
            if (error.code === error.PERMISSION_DENIED) {
              console.warn("Location permission denied by user");
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              console.warn("Location information is unavailable");
            } else {
              console.warn("Error getting geolocation:", error.message);
            }
            setIsLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
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

  const handleRetryLocation = () => {
    setIsLoading(true);
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
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[#f8f5f2] rounded-lg">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e6e0da] border-t-[#5540b7] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6b6b6b] font-medium mb-2">Requesting your location...</p>
          <p className="text-sm text-[#6b6b6b]">
            Please allow location access in the permission prompt
          </p>
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
        <div className="flex items-start gap-2 mb-3">
          <p className="text-sm text-[#6b6b6b]">
            Click on the map to select your location or use the coordinates below
          </p>
          {hasGeolocation && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap font-medium">
              📍 Current location
            </span>
          )}
        </div>
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

      {hasGeolocation ? (
        <p className="text-xs text-green-600 text-center font-medium">
          ✓ Using your current location as default
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-amber-600 text-center">
            ⚠️ Using default location (Delhi). Enable location access for your current location.
          </p>
          <button
            type="button"
            onClick={handleRetryLocation}
            className="w-full px-3 py-2 bg-[#D3C9FF] text-[#5540b7] rounded text-sm font-medium hover:bg-[#c8b8ff] transition-colors"
          >
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}
