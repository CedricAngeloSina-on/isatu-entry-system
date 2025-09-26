"use client";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[\w.-]+@(isatu\.edu\.ph|students\.isatu\.edu\.ph)$/,
      "Email must end with @isatu.edu.ph or @students.isatu.edu.ph",
    ),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle NextAuth error messages from URL params
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "CredentialsSignin":
          const message = searchParams.get("message");
          if (message === "User not found") {
            toast.error("No account found with this email address");
          } else if (message === "Incorrect password") {
            toast.error("Incorrect password. Please try again");
          } else {
            toast.error(
              "Invalid credentials. Please check your email and password",
            );
          }
          break;
        default:
          toast.error("An error occurred during login");
      }
      // Clean up the URL by removing error params
      router.replace("/auth/signin", { scroll: false });
    }
  }, [searchParams, router]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // Don't redirect automatically
      });

      if (result?.error) {
        // Handle specific error messages
        if (result.error === "User not found") {
          toast.error("No account found with this email address");
        } else if (result.error === "Incorrect password") {
          toast.error("Incorrect password. Please try again");
        } else {
          toast.error(
            "Invalid credentials. Please check your email and password",
          );
        }
      } else if (result?.ok) {
        toast.success("Login successful!");
        // Redirect to profile or dashboard
        router.push("/profile");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email and password below to login to your account
          </p>
        </div>

        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}
