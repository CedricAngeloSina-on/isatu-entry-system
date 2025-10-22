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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b text-lg font-semibold print:hidden">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            Systematic Campus Entry Log-in System
          </div>
        </header>
        <main className="flex-1">{children}</main>

        <footer className="text-muted-foreground mt-auto flex justify-center border-t p-4 text-center text-sm print:hidden">
          <div className="max-w-lg italic">
            The safety of our University remains our paramount priority. We
            maintain an unwavering and absolute commitment to securing the
            well-being of every student and faculty member within our academic
            community.
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
