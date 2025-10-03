"use client"; // This makes it a client component

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { VehicleForm } from "~/components/vehicle-form";
import { useRouter } from "next/navigation";

export function VehicleDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleSubmissionSuccess = () => {
    setIsDialogOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="pb-4">Add Vehicle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new vehicle.
          </DialogDescription>
        </DialogHeader>
        <VehicleForm onSubmissionSuccess={handleSubmissionSuccess} />
      </DialogContent>
    </Dialog>
  );
}
