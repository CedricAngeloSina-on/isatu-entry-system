import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ContentSection } from "~/components/content-section";
import { DataTable } from "~/components/entry-logs/data-table/data-table";
import { columns } from "~/components/entry-logs/data-table/columns";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";

export default async function MyVehiclesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  // Fetch entry logs using the tRPC getMyEntries route
  // const entryLogs = await api.entryLog.getMyEntries();

  // // Calculate pagination values based on your needs
  // const totalEntries = entryLogs.length;
  // const perPage = 10; // Adjust as needed
  // const pageCount = Math.ceil(totalEntries / perPage);

  return (
    <ContentSection title="My Vehicles" desc="Here are your list of vehicles.">
      <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <Button>Add Vehicle</Button>
        <DataTable
          data={[]}
          columns={columns}
          pageCount={1}
          currentPage={1}
          perPage={10}
        />
      </div>
    </ContentSection>
  );
}
