"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button onClick={handleLogout} disabled={isLoggingOut}>
      Log out
    </Button>
  );
}
