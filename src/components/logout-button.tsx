"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut({
        redirect: false, // Don't redirect automatically
      });

      toast("Logged out");

      // Redirect to login page
      router.push("/login");
      router.refresh(); // Refresh to update session state
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return <Button onClick={handleLogout}>Log out</Button>;
}
