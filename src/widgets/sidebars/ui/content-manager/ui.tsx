import { CustomNavLink } from "features/custom-nav-link";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, toast } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ScrollArea,
} from "shared/ui";
import { sideBarContent } from "./lib";
import { useDispatch, useSelector } from "react-redux";
import {
  clearActiveChatHistory,
  clearAllChatHistory,
  setFilesToChat,
  setFolderId,
  setFolderToChat,
  setLastChatId,
} from "entities/client/lib";
import { useSignOutMutation } from "entities/user";
import { RootState } from "entities/store";

export const ContentManagerSidebar: React.FC = () => {
  const nav = useNavigate();
  const [links] = useState(sideBarContent);
  const [isNarrow, setIsNarrow] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user);
  const [signOut] = useSignOutMutation();

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleEscape, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [menuOpen]);

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
    dispatch(setFolderToChat(null));
    dispatch(setFolderId(""));
    dispatch(setFilesToChat([]));
    dispatch(setLastChatId(""));
    nav("/content-manager/create", { state: { isNew: true } });
  };

  const handleSignOut = async () => {
    try {
      await signOut(token).unwrap();
      toast({
        title: "Sign out successful",
      });
      localStorage.clear();
      window.location.href = "/auth";
    } catch (error) {
      console.error("Sign out failed:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "Sign out failed. Please try again",
      });
    }
  };

  const initials = (() => {
    if (!user) return "UN";

    if (user.first_name && user.last_name) {
      return (
        `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
        "UN"
      );
    }

    if (user.first_name) {
      return (user.first_name.slice(0, 2) || "UN").toUpperCase();
    }

    if (user.name) {
      const parts = user.name.trim().split(" ").filter(Boolean);
      if (parts.length > 1) {
        return (
          parts
            .map((p) => p[0]?.toUpperCase() ?? "")
            .slice(0, 2)
            .join("") || "UN"
        );
      }
      return (parts[0]?.slice(0, 2) || "UN").toUpperCase();
    }

    return "UN";
  })();

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
                  "font-bold ",
                  sidebarOpen ? "text-[40px]" : "text-[27px]"
                )}
              >
                Tolu AI
              </h2>
              {sidebarOpen && (
                <h3 className="text-[24px] font-semibold ">Creator Studio</h3>
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
                    hideArrow
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <button
          onClick={sidebarOpen ? () => {} : () => setMenuOpen(!menuOpen)}
          className={`flex gap-4 items-center ${sidebarOpen ? "pl-4 justify-between" : "justify-center"}`}
        >
          <Avatar className="mr-[20px]">
            <AvatarImage src={user?.photo} alt="Avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <p className="text-[#1D1D1F] hover:text-[#1C63DB]  text-[16px]/[22px] font-semibold">
              {user?.first_name ? user?.first_name : user?.name}{" "}
              {user?.last_name}
            </p>
          )}
          {sidebarOpen && (
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-[40px] h-[40px] p-2 transition-colors duration-200"
            >
              <MaterialIcon
                iconName="more_vert"
                className={cn(menuOpen ? "text-[#1C63DB]" : "text-black")}
              />
            </div>
          )}
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className={`absolute ${sidebarOpen ? "left-[90px] bottom-[80px]" : "left-[70px] bottom-[20px]"} 
                  mt-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 py-[12px] px-[20px]
                  flex flex-col gap-2 z-50
                  ${sidebarOpen && "before:content-[''] before:absolute before:-bottom-2 before:right-7 before:border-x-8 before:border-t-8 before:border-x-transparent before:border-t-white"}`}
            style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                nav("/content-manager/profile");
              }}
              className="flex items-center gap-3 text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
                <MaterialIcon iconName="account_circle" fill={1} />
              </div>
              Profile
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              className="flex items-center gap-3 text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
                <MaterialIcon iconName="exit_to_app" />
              </div>
              Sign out
            </button>
          </div>
        )}
      </div>
    </>
  );
};
