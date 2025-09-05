"use client";
import { Scanner } from "@yudiel/react-qr-scanner";

export function QRScanner() {
  return <Scanner onScan={(result) => console.log(result)} />;
}
