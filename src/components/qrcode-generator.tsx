"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface QRCodeGeneratorProps {
  uuid?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  uuid = "1f5700a4-18cc-45d8-9823-21f60459cef9",
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Generate QR code as data URL
        const url = await QRCode.toDataURL(uuid, {
          width: 256,
          margin: 2,
        });
        setQrCodeUrl(url);
      } catch (err) {
        setError("Failed to generate QR code");
        console.error(err);
      }
    };

    if (uuid) {
      void generateQRCode();
    }
  }, [uuid]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {qrCodeUrl ? (
        <div className="size-48 border-4">
          <Image
            src={qrCodeUrl}
            alt={`QR Code for UUID: ${uuid}`}
            className="block w-full"
            width="192"
            height={192}
          />
        </div>
      ) : (
        <div className="flex h-64 w-64 animate-pulse items-center justify-center rounded-lg bg-gray-200">
          <span className="text-gray-500">Generating QR Code...</span>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
