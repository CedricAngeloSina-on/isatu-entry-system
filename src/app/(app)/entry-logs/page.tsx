import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ContentSection } from "~/components/content-section";
import { DataTable } from "~/components/entry-logs/data-table/data-table";
import { columns } from "~/components/entry-logs/data-table/columns";
import { api } from "~/trpc/server";

export default async function EntryLogsPage() {
  const session = await auth();
  if (!session?.user && session?.user.role != "admin") {
    redirect("/");
  }

  // Fetch entry logs using the tRPC getAllEntries route
  const entryLogs = await api.entryLog.getAllEntries();

  // Calculate pagination values based on your needs
  const totalEntries = entryLogs.length;
  const perPage = 10; // Adjust as needed
  const pageCount = Math.ceil(totalEntries / perPage);

  return (
    <ContentSection
      title="Entry Logs"
      desc="Here are the recent vehicle entry logs."
    >
      <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <DataTable
          data={entryLogs}
          columns={columns}
          pageCount={pageCount}
          currentPage={1}
          perPage={perPage}
        />
      </div>
    </ContentSection>
  );
}
