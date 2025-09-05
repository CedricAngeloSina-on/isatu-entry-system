import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ContentSection } from "~/components/content-section";

export default async function EntryLogsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <ContentSection
      title="Entry Logs"
      desc="Here are the recent vehicle entry logs."
    >
      <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        {/* <UsersTable data={users} search={search} navigate={navigate} /> */}
      </div>
    </ContentSection>
  );
}
