import { Separator } from "~/components/ui/separator";

type ContentSectionProps = {
  title: string;
  desc: string;
  children: React.JSX.Element;
};

export function ContentSection({ title, desc, children }: ContentSectionProps) {
  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-[length:calc(100vh-4rem)] bg-right bg-no-repeat p-6"
      style={{
        backgroundImage: "url('/logo_bg.png')",
      }}
    >
      <div className="px-4 py-6">
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight print:hidden">
              {title}
            </h2>
            <p className="text-muted-foreground print:hidden">{desc}</p>
          </div>
        </div>
        <Separator className="my-4 flex-none print:hidden" />
        <div className="faded-bottom h-full w-full overflow-y-auto scroll-smooth">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
