import { AppHeader } from "@/components/header-section";
import { Separator } from "@/components/ui/separator";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"></header>
      <div>
        <div className="flex items-center gap-2 px-4">
          <AppHeader />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </div>
    </>
  );
};

export default Layout;
