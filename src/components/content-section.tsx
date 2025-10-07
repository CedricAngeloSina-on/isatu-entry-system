import { Separator } from "~/components/ui/separator";

type ContentSectionProps = {
  title: string;
  desc: string;
  children: React.JSX.Element;
};

export function ContentSection({ title, desc, children }: ContentSectionProps) {
  return (
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
      <div className="faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12">
        <div className="-mx-1 px-1.5">{children}</div>
      </div>
    </div>
  );
}
