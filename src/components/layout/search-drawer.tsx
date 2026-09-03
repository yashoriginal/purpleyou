"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { CloseIcon, SearchIcon } from "@/components/ui/icons";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { closeSearch } from "@/store/slices/ui-slice";

export function SearchDrawer() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchOpen = useAppSelector((state) => state.ui.searchOpen);

  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dispatch(closeSearch());
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, searchOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    dispatch(closeSearch());

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  if (!searchOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200]">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => dispatch(closeSearch())}
        className="absolute inset-0 bg-black/70"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search PurpleYou"
        className="relative z-10 border-b border-[var(--border)] bg-[var(--background)]"
      >
        <div className="site-container">
          <div className="flex min-h-20 items-center gap-4 md:min-h-24">
            <SearchIcon className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]" />

            <form onSubmit={handleSubmit} className="flex min-w-0 flex-1">
              <label htmlFor="global-search" className="sr-only">
                Search products
              </label>

              <input
                ref={inputRef}
                id="global-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search PurpleYou"
                autoComplete="off"
                className="w-full bg-transparent text-lg text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] md:text-2xl"
              />
            </form>

            <button
              type="button"
              aria-label="Close search"
              onClick={() => dispatch(closeSearch())}
              className="flex h-10 w-10 shrink-0 items-center justify-center transition-opacity hover:opacity-60"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="border-t border-[var(--border)] py-5">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Popular categories
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/collections/earrings"
                onClick={() => dispatch(closeSearch())}
                className="text-sm hover:text-[var(--brand)]"
              >
                Earrings
              </Link>

              <Link
                href="/collections/necklaces"
                onClick={() => dispatch(closeSearch())}
                className="text-sm hover:text-[var(--brand)]"
              >
                Necklaces
              </Link>

              <Link
                href="/collections/rings"
                onClick={() => dispatch(closeSearch())}
                className="text-sm hover:text-[var(--brand)]"
              >
                Rings
              </Link>

              <Link
                href="/collections/bracelets"
                onClick={() => dispatch(closeSearch())}
                className="text-sm hover:text-[var(--brand)]"
              >
                Bracelets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
