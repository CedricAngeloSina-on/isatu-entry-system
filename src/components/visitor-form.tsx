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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { vehicleTypeOptions } from "~/lib/constants";
import QRCodeGenerator from "~/components/qrcode-generator";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  vehicleColor: z.string().min(1, "Vehicle Color is required"),
  vehicleType: z.string().min(1, "Vehicle Type is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
});

export function VisitorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      vehicleColor: "",
      vehicleType: "",
      plateNumber: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Generate QR code data with URL encoding
      const qrURL = `name=${encodeURIComponent(values.name)}&vehicleColor=${encodeURIComponent(values.vehicleColor)}&vehicleType=${encodeURIComponent(values.vehicleType)}&plateNumber=${encodeURIComponent(values.plateNumber)}`;
      setQrData(qrURL);
    } catch (error) {
      console.error("QR generation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex-col gap-2">
          <h1 className="text-2xl font-bold">Visitor QR Voucher</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to generate a QR voucher
          </p>
        </div>

        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="vehicleColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Color</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleTypeOptions.map((vehicleType) => (
                      <SelectItem
                        key={vehicleType.value}
                        value={vehicleType.value}
                      >
                        {vehicleType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plate Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {qrData && <QRCodeGenerator qrURL={qrData} />}

        <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Generating QR..." : "Generate QR"}
        </Button>
      </form>
      <div className="pt-2 text-center text-sm">
        Already have an account?{" "}
        <Link href="/" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </Form>
  );
}
