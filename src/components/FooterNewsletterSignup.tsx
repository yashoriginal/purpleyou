"use client";

import { useState, useCallback } from "react";
import { subscribeToNewsletter } from "@/services/newsletter.service";

interface FooterNewsletterSignupProps {
  onSuccess?: () => void;
}

export function FooterNewsletterSignup({
  onSuccess,
}: FooterNewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email || !email.includes("@")) {
        setMessage({ type: "error", text: "Please enter a valid email address" });
        return;
      }

      setIsLoading(true);
      setMessage(null);

      try {
        await subscribeToNewsletter(email, "web");
        setMessage({ type: "success", text: "Subscribed! Check your inbox." });
        setEmail("");
        onSuccess?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to subscribe to newsletter";
        setMessage({ type: "error", text: errorMessage });
      } finally {
        setIsLoading(false);
      }
    },
    [email, onSuccess],
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 bg-white border border-[#e6e0da] text-[#111111] placeholder-[#6b6b6b] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-[#5540b7] text-white px-6 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p
          className={`text-xs mt-2 font-light ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </>
  );
}
