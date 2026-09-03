"use client";

import { useEffect, useState, type FormEvent } from "react";

import { CloseIcon, UserIcon } from "@/components/ui/icons";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  selectAuthError,
  selectAuthMobile,
  selectAuthStatus,
  selectAuthUser,
  selectIsResendingOtp,
} from "@/store/selectors/auth-selectors";

import {
  clearAuthError,
  logoutUser,
  requestOtp,
  resendOtp,
  resetOtpFlow,
  verifyOtp,
} from "@/store/slices/auth-slice";

import { closeAuth } from "@/store/slices/ui-slice";

export function AuthDrawer() {
  const dispatch = useAppDispatch();

  const authOpen = useAppSelector((state) => state.ui.authOpen);

  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const authMobile = useAppSelector(selectAuthMobile);
  const error = useAppSelector(selectAuthError);

  const isResendingOtp = useAppSelector(selectIsResendingOtp);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!authOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dispatch(closeAuth());
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [authOpen, dispatch]);

  if (!authOpen) {
    return null;
  }

  async function handleMobileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    dispatch(clearAuthError());

    try {
      await dispatch(requestOtp(mobile)).unwrap();
    } catch {
      // Redux already contains the error.
    }
  }

  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authMobile) {
      return;
    }

    dispatch(clearAuthError());

    try {
      await dispatch(
        verifyOtp({
          mobile: authMobile,
          otp,
        }),
      ).unwrap();

      setOtp("");
    } catch {
      // Redux already contains the error.
    }
  }

  async function handleResendOtp() {
    if (!authMobile) {
      return;
    }

    dispatch(clearAuthError());

    try {
      await dispatch(resendOtp(authMobile)).unwrap();
    } catch {
      // Redux already contains the error.
    }
  }

  async function handleLogout() {
    dispatch(clearAuthError());

    try {
      await dispatch(logoutUser()).unwrap();

      setMobile("");
      setOtp("");

      dispatch(closeAuth());
    } catch {
      // Redux already contains the error.
    }
  }

  function handleChangeNumber() {
    setOtp("");
    dispatch(resetOtpFlow());
  }

  function handleClose() {
    dispatch(clearAuthError());
    dispatch(closeAuth());
  }

  const waitingForOtp = status === "awaitingOtp" || status === "verifying";

  const checkingSession = status === "idle" || status === "restoring";

  return (
    <div className="fixed inset-0 z-[210]">
      <button
        type="button"
        aria-label="Close account"
        onClick={handleClose}
        className="absolute inset-0 bg-black/70"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="PurpleYou account"
        className="absolute right-0 top-0 z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--background)]"
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-[var(--border)] px-5 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              PurpleYou
            </p>

            <p className="mt-1 text-sm">Account</p>
          </div>

          <button
            type="button"
            aria-label="Close account"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-6">
          {checkingSession ? (
            <CheckingSession />
          ) : user ? (
            <AuthenticatedAccount
              userName={user.userName}
              mobile={user.mobile}
              loggingOut={status === "loggingOut"}
              error={error}
              onLogout={handleLogout}
            />
          ) : waitingForOtp ? (
            <OtpForm
              mobile={authMobile ?? ""}
              otp={otp}
              setOtp={setOtp}
              verifying={status === "verifying"}
              resending={isResendingOtp}
              error={error}
              onSubmit={handleOtpSubmit}
              onResend={handleResendOtp}
              onChangeNumber={handleChangeNumber}
            />
          ) : (
            <MobileForm
              mobile={mobile}
              setMobile={setMobile}
              loading={status === "requestingOtp"}
              error={error}
              onSubmit={handleMobileSubmit}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

function CheckingSession() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="h-7 w-7 animate-spin rounded-full border border-[var(--muted-foreground)] border-t-[var(--foreground)]" />

      <p className="mt-5 text-sm text-[var(--muted-foreground)]">
        Checking your account...
      </p>
    </div>
  );
}

interface MobileFormProps {
  mobile: string;
  setMobile: (value: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function MobileForm({
  mobile,
  setMobile,
  loading,
  error,
  onSubmit,
}: MobileFormProps) {
  return (
    <div className="mx-auto max-w-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)]">
        <UserIcon className="h-5 w-5" />
      </div>

      <h2 className="mt-7 text-2xl font-medium">Sign in to PurpleYou</h2>

      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
        Enter your mobile number and we&apos;ll send you a one-time verification
        code.
      </p>

      <form onSubmit={onSubmit} className="mt-8">
        <label
          htmlFor="auth-mobile"
          className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted-foreground)]"
        >
          Mobile number
        </label>

        <div className="mt-3 flex border border-[var(--border)] bg-[var(--surface)] focus-within:border-[var(--muted-foreground)]">
          <span className="flex items-center border-r border-[var(--border)] px-4 text-sm text-[var(--muted-foreground)]">
            +91
          </span>

          <input
            id="auth-mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={mobile}
            maxLength={10}
            placeholder="9876543210"
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "");

              setMobile(digits.slice(0, 10));
            }}
            className="min-h-13 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || mobile.length !== 10}
          className="mt-6 flex min-h-13 w-full items-center justify-center bg-[var(--foreground)] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Sending OTP..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

