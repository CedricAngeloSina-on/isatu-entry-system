import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { QRScanner } from "~/components/qr-scanner";

export default async function QRScannerPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <QRScanner />
      </div>
    </div>
  );
}
