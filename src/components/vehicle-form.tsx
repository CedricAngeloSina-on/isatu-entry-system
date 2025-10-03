"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as React from "react";
import { toast } from "sonner";

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
import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { vehicleTypeOptions } from "~/lib/constants";

const formSchema = z.object({
  vehicleColor: z.string().min(1, "Vehicle Color is required"),
  vehicleType: z.string().min(1, "Vehicle Type is required"),
  plateNumber: z.string().min(1, "Plate Number is required"),
});

interface VehicleFormProps {
  onSubmissionSuccess?: () => void;
}

export function VehicleForm({ onSubmissionSuccess }: VehicleFormProps) {
  const vehicleMutation = api.vehicle.create.useMutation({
    onSuccess: () => {
      toast.success("Vehicle added successfully!");
      form.reset();
      onSubmissionSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleColor: "",
      vehicleType: "",
      plateNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await vehicleMutation.mutateAsync(values);
    } catch (error) {
      console.error("Vehicle creation error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-1 gap-2">
          <h1 className="text-2xl font-bold">Add a vehicle</h1>
        </div>

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="vehicleColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Color</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plate Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2">
          <Button type="submit" disabled={vehicleMutation.isPending}>
            {vehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
