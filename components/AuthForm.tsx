"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "./store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthState } from "@/app/giris/actions";

type Action = (prev: AuthState, formData: FormData) => Promise<AuthState>;
type Provider = "google" | "apple" | "github";

export function AuthForm({
  mode,
  action,
  oauthError,
}: {
  mode: "login" | "signup";
  action: Action;
  oauthError?: boolean;
}) {
  const { t } = useStore();
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    oauthError ? { error: t("authSocialSoon") } : {},
  );
  const [social, setSocial] = useState<Provider | null>(null);
  const [socialErr, setSocialErr] = useState<string | null>(null);
  const isSignup = mode === "signup";

  async function signInWith(provider: Provider) {
    setSocial(provider);
    setSocialErr(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/hesabim`,
      },
    });
    if (error) {
      setSocial(null);
      setSocialErr(t("authSocialSoon"));
    }
    // Hata yoksa tarayıcı sağlayıcıya yönlenir (geri dönüş /auth/callback).
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-card shadow-[0_30px_80px_-50px_rgba(31,39,28,0.45)] lg:grid-cols-2">
        {/* Form paneli */}
        <div className="p-6 sm:p-9 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {t("brandTag")}
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-forest-deep">
            {t(isSignup ? "authSignupTitle" : "authLoginTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {t(isSignup ? "authHaveAccount" : "authNoAccount")}{" "}
            <Link
              href={isSignup ? "/giris" : "/kayit"}
              className="font-semibold text-forest underline-offset-2 hover:text-gold hover:underline"
            >
              {t(isSignup ? "authToLogin" : "authToSignup")}
            </Link>
          </p>

          <form action={formAction} className="mt-7 space-y-4">
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

            {(state.error || socialErr) && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {state.error || socialErr}
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold text-sm font-semibold text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
            >
              {pending
                ? t("loading")
                : t(isSignup ? "authSignupCta" : "authLoginCta")}
              {!pending && (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </form>

          {/* Ayraç */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              {t("authOr")}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Sosyal giriş */}
          <div className="space-y-2.5">
            <SocialButton
              label={t("authGoogle")}
              loading={social === "google"}
              disabled={social !== null}
              onClick={() => signInWith("google")}
              icon={<GoogleIcon />}
            />
            <SocialButton
              label={t("authApple")}
              loading={social === "apple"}
              disabled={social !== null}
              onClick={() => signInWith("apple")}
              icon={<AppleIcon />}
            />
            <SocialButton
              label={t("authGithub")}
              loading={social === "github"}
              disabled={social !== null}
              onClick={() => signInWith("github")}
              icon={<GithubIcon />}
            />
          </div>

          {/* Şartlar */}
          <p className="mt-6 text-center text-xs leading-relaxed text-muted">
            {t("authTermsPre")}{" "}
            <Link href="/mesafeli-satis-sozlesmesi" className="font-medium text-forest hover:text-gold">
              {t("authTermsService")}
            </Link>{" "}
            {t("authTermsAnd")}{" "}
            <Link href="/gizlilik-politikasi" className="font-medium text-forest hover:text-gold">
              {t("authTermsPrivacy")}
            </Link>
            {t("authTermsPost")}
          </p>
        </div>

        {/* Görsel panel (yalnız büyük ekran) */}
        <div className="relative hidden lg:block">
          <Image
            src="/images/hero.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 0px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <h2 className="font-display text-2xl leading-tight text-cream">
              {t("authAsideTitle")}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-cream/85">
              {t("authAsideSub")}
            </p>
          </div>
        </div>
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
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-line bg-cream px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-gold focus:ring-2 focus:ring-gold/15"
      />
    </label>
  );
}

function SocialButton({
  label,
  icon,
  loading,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line bg-card text-sm font-semibold text-ink transition-colors hover:border-gold/50 hover:bg-cream disabled:opacity-60"
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span>{loading ? "…" : label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1 .7-2.4 1.1-4.1 1.1-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.2a7.2 7.2 0 0 1 0-4.5V6.6H1.3a12 12 0 0 0 0 10.8l4-3.2z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1C6.2 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1 2.8-2.1c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.2 5.3c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.3z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 1.5a10.5 10.5 0 0 0-3.3 20.5c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.3-3.5-1.3-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.2-4.7-5.1 0-1.1.4-2 1.1-2.8-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.6 9.6 0 0 1 5 0c1.9-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7.7.8 1.1 1.7 1.1 2.8 0 3.9-2.4 4.8-4.7 5.1.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5z" />
    </svg>
  );
}
