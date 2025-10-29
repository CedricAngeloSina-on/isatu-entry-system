import { VisitorForm } from "~/components/visitor-form";

export default async function VisitorPage() {
  return (
    <div
      className="flex min-h-svh w-full items-center justify-center bg-contain bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/logo_bg.png')",
      }}
    >
      <div className="w-full max-w-lg rounded-xl border-2 p-6 shadow-lg backdrop-blur-xl">
        <VisitorForm />
      </div>
    </div>
  );
}
