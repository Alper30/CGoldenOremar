import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getAuthSnapshot } from "@/lib/auth";
import { signupAction } from "../giris/actions";

export const metadata = { title: "Kayıt Ol · Golden Oremar" };

export default async function SignupPage() {
  const { user } = await getAuthSnapshot();
  if (user) redirect("/");
  return <AuthForm mode="signup" action={signupAction} />;
}
