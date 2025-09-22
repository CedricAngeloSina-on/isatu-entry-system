import Image from "next/image";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

import { LoginForm } from "~/components/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/profile");
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/isatu-bg.jpg"
          width={1000}
          height={1000}
          alt="Image"
          className="absolute inset-0 h-full w-full object-right dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