interface OtpFormProps {
  mobile: string;
  otp: string;

  setOtp: (value: string) => void;

  verifying: boolean;
  resending: boolean;

  error: string | null;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;

  onResend: () => void;

  onChangeNumber: () => void;
}

function OtpForm({
  mobile,
  otp,
  setOtp,
  verifying,
  resending,
  error,
  onSubmit,
  onResend,
  onChangeNumber,
}: OtpFormProps) {
  return (
    <div className="mx-auto max-w-sm">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
        Verification
      </p>

      <h2 className="mt-4 text-2xl font-medium">Enter your OTP</h2>

      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
        We sent a 4-digit verification code to{" "}
        <span className="text-[var(--foreground)]">{mobile}</span>.
      </p>

      <button
        type="button"
        onClick={onChangeNumber}
        className="mt-3 text-xs underline underline-offset-4 transition-opacity hover:opacity-70"
      >
        Change number
      </button>

      <form onSubmit={onSubmit} className="mt-8">
        <label
          htmlFor="auth-otp"
          className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted-foreground)]"
        >
          Verification code
        </label>

        <input
          id="auth-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          maxLength={4}
          autoFocus
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");

            setOtp(digits.slice(0, 4));
          }}
          className="mt-3 min-h-14 w-full border border-[var(--border)] bg-[var(--surface)] px-4 text-center text-xl tracking-[0.5em] outline-none focus:border-[var(--muted-foreground)]"
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={verifying || otp.length !== 4}
          className="mt-6 flex min-h-13 w-full items-center justify-center bg-[var(--foreground)] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {verifying ? "Verifying..." : "Verify & Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm text-[var(--muted-foreground)]">
          Didn&apos;t receive the code?{" "}
        </span>

        <button
          type="button"
          disabled={resending}
          onClick={onResend}
          className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

interface AuthenticatedAccountProps {
  userName?: string;
  mobile: string;
  loggingOut: boolean;
  error: string | null;
  onLogout: () => void;
}

function AuthenticatedAccount({
  userName,
  mobile,
  loggingOut,
  error,
  onLogout,
}: AuthenticatedAccountProps) {
  return (
    <div className="mx-auto max-w-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface)]">
        <UserIcon className="h-6 w-6" />
      </div>

      <p className="mt-7 text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
        Signed in
      </p>

      <h2 className="mt-3 text-2xl font-medium">
        {userName?.trim() || "PurpleYou Member"}
      </h2>

      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{mobile}</p>

      <div className="mt-8 border-y border-[var(--border)]">
        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-between text-left transition-opacity hover:opacity-70"
        >
          <span className="text-sm">My Orders</span>

          <span className="text-[var(--muted-foreground)]">→</span>
        </button>

        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-between border-t border-[var(--border)] text-left transition-opacity hover:opacity-70"
        >
          <span className="text-sm">Saved Addresses</span>

          <span className="text-[var(--muted-foreground)]">→</span>
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
        Order history and saved addresses will be connected later.
      </p>

      {error && (
        <p role="alert" className="mt-5 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={loggingOut}
        onClick={onLogout}
        className="mt-8 flex min-h-12 w-full items-center justify-center border border-[var(--border)] text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loggingOut ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
