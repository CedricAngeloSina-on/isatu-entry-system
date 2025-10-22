import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

import { LoginForm } from "~/components/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/profile");
  }

  return (
    <div
      className="flex min-h-svh w-full items-center justify-center bg-contain bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: "url('/logo_bg.png')",
      }}
    >
      <div className="w-full max-w-lg rounded-xl border-2 p-6 shadow-lg backdrop-blur-xl">
        <LoginForm />
      </div>
    </div>
  );
}
