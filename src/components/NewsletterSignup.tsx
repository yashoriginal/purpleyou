"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/services/newsletter.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await subscribeToNewsletter(email, "web");
      success("Subscribed! Check your inbox for exclusive offers.");
      setEmail("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to subscribe to newsletter";
      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Email Signup Section */}
      <section className="bg-[#D3C9FF] py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wider mb-4">
            Join the PURPLE YOU Club
          </h2>
          <p className="text-base text-[#111111] font-light mb-8">
            Get exclusive offers, early access to new collections, and styling
            tips delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-[#e6e0da] text-[#111111] placeholder-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-[#111111] text-[#D3C9FF] px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#5540b7] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          <p className="text-xs text-[#111111] mt-4 font-light">
            We respect your inbox. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
