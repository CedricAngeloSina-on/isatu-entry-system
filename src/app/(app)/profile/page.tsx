import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import QRCodeGenerator from "~/components/qrcode-generator";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { ContentSection } from "~/components/content-section";
import Image from "next/image";
import { api } from "~/trpc/server";
import { PrintButton } from "~/components/print-button";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const vehicles = await api.vehicle.getMyVehicles();

  return (
    <ContentSection title="Profile" desc="Here are your basic account details">
      <>
        <div className="mb-4 flex justify-end">
          <PrintButton />
        </div>

        <div
          id="id-cards"
          className="flex w-full flex-col items-center gap-6 py-4 lg:flex-row"
        >
          {/* ---------------- FRONT OF ID ---------------- */}
          <div className="relative aspect-[27/17] w-[480px] max-w-full overflow-hidden rounded-lg border border-gray-400 bg-white shadow-md">
            {/* ---- HEADER (Inside Front ID) ---- */}
            <div className="absolute top-0 right-0 left-0 flex h-[15%] items-center justify-between bg-blue-700 px-4 text-white">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={30}
                  height={30}
                  className="rounded-sm"
                />
                <h2 className="text-sm font-semibold">
                  Iloilo Science and Technology University
                </h2>
              </div>
              <span className="text-[10px] opacity-90">Vehicle Pass</span>
            </div>

            {/* ---- Main Content ---- */}
            <div className="absolute inset-0 grid grid-cols-2 gap-2 p-3 pt-12 text-xs">
              {/* Left: Photo */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative h-56 w-44 rounded border border-gray-300 shadow-sm">
                  <Image
                    src={session.user.image ?? ""}
                    alt="Profile photo"
                    fill
                    className="rounded object-cover"
                  />
                </div>
              </div>

              {/* Right: Info fields */}
              <div className="flex flex-col justify-center space-y-1">
                <div className="pt-2">
                  <Label className="text-xs font-semibold">Name</Label>
                  <Input
                    value={session.user.name ?? ""}
                    disabled
                    className="h-6 text-xs"
                  />
                </div>
                <div className="pt-2">
                  <Label className="text-xs font-semibold">ID Number</Label>
                  <Input
                    value={session.user.idNumber ?? ""}
                    disabled
                    className="h-6 text-xs"
                  />
                </div>
                <div className="pt-2">
                  <Label className="text-xs font-semibold">College</Label>
                  <Input
                    value={session.user.college ?? ""}
                    disabled
                    className="h-6 text-xs"
                  />
                </div>
                <div className="pt-2">
                  <Label className="text-xs font-semibold">Email</Label>
                  <Input
                    value={session.user.email ?? ""}
                    disabled
                    className="h-6 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- BACK OF ID ---------------- */}
          <div className="relative aspect-[27/17] w-[480px] max-w-full overflow-hidden rounded-lg border border-gray-400 bg-white shadow-md">
            {/* ---- HEADER (Same as front header) ---- */}
            <div className="absolute top-0 right-0 left-0 flex h-[15%] items-center justify-between bg-blue-700 px-4 text-white">
              <p className="text-sm font-semibold">Scan for Verification</p>
            </div>

            {/* ---- Main Content ---- */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 pt-12">
              <div className="flex justify-center gap-x-8">
                {vehicles?.map((vehicle) => (
                  <div key={vehicle.id} className="flex flex-col items-center">
                    <QRCodeGenerator
                      qrURL={`user_id=${vehicle.user_id}&plateNumber=${vehicle.plateNumber}`}
                    />
                    <span className="mt-1 text-sm">{vehicle.plateNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    </ContentSection>
  );
}
