import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ContentSection } from "~/components/content-section";
import { EntryLogsClient } from "~/components/entry-logs/entry-logs-client";

export default async function EntryLogsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  if (session?.user.role != "admin") {
    redirect("/profile");
  }

  return (
    <ContentSection
      title="Entry Logs"
      desc="Here are the recent vehicle entry logs."
    >
      <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <EntryLogsClient />
      </div>
    </ContentSection>
  );
}
