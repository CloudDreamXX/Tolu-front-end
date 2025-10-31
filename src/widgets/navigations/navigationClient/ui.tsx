import {
  clearAllChatHistory,
  clearActiveChatHistory,
  setFolderToChat,
  setFolderId,
  setFilesToChat,
  setLastChatId,
} from "entities/client/lib";
import { RootState } from "entities/store";
import { logout } from "entities/user";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import { ReferAFriendPopup } from "widgets/ReferAFriendPopup/ui";
import { ClientChatList } from "widgets/sidebars/ui/health-snapshot/ClientChatList";
import WrapperLibraryFolderTree from "widgets/sidebars/ui/health-snapshot/FolderTree";

export const NavigationClient: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [menuMobOpen, setMenuMobOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const nav = useNavigate();
  const menuMobRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();
  const isCoach = location.pathname.startsWith("/content-manager");
  const basePath = isCoach ? "/content-manager" : "";
  const chatId = `new_chat_${Date.now()}`;
  const [referAFriendOpen, setReferAFriendOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuMobRef.current &&
        !menuMobRef.current.contains(event.target as Node)
      ) {
        setMenuMobOpen(false);
      }
    }
    if (menuMobOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuMobOpen]);

  const handleSignOut = () => {
    setMenuMobOpen(false);
    dispatch(logout());
    nav("/auth");
  };

  const toggleLibrary = () => {
    setIsLibraryOpen(!isLibraryOpen);
    if (isLibraryOpen) {
      setMenuMobOpen(false);
    }
  };

  const handleOpenChat = () => {
    dispatch(clearAllChatHistory());
    dispatch(clearActiveChatHistory());
    dispatch(setFolderToChat(null));
    dispatch(setFolderId(""));
    dispatch(setFilesToChat([]));
    dispatch(setLastChatId(""));
    if (
      location.pathname.startsWith(`${basePath}/library`) &&
      location.pathname.split("/").length > 2
    ) {
      setMenuMobOpen(false);
      nav(`${basePath}/library`);
    } else {
      setMenuMobOpen(false);
      nav(`${basePath}/library/${chatId}`, {
        state: {
          from: location,
        },
      });
    }
  };

  return (
    <div className="relative">
      {/* Top nav for desktop */}
      <div className="hidden bg-white items-center justify-between h-[78px] px-[48px] py-[19px]">
        <div className="flex flex-row gap-[30px] w-full">
          {/* <NavLink
            to={"/health-snapshot"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
              }`
            }
          >
            <Heartbeat />
            Health Snapshot
          </NavLink> */}

          <NavLink
            to={"/library"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
              }`
            }
          >
            <MaterialIcon iconName="web_stories" fill={1} />
            Library
          </NavLink>

          <NavLink
            to={"/messages"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
              }`
            }
          >
            <MaterialIcon iconName="forum" fill={1} />
            Messages
          </NavLink>
        </div>
        <div className="relative" ref={menuMobRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            // aria-label="Toggle menu"
            className="p-2 transition-colors duration-200"
          >
            <MaterialIcon
              iconName="menu"
              size={40}
              className={menuOpen ? "text-[#1C63DB]" : "text-black"}
            />
          </button>

          {menuMobOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 p-3
             flex flex-col gap-2 z-50
             before:absolute before:-top-2 before:right-4 before:border-8 before:border-transparent before:border-b-white"
              style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
            >
              <button
                onClick={() => {
                  setMenuMobOpen(false);
                  nav("/profile");
                }}
                className="flex items-center gap-3 px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
                  <MaterialIcon iconName="account_circle" />
                </div>
                Profile
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-3 px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
                  <MaterialIcon iconName="exit_to_app" />
                </div>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Hamburger */}
      <div
        className={`flex xl:hidden justify-between items-center p-[16px] md:p-6 ${location.pathname.startsWith(`${basePath}/library`) && location.pathname.split("/").length > 2 ? "bg-white md:bg-transparent fixed top-0 w-full md:static" : ""}`}
      >
        <h1 className="text-[27px] md:text-[46px] font-[700] ">Tolu</h1>
        <div className="flex items-center gap-[16px]">
          <button
            onClick={handleOpenChat}
            className="px-[8px] py-[6px] md:py-4 rounded-[1000px] bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[14px]  md:text-[16px] font-[600] leading-[22px]"
          >
            AI Assistant
          </button>
          <button onClick={() => setMenuMobOpen(true)} aria-label="Open menu">
            <MaterialIcon iconName="menu" size={40} className="w-[32px]" />
          </button>
        </div>
      </div>

      {/* Full-screen Drawer */}
      {menuMobOpen && (
        <div className="fixed inset-0 bg-[#F1F3F5] top-[70px] md:top-0 md:bg-black md:bg-opacity-40 flex items-center justify-center z-[999]">
          <div
            className="fixed top-0 right-0 bottom-0 left-0 bg-white z-[999] p-[16px] flex flex-col 
             md:w-[390px] md:right-[10px] md:top-[10px] md:bottom-[10px] md:left-auto md:rounded-[16px]"
            ref={menuMobRef}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="md:text-[36.5px] text-[27px] font-[700] ">Tolu</h1>
              <button
                onClick={() => setMenuMobOpen(false)}
                aria-label="Close menu"
              >
                <span className="text-2xl font-bold">
                  <MaterialIcon iconName="close" />
                </span>
              </button>
            </div>
            <div className="flex flex-col gap-[16px] mt-[8px] mb-[72px]">
              <Button
                variant={"brightblue"}
                className="w-full h-[44px] text-base font-semibold"
                onClick={handleOpenChat}
              >
                <MaterialIcon iconName="stars_2" fill={1} />
                Ask Tolu
              </Button>
              <Button
                variant={"light-blue"}
                className="md:hidden w-full h-[44px] text-base font-semibold text-[#1C63DB]"
                onClick={() => {
                  setMenuMobOpen(false);
                  setReferAFriendOpen(true);
                }}
              >
                Refer a friend
              </Button>
            </div>

            <nav className="flex flex-col mb-auto max-h-[50vh] overflow-y-auto">
              {/* <NavLink
                to={"/health-snapshot"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-[16px] py-[16px] text-lg hover:text-[#1C63DB] ${
                    isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
                  }`
                }
                onClick={() => setMenuMobOpen(false)}
              >
                <Heartbeat />
                Health Snapshot
              </NavLink> */}

              <NavLink
                to={"/library"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-[16px] py-[16px] text-lg hover:text-[#1C63DB] ${isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
                  }`
                }
                onClick={toggleLibrary}
              >
                <MaterialIcon iconName="web_stories" fill={1} />
                Library
              </NavLink>
              {isLibraryOpen && (
                <WrapperLibraryFolderTree
                  onPopupClose={() => setMenuMobOpen(false)}
                />
              )}

              <NavLink
                to={"/messages"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-[16px] py-[16px] text-lg hover:text-[#1C63DB] ${isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
                  }`
                }
                onClick={() => setMenuMobOpen(false)}
              >
                <MaterialIcon iconName="forum" fill={1} />
                Messages
              </NavLink>
              <ClientChatList onPopupClose={() => setMenuMobOpen(false)} />
            </nav>

            <div className="flex flex-col gap-[16px] mt-6">
              <button
                onClick={() => {
                  nav("/profile");
                  setMenuMobOpen(false);
                }}
                className="flex gap-4 items-center pl-4 bg-[#F3F6FB] w-full py-[8px] px-[16px] rounded-[8px] justify-between"
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
                <p className="text-[#1D1D1F] hover:text-[#1C63DB]  text-[16px]/[22px] font-semibold">
                  {user?.first_name ? user?.first_name : user?.name}{" "}
                  {user?.last_name}
                </p>
                <span className="ml-auto">
                  <MaterialIcon iconName="keyboard_arrow_right" />
                </span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex justify-center gap-[12px] py-[8px] px-[16px] text-[16px] text-[#1C63DB] font-semibold cursor-pointer select-none"
              >
                <MaterialIcon iconName="exit_to_app" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          className="absolute right-[40px] top-[60px] mt-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 p-3
             flex flex-col gap-2 z-50
             before:absolute before:-top-2 before:right-4 before:border-8 before:border-transparent before:border-b-white"
          style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              nav("/profile");
            }}
            className="flex items-center gap-3 px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100"
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
            className="flex items-center gap-3 px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center p-2 rounded-[10px] bg-white shadow-lg">
              <MaterialIcon iconName="exit_to_app" />
            </div>
            Sign out
          </button>
        </div>
      )}

      <ReferAFriendPopup
        isOpen={referAFriendOpen}
        onClose={() => setReferAFriendOpen(false)}
      />
    </div>
  );
};
