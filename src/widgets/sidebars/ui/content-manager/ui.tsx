import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AiCreate from "shared/assets/icons/ai-create";
import { cn } from "shared/lib";
import { Button, ScrollArea } from "shared/ui";
import { sideBarContent } from "./lib";
import { CustomNavLink } from "features/custom-nav-link";

export const ContentManagerSidebar: React.FC = () => {
  const nav = useNavigate();
  const [links] = useState(sideBarContent);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      const w = window.innerWidth;
      setIsNarrow(w >= 1280 && w <= 1536);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-64px)] pr-8">
      <div
        className={cn(
          "flex flex-col gap-8 h-full",
          isNarrow ? "w-[81px] items-center" : "w-[284px]"
        )}
      >
        <div className="flex flex-col items-center text-center">
          <h2
            className={cn(
              "font-bold font-open",
              isNarrow ? "text-[27px]" : "text-[40px]"
            )}
          >
            TOLU
          </h2>
          {!isNarrow && (
            <h3 className="text-[24px] font-semibold font-open">
              Practitioner Admin
            </h3>
          )}
        </div>
        <div
          className={cn(
            "flex flex-col gap-[24px]",
            isNarrow ? "items-center" : "items-start"
          )}
        >
          <Button
            variant="brightblue"
            className="w-full"
            onClick={() => nav("/content-manager/create")}
          >
            <AiCreate />
            Create with Tolu
          </Button>
          <div
            className={cn(
              "flex flex-col",
              isNarrow ? "items-center" : "items-start"
            )}
          >
            {links.map((link) => (
              <CustomNavLink key={link.title} item={link} isNarrow={isNarrow} />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
