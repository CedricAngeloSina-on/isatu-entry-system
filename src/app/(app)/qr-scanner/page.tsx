import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { QRScanner } from "~/components/qr-scanner";
import { ContentSection } from "~/components/content-section";

export default async function QRScannerPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  if (session?.user.role != "admin") {
    redirect("/profile");
  }

  return (
    <ContentSection title="QR Scanner" desc="Scan QR codes of drivers">
      <QRScanner />
    </ContentSection>
  );
}
