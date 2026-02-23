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
  const { user, updateUserDetails, isLoading, error } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [userName, setUserName] = useState("");

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setUserName(user.userName || user.name || "");
    }
  }, [user]);

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

    try {
      const updateData: UpdateUserDetailsRequest = {
        mobile: user?.phoneNumber || user?.mobile || "",
        userName,
        address: user?.address || "",
        pincode: user?.pincode || "",
        latitude: user?.latitude || "",
        longitude: user?.longitude || "",
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
          Update your name
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
