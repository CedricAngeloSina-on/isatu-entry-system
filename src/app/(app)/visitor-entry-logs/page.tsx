import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ContentSection } from "~/components/content-section";
import { VisitorEntryLogsClient } from "~/components/visitor-entry-logs/visitor-logs-client";

export default async function VisitorEntryLogsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  if (session?.user.role != "admin") {
    redirect("/profile");
  }

  return (
    <ContentSection
      title="Visitor Entry Logs"
      desc="Here are the recent visitor entry logs."
    >
      <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <VisitorEntryLogsClient />
      </div>
    </ContentSection>
  );
}
