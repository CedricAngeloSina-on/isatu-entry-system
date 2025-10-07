"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import { api } from "~/trpc/react";

type QRResult = {
  rawValue: string;
  [key: string]: unknown; // allow other properties without strict typing
};

export function QRScanner() {
  const createEntry = api.entryLog.create.useMutation({
    onSuccess: () => {
      console.log("Entry logged successfully");
      // You can add success toast/notification here
    },
    onError: (error) => {
      console.error("Failed to log entry:", error.message);
      // You can add error toast/notification here
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
        const input_user_id = params.get("user_id");
        const input_plateNumber = params.get("plateNumber");

        createEntry.mutate({
          user_id: String(input_user_id),
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
