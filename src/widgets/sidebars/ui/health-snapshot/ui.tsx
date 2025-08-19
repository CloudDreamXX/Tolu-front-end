import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserService } from "entities/user";
import { RootState } from "entities/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import ChatsCircle from "shared/assets/icons/chats-circle";
import Library from "shared/assets/icons/library";
import Dots from "shared/assets/icons/threeDots";
import { ChevronDown, ChevronLast, ChevronUp, User } from "lucide-react";
import SignOutIcon from "shared/assets/icons/signout";
import { toast } from "shared/lib/hooks/use-toast";
import { SearchAiSmallInput } from "entities/search";
import WrapperLibraryFolderTree from "./FolderTree";
import { setChat, setFolderId } from "entities/client/lib";
import { ClientChatList } from "./ClientChatList";
import { Button } from "shared/ui";
import { cn } from "shared/lib";

export const HealthSnapshotSidebar: React.FC = () => {
  const nav = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkWidth = () => {
      const w = window.innerWidth;
      setIsNarrow(w >= 1280 && w <= 1536);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const handleSignOut = async () => {
    try {
      await UserService.signOut(token);
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

  const toggleLibrary = () => {
    dispatch(setFolderId(""));
    setIsLibraryOpen(!isLibraryOpen);
    setSidebarOpen(true);
    if (isNarrow) {
      // Close the menu if it's mobile and clicked
      setMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setIsLibraryOpen(false);
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
        <div
          className={`flex flex-col justify-between h-full overflow-y-hidden ${
            sidebarOpen ? "w-[268px]" : "w-[81px] items-center"
          } `}
        >
          <div className="flex flex-col gap-[32px]">
            <NavLink
              to={"/"}
              className="flex flex-col items-center text-center"
            >
              <h2
                className={`${sidebarOpen ? "text-[46.667px] " : "text-[27px]"} font-bold font-open`}
              >
                Tolu AI
              </h2>
            </NavLink>

            <div className="flex flex-col px-[14px] gap-[18px]">
              <SearchAiSmallInput />
            </div>

            <div
              className={`flex flex-col w-full ${sidebarOpen ? "items-start" : "items-center"}`}
            >
              <NavLink
                to={"/library"}
                onClick={(e) => {
                  e.preventDefault();
                  toggleLibrary();
                  dispatch(setChat([]));
                  nav("/library");
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 w-full px-[16px] py-[16px] text-lg font-semibold hover:text-[#1C63DB]",
                    isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]",
                    sidebarOpen ? "" : "justify-center "
                  )
                }
              >
                <Library />
                {!sidebarOpen ? "" : "Library"}
                {sidebarOpen &&
                  (isLibraryOpen ? (
                    <ChevronUp className="w-5 h-5 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0" />
                  ))}
              </NavLink>
              {isLibraryOpen && (
                <WrapperLibraryFolderTree
                  onCloseSideBar={() => {
                    setSidebarOpen(false);
                    setIsLibraryOpen(false);
                  }}
                />
              )}
              <NavLink
                to={"/messages"}
                end={false}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 w-full px-[16px] py-[16px] text-lg font-semibold hover:text-[#1C63DB]",
                    isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]",
                    sidebarOpen ? "" : "justify-center "
                  )
                }
              >
                <ChatsCircle />
                {isNarrow ? "" : "Messages"}
              </NavLink>
              <ClientChatList />
            </div>
          </div>

          <button
            onClick={sidebarOpen ? () => {} : () => setMenuOpen(!menuOpen)}
            className={`flex gap-4 items-center justify-between ${sidebarOpen ? "pl-4" : ""}`}
          >
            <Avatar>
              <AvatarImage src={user?.photo} alt="Avatar" />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <p className="text-[#1D1D1F] hover:text-[#1C63DB] font-[Nunito] text-[16px]/[22px] font-semibold">
                {user?.name}
              </p>
            )}
            {sidebarOpen && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 transition-colors duration-200"
              >
                <Dots color={menuOpen ? "#1C63DB" : "black"} />
              </button>
            )}
          </button>

          {menuOpen && (
            <div
              className={`absolute ${sidebarOpen ? "left-[90px] bottom-[80px]" : "left-[70px] bottom-[20px]"} 
            mt-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 py-[12px] px-[20px]
            flex flex-col gap-2 z-50
            ${sidebarOpen && "before:content-[''] before:absolute before:-bottom-2 before:right-7 before:border-x-8 before:border-t-8 before:border-x-transparent before:border-t-white"}`}
              style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  nav("/profile");
                }}
                className="flex items-center gap-3 text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
                  <User size={24} />
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
                  <SignOutIcon />
                </div>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
