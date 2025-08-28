import { CustomNavLink } from "features/custom-nav-link";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button, ScrollArea } from "shared/ui";
import { sideBarContent } from "./lib";
import { useDispatch } from "react-redux";
import {
  clearActiveChatHistory,
  clearAllChatHistory,
} from "entities/client/lib";

export const ContentManagerSidebar: React.FC = () => {
  const nav = useNavigate();
  const [links] = useState(sideBarContent);
  const [isNarrow, setIsNarrow] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

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

  const handleCreateWithTolu = () => {
    dispatch(clearAllChatHistory());
    dispatch(clearActiveChatHistory());
    nav("/content-manager/create");
  };

  return (
    <>
      {isNarrow && (
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={toggleSidebar}
          className={cn(
            "absolute z-20 text-blue-700 top-2/3 bg-white hover:bg-gray-50 hover:text-blue-700 rounded-full",
            "transition-all duration-300",
            sidebarOpen ? "left-[296px]" : "left-[76px]"
          )}
        >
          <MaterialIcon
            iconName="last_page"
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
                onClick={handleCreateWithTolu}
              >
                <MaterialIcon iconName={"stars_2"} fill={1} />
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
