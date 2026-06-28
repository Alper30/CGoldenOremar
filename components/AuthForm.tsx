"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useStore } from "./store";
import type { AuthState } from "@/app/giris/actions";

type Action = (prev: AuthState, formData: FormData) => Promise<AuthState>;

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "signup";
  action: Action;
}) {
  const { t } = useStore();
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );
  const isSignup = mode === "signup";

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          {t("brandTag")}
        </p>
        <h1 className="mt-1 font-display text-3xl text-forest-deep">
          {t(isSignup ? "authSignupTitle" : "authLoginTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {t(isSignup ? "authSignupSub" : "authLoginSub")}
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          {isSignup && (
            <Field
              name="full_name"
              type="text"
              label={t("authName")}
              placeholder={t("authNamePh")}
              autoComplete="name"
              required
            />
          )}
          <Field
            name="email"
            type="email"
            label={t("authEmail")}
            placeholder="ornek@eposta.com"
            autoComplete="email"
            required
          />
          <Field
            name="password"
            type="password"
            label={t("authPassword")}
            placeholder="••••••••"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
          />
          {isSignup && (
            <Field
              name="phone"
              type="tel"
              label={t("authPhone")}
              placeholder="05xx xxx xx xx"
              autoComplete="tel"
            />
          )}

          {state.error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {state.error}
            </p>
          )}
          {state.info && (
            <p className="rounded-xl bg-amber-bg px-3 py-2 text-sm font-medium text-gold-deep">
              {state.info}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-full bg-gold text-sm font-semibold text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
          >
            {pending
              ? t("loading")
              : t(isSignup ? "authSignupCta" : "authLoginCta")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {t(isSignup ? "authHaveAccount" : "authNoAccount")}{" "}
          <Link
            href={isSignup ? "/giris" : "/kayit"}
            className="font-semibold text-forest hover:text-gold"
          >
            {t(isSignup ? "authToLogin" : "authToSignup")}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-line bg-cream px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
      />
    </label>
  );
}
