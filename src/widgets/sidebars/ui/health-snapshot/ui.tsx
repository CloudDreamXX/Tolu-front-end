import { setChat, setFolderId } from "entities/client/lib";
import { SearchAiSmallInput } from "entities/search";
import { RootState } from "entities/store";
import { useSignOutMutation } from "entities/user";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { toast } from "shared/lib/hooks/use-toast";
import { Badge, Button } from "shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import { ClientChatList } from "./ClientChatList";
import WrapperLibraryFolderTree from "./FolderTree";
import { applyIncomingMessage, chatsSelectors } from "entities/chat/chatsSlice";
import { ChatMessageModel, ChatSocketService } from "entities/chat";
import { useFetchAllChatsQuery } from "entities/chat/api";
import { useGetPendingInvitationsQuery } from "entities/client";

export const HealthSnapshotSidebar: React.FC = () => {
  const nav = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  useFetchAllChatsQuery(undefined, { skip: !token });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatList = useSelector(chatsSelectors.selectAll);
  const handlerRef = useRef<(m: ChatMessageModel) => void>(() => { });
  const [signOut] = useSignOutMutation();
  const { data: invitations } = useGetPendingInvitationsQuery();

  const unreadMessagesCount = chatList.reduce((count, chat) => {
    return count + (chat.unreadCount || 0);
  }, 0);

  const menuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    handlerRef.current = (msg: ChatMessageModel) => {
      dispatch(applyIncomingMessage({ msg }));
    };
  }, [dispatch]);

  useEffect(() => {
    const stableListener = (m: ChatMessageModel) => handlerRef.current(m);

    ChatSocketService.on("new_message", stableListener);
    return () => ChatSocketService.off("new_message", stableListener);
  }, []);

  const toggleLibrary = () => {
    dispatch(setFolderId(""));
    setIsLibraryOpen(!isLibraryOpen);
    setSidebarOpen(true);
    if (isNarrow) {
      setMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setIsLibraryOpen(false);
    setIsMessagesOpen(false);
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
        <div
          className={`flex flex-col justify-between h-full overflow-y-hidden ${sidebarOpen ? "w-[268px]" : "w-[81px] items-center"
            } `}
        >
          <div className="flex flex-col gap-[32px]">
            <NavLink
              to={"/"}
              className="flex flex-col items-center text-center"
            >
              <h2
                className={`${sidebarOpen ? "text-[46.667px] " : "text-[27px]"} font-bold `}
              >
                Tolu AI
              </h2>
            </NavLink>

            <div className="flex flex-col px-[14px] gap-[18px] w-full">
              <SearchAiSmallInput sidebarOpen={sidebarOpen} />
            </div>

            <div
              className={`flex flex-col w-full max-h-[50vh] overflow-y-auto ${sidebarOpen ? "items-start" : "items-center"}`}
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
                <MaterialIcon iconName="web_stories" fill={1} />
                {!sidebarOpen ? "" : "Library"}
              </NavLink>
              {isLibraryOpen && (
                <WrapperLibraryFolderTree
                  onCloseSideBar={() => {
                    if (isNarrow) {
                      setSidebarOpen(false);
                    }
                    setIsLibraryOpen(false);
                  }}
                />
              )}
              <NavLink
                to={"/messages"}
                end={false}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMessagesOpen(!isMessagesOpen);
                  setSidebarOpen(true);
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 w-full px-[16px] py-[16px] text-lg font-semibold hover:text-[#1C63DB] relative",
                    isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]",
                    sidebarOpen ? "" : "justify-center "
                  )
                }
              >
                <MaterialIcon iconName="forum" fill={1} />
                {sidebarOpen ? "Messages" : ""}
                <span
                  className={cn(
                    "absolute top-0 right-0 text-xs font-medium text-white bg-blue-500 rounded-full px-2 py-0.5",
                    sidebarOpen ? "top-2 left-36 right-auto" : "top-0 right-2 ",
                    { hidden: !unreadMessagesCount }
                  )}
                >
                  {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                </span>
              </NavLink>
              {isMessagesOpen && (
                <ClientChatList
                  onCloseSideBar={() => {
                    if (isNarrow) {
                      setSidebarOpen(false);
                    }
                    setIsMessagesOpen(false);
                  }}
                />
              )}
            </div>
          </div>

          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={sidebarOpen ? () => { } : () => setMenuOpen(!menuOpen)}
            className={`flex gap-4 items-center justify-between relative ${sidebarOpen ? "pl-4" : ""}`}
          >
            {invitations && invitations.data.length > 0 && (
              <Badge
                variant="destructive"
                className={`absolute -top-1 ${sidebarOpen ? "left-11" : "left-7"} z-50 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold`}
              >
                {invitations.data.length}
              </Badge>
            )}
            <Avatar>
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
          </Button>

          {menuOpen && (
            <div
              ref={menuRef}
              className={`absolute ${sidebarOpen ? "left-[90px] bottom-[80px]" : "left-[70px] bottom-[20px]"} 
            mt-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 py-[12px] px-[20px]
            flex flex-col gap-2 z-50
            ${sidebarOpen && "before:content-[''] before:absolute before:-bottom-2 before:right-7 before:border-x-8 before:border-t-8 before:border-x-transparent before:border-t-white"}`}
              style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
            >
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={() => {
                  setMenuOpen(false);
                  nav("/profile");
                }}
                className="flex items-center gap-3 text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
                  <MaterialIcon iconName="account_circle" fill={1} />
                </div>
                Profile
              </Button>

              <Button
                variant={"unstyled"}
                size={"unstyled"}
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
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
