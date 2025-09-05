import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import QRCodeGenerator from "~/components/qrcode-generator";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { ContentSection } from "~/components/content-section";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <ContentSection title="Profile" desc="Here are your basic account details">
      <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <div className="mx-auto w-full">
          {/* ID Card Container */}
          <div className="flex gap-8">
            {/* Left side - Form fields */}
            <div className="space-y-2">
              {/* Name */}
              <div>
                <Label className="flex-shrink-0 text-lg">Name:</Label>
                <Input value={session.user.name!} disabled />
              </div>

              {/* ID Number */}
              <div>
                <Label className="flex-shrink-0 text-lg">ID Number:</Label>
                <Input value={session.user.idNumber!} disabled />
              </div>

              {/* College */}
              <div>
                <Label className="-shrink-0 text-lg">College:</Label>
                <Input value={session.user.college!} disabled />
              </div>

              {/* Plate Number */}
              <div>
                <Label className="-shrink-0 text-lg">Plate Number:</Label>
                <Input value={session.user.plateNumber!} disabled />
              </div>

              {/* Vehicle Type */}
              <div>
                <Label className="flex-shrink-0 text-lg">Vehicle Type</Label>
                <Input value={session.user.vehicleType!} disabled />
              </div>

              {/* Email */}
              <div>
                <Label className="flex-shrink-0 text-lg">Email:</Label>
                <Input value={session.user.email!} disabled />
              </div>
            </div>

            {/* Right side - Picture and QR */}
            <div className="w-48 space-y-4">
              {/* Picture placeholder */}
              <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-black bg-gray-50">
                {/* <Input className=" text-lg text-gray-600 ">
                  Picture
                </Input> */}
              </div>

              {/* QR Code */}
              <div className="h-40 w-full">
                <QRCodeGenerator />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentSection>
  );
}
