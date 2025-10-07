import { auth } from "~/server/auth";
import { AppSidebar } from "~/components/app-sidebar";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  const role = session?.user.role;

  return (
    <SidebarProvider>
      <AppSidebar className="print:hidden" isAdmin={String(role)} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b print:hidden">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
