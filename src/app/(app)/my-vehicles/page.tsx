import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ContentSection } from "~/components/content-section";
import { DataTable } from "~/components/vehicles/data-table/data-table";
import { columns } from "~/components/vehicles/data-table/columns";
import { api } from "~/trpc/server";
import { VehicleDialog } from "~/components/vehicle-dialog"; // Import the new client component

export default async function MyVehiclesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  // Fetch entry logs using the tRPC getMyVehicles route
  const vehicles = await api.vehicle.getMyVehicles();

  // // Calculate pagination values based on your needs
  const totalVehicles = vehicles.length;
  const perPage = 10; // Adjust as needed
  const pageCount = Math.ceil(totalVehicles / perPage);

  console.log(vehicles);

  return (
    <ContentSection title="My Vehicles" desc="Here are your list of vehicles.">
      <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        {totalVehicles < 2 && <VehicleDialog />}
        <DataTable
          data={vehicles}
          columns={columns}
          pageCount={pageCount}
          currentPage={1}
          perPage={10}
        />
      </div>
    </ContentSection>
  );
}
