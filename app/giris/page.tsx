import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getAuthSnapshot } from "@/lib/auth";
import { loginAction } from "./actions";

export const metadata = { title: "Giriş Yap · Golden Oremar" };

export default async function LoginPage() {
  const { user } = await getAuthSnapshot();
  if (user) redirect("/");
  return <AuthForm mode="login" action={loginAction} />;
}
