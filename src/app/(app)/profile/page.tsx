import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import QRCodeGenerator from "~/components/qrcode-generator";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { ContentSection } from "~/components/content-section";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <ContentSection title="Profile" desc="Here are your basic account details">
      <div className="flex-1 overflow-auto py-1 lg:flex-row">
        <div className="w-full">
          {/* ID Card Container */}
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Form fields */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Name */}
              <div className="lg:w-[300px]">
                <Label className="flex-shrink-0 text-lg">Name:</Label>
                <Input value={session.user.name!} disabled />
              </div>

              {/* ID Number */}
              <div className="lg:w-[300px]">
                <Label className="flex-shrink-0 text-lg">ID Number:</Label>
                <Input value={session.user.idNumber!} disabled />
              </div>

              {/* College */}
              <div className="lg:w-[300px]">
                {" "}
                <Label className="flex-shrink-0 text-lg">College:</Label>
                <Input value={session.user.college!} disabled />
              </div>

              {/* Plate Number */}
              <div className="lg:w-[300px]">
                {" "}
                <Label className="flex-shrink-0 text-lg">Plate Number:</Label>
                <Input value={session.user.plateNumber!} disabled />
              </div>

              {/* Vehicle Type */}
              <div className="lg:w-[300px]">
                {" "}
                <Label className="flex-shrink-0 text-lg">Vehicle Type:</Label>
                <Input value={session.user.vehicleType!} disabled />
              </div>

              {/* Email */}
              <div className="lg:w-[300px]">
                {" "}
                <Label className="flex-shrink-0 text-lg">Email:</Label>
                <Input value={session.user.email!} disabled />
              </div>
            </div>

            {/* Right side - Picture and QR */}
            <div className="ml-4 w-48 space-y-4">
              {/* Picture placeholder */}
              <div className="relative flex h-48 w-full items-center justify-center rounded-lg border-2 border-black bg-gray-50">
                <Image
                  src={session.user.image!}
                  alt={""}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg" // Optional: apply rounded corners to the image itself
                />
              </div>

              {/* QR Code */}
              <div className="h-48 w-full">
                <QRCodeGenerator uuid={session.user.id} />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left side - Form fields */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Name */}
              <div className="lg:w-[300px]">
                <Label className="flex-shrink-0 text-lg">Name:</Label>
                <Input value={session.user.name!} disabled />
              </div>

              {/* ID Number */}
              <div className="lg:w-[300px]">
                <Label className="flex-shrink-0 text-lg">ID Number:</Label>
                <Input value={session.user.idNumber!} disabled />
              </div>

              {/* College */}
              <div className="lg:w-[300px]">
                {" "}
                <Label className="flex-shrink-0 text-lg">College:</Label>
                <Input value={session.user.college!} disabled />
              </div>

              {/* Plate Number */}
              <div className="lg:w-[300px]">
                {" "}
                <Label className="flex-shrink-0 text-lg">Plate Number:</Label>
                <Input value={session.user.plateNumber!} disabled />
              </div>

              {/* Vehicle Type */}
              <div className="lg:w-[300px]">
                {" "}
                <Label className="flex-shrink-0 text-lg">Vehicle Type:</Label>
                <Input value={session.user.vehicleType!} disabled />
              </div>

              {/* Email */}
              <div className="lg:w-[300px]">
                {" "}
                <Label className="flex-shrink-0 text-lg">Email:</Label>
                <Input value={session.user.email!} disabled />
              </div>
            </div>

            {/* Right side - Picture and QR */}
            <div className="ml-4 w-48 space-y-4">
              {/* Picture placeholder */}
              <div className="relative flex h-48 w-full items-center justify-center rounded-lg border-2 border-black bg-gray-50">
                <Image
                  src={session.user.image!}
                  alt={""}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg" // Optional: apply rounded corners to the image itself
                />
              </div>

              {/* QR Code */}
              <div className="h-48 w-full">
                <QRCodeGenerator uuid={session.user.id} />
              </div>
              <div className="h-48 w-full">
                <QRCodeGenerator uuid={session.user.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentSection>
  );
}
