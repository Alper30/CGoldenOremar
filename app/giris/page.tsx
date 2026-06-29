import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getAuthSnapshot } from "@/lib/auth";
import { loginAction } from "./actions";

export const metadata = { title: "Giriş Yap · Golden Oremar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ oauth_error?: string }>;
}) {
  const { user } = await getAuthSnapshot();
  if (user) redirect("/");
  const { oauth_error } = await searchParams;
  return (
    <AuthForm mode="login" action={loginAction} oauthError={Boolean(oauth_error)} />
  );
}
