import { CustomNavLink } from "features/custom-nav-link";
import { ChevronLast } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AiCreate from "shared/assets/icons/ai-create";
import { cn } from "shared/lib";
import { Button, ScrollArea } from "shared/ui";
import { sideBarContent } from "./lib";

export const ContentManagerSidebar: React.FC = () => {
  const nav = useNavigate();
  const [links] = useState(sideBarContent);
  const [isNarrow, setIsNarrow] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkWidth = () => {
      const w = window.innerWidth;
      setIsNarrow(w >= 1280 && w <= 1536);
      setSidebarOpen(w >= 1536);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {isNarrow && (
        <Button
          variant={"brightblue"}
          size={"icon"}
          onClick={toggleSidebar}
          className={cn(
            "absolute z-20 text-white top-4",
            "transition-all duration-300",
            sidebarOpen ? "left-[320px]" : "left-[110px]"
          )}
        >
          <ChevronLast
            className={cn(
              "transition-transform duration-300",
              sidebarOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      )}

      <div
        className={cn(
          "transition-all duration-300 pr-1",
          "flex flex-col h-full ",
          sidebarOpen ? "w-[300px]" : "w-[81px]"
        )}
      >
        <ScrollArea className="h-[calc(100vh-64px)] bg-white ">
          <div className={cn("flex flex-col gap-8 h-full pr-4")}>
            <div className="flex flex-col items-center text-center">
              <h2
                className={cn(
                  "font-bold font-open",
                  sidebarOpen ? "text-[40px]" : "text-[27px]"
                )}
              >
                Tolu AI
              </h2>
              {sidebarOpen && (
                <h3 className="text-[24px] font-semibold font-open">
                  Creator Studio
                </h3>
              )}
            </div>
            <div
              className={cn(
                "flex flex-col gap-[24px]",
                sidebarOpen ? "items-start" : "items-center"
              )}
            >
              <Button
                variant="brightblue"
                className="w-full"
                onClick={() => nav("/content-manager/create")}
              >
                <AiCreate />
                {sidebarOpen && "Create with Tolu"}
              </Button>
              <div
                className={cn(
                  "flex flex-col",
                  sidebarOpen ? "items-start" : "items-center"
                )}
              >
                {links.map((link) => (
                  <CustomNavLink
                    key={link.title}
                    item={link}
                    isNarrow={!sidebarOpen}
                    setOpenSidebar={setSidebarOpen}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
