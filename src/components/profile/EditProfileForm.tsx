"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  AuthServiceError,
  UpdateUserDetailsRequest,
} from "@/services/auth.service";

interface EditProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditProfileForm({
  onSuccess,
  onCancel,
}: EditProfileFormProps) {
  const { user, updateUserDetails, isLoading, error, clearError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setUserName(user.userName || user.name || "");
      setAddress(user.address || "");
      setPincode(user.pincode || "");
      setLatitude(user.latitude || "");
      setLongitude(user.longitude || "");
    }
  }, [user]);

  /**
   * Get geolocation
   */
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setFormError("Geolocation is not supported by your browser");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setGeoLoading(false);
        setFormError(null);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setFormError("Unable to get your location. Please enter manually.");
        setGeoLoading(false);
      },
    );
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    // Validate inputs
    if (!userName?.trim()) {
      setFormError("Name is required");
      return;
    }

    if (!address?.trim()) {
      setFormError("Address is required");
      return;
    }

    if (!pincode?.trim() || pincode.length < 6) {
      setFormError("Valid pincode is required (minimum 6 digits)");
      return;
    }

    if (!latitude?.trim() || !longitude?.trim()) {
      setFormError("Location coordinates are required");
      return;
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      setFormError("Invalid coordinates. Please try again.");
      return;
    }

    try {
      const updateData: UpdateUserDetailsRequest = {
        mobile: user?.phoneNumber || user?.mobile || "",
        userName,
        address,
        pincode,
        latitude,
        longitude,
      };

      await updateUserDetails(updateData);
      setSuccessMessage("Profile updated successfully!");

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof AuthServiceError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update profile";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-[#111111] mb-1">
          Edit Profile
        </h3>
        <p className="text-sm text-[#6b6b6b]">
          Update your personal information and address
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7] text-[#111111] placeholder-[#6b6b6b]"
            required
          />
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-2">
            Address *
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete address"
            rows={4}
            className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7] text-[#111111] placeholder-[#6b6b6b] resize-none"
            required
          />
        </div>

        {/* Pincode Field */}
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-2">
            Pincode *
          </label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setPincode(value);
            }}
            placeholder="Enter your 6-digit pincode"
            maxLength={10}
            className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7] text-[#111111] placeholder-[#6b6b6b]"
            required
          />
        </div>

        {/* Location Section */}
        <div className="border-t border-[#e6e0da] pt-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-[#111111] mb-3">
              Location Coordinates *
            </h4>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={geoLoading}
              className="mb-4 px-4 py-2 bg-[#D3C9FF] text-[#5540b7] rounded-lg font-medium hover:bg-[#c8b8ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {geoLoading ? "Getting Location..." : "📍 Auto-detect Location"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-2">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 13.04"
                className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7] text-[#111111] placeholder-[#6b6b6b]"
                required
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-2">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 80.23"
                className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7] text-[#111111] placeholder-[#6b6b6b]"
                required
              />
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {(formError || error) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              {formError || error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 font-medium">
              ✓ {successMessage}
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#5540b7] text-white font-medium rounded-lg hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border border-[#111111] text-[#111111] font-medium rounded-lg hover:bg-[#111111] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
