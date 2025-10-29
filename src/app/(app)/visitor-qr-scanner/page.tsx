import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ContentSection } from "~/components/content-section";
import { VisitorQRScanner } from "~/components/visitor-qr-scanner";

export default async function QRScannerPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  if (session?.user.role != "admin") {
    redirect("/profile");
  }

  return (
    <ContentSection
      title="Visitor QR Scanner"
      desc="Scan Visitor QR vouchers of drivers"
    >
      <VisitorQRScanner />
    </ContentSection>
  );
}
