"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { api } from "~/trpc/react";

type QRResult = {
  rawValue: string;
  [key: string]: unknown; // allow other properties without strict typing
};

export function VisitorQRScanner() {
  const createEntry = api.visitorEntryLog.create.useMutation({
    onSuccess: () => {
      console.log("Entry logged successfully");
      toast.success("Scanned Successfully");
    },
    onError: (error) => {
      console.error("Failed to log entry:", error.message);
      toast.error("Something went wrong");
    },
  });

  const handleScan = async (result: unknown) => {
    try {
      console.log("QR Code scanned:", result);

      // Narrow type: make sure result is an array and has objects with rawValue
      if (Array.isArray(result) && result.length > 0) {
        const qrResult = result[0] as QRResult;
        const qrData = qrResult.rawValue;

        const params = new URLSearchParams(qrData);
        const input_name = params.get("name");
        const input_vehicleColor = params.get("vehicleColor");
        const input_vehicleType = params.get("vehicleType");
        const input_plateNumber = params.get("plateNumber");

        createEntry.mutate({
          name: String(input_name),
          vehicleColor: String(input_vehicleColor),
          vehicleType: String(input_vehicleType),
          plateNumber: String(input_plateNumber),
        });
      } else {
        console.warn("No QR code data found");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Scanner
        onScan={handleScan}
        onError={(error) => console.error("Scanner error:", error)}
      />

      {/* Optional: Show loading state */}
      {createEntry.isPending && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Logging entry...
        </div>
      )}

      {/* Optional: Show error state */}
      {createEntry.error && (
        <div className="mt-4 text-center text-sm text-red-600">
          Error: {createEntry.error.message}
        </div>
      )}
    </div>
  );
}
