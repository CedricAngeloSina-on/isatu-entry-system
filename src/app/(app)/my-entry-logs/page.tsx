import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ContentSection } from "~/components/content-section";
import { MyEntryLogsClient } from "~/components/my-entry-logs/my-entry-logs-client";

export default async function MyEntryLogsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <ContentSection
      title="Entry Logs"
      desc="Here are the recent vehicle entry logs."
    >
      <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <MyEntryLogsClient />
      </div>
    </ContentSection>
  );
}
