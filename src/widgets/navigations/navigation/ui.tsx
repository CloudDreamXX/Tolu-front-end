import { RootState } from "entities/store";
import { logout, useSignOutMutation } from "entities/user";
import { CustomNavLink } from "features/custom-nav-link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib";
import { ScrollArea } from "shared/ui";
import { sideBarContent } from "widgets/sidebars/ui/content-manager/lib";

type Props = {
  pageLocation: "content-manager" | "user-management";
};

export const Navigation: React.FC<Props> = ({ pageLocation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);

  const nav = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [menuMobOpen, setMenuMobOpen] = useState(false);
  const menuMobRef = useRef<HTMLDivElement>(null);
  const chatId = `new_chat_${Date.now()}`;
  const location = useLocation();
  const [signOut] = useSignOutMutation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setMenuMobOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, menuMobOpen]);

  const handleSignOut = async () => {
    try {
      await signOut(token).unwrap();
      toast({
        title: "Sign out successful",
      });
      dispatch(logout());
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

  const handleOpenChat = () => {
    setMenuMobOpen(false);
    nav(`/content-manager/library/${chatId}`, {
      state: {
        from: location,
      },
    });
  };

  return (
    <div
      className={`${location.pathname.startsWith(`/content-manager/library`) && location.pathname.split("/").length === 4 ? "fixed top-0 w-full" : ""} z-[5] xl:static ${location.pathname.startsWith("/content-manager/library") ? "bg-white" : ""} ${location.pathname.startsWith("/content-manager") || location.pathname.startsWith("/clients") ? "xl:hidden" : ""} xl:bg-transparent flex flex-row items-center justify-center xl:h-[78px] gap-[30px] px-[16px] py-[12px] md:px-[24px] md:py-[16px] xl:px-[48px] xl:py-[19px]`}
    >
      {/* Mobile Hamburger */}
      <div className="flex items-center justify-between w-full xl:hidden">
        <div className="flex flex-col">
          <h1 className="text-[32px] md:text-[40px] font-[700] leading-tight">
            Tolu
          </h1>
          <p className="text-[16px] md:text-[18px] font-[700] h-[21px] md:h-[27px] leading-normal">
            {pageLocation === "user-management" ? "Admin" : "Creator Studio"}
          </p>
        </div>
        <div className="flex items-center gap-[16px]">
          <button
            onClick={handleOpenChat}
            className="px-[16px] py-[11px] rounded-[1000px] bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[16px] font-[600] leading-[22px]"
          >
            AI Assistant
          </button>
          <button onClick={() => setMenuMobOpen(true)} aria-label="Open menu">
            <MaterialIcon
              iconName="menu"
              size={40}
              className="text-black w-[32px] md:w-[40px]"
            />
          </button>
        </div>
      </div>

      {/* Full-screen Drawer */}
      {menuMobOpen && (
        <div className="fixed inset-0 bg-[#F1F3F5] top-[70px] md:top-0 md:bg-black md:bg-opacity-40 flex items-center justify-center z-[999]">
          <div
            className="fixed top-0 right-0 bottom-0 left-0 bg-white z-[999] p-[4] pr-0 flex flex-col 
             md:w-[390px] md:right-[10px] md:top-[10px] md:bottom-[10px] md:left-auto md:rounded-[16px]"
            ref={menuMobRef}
          >
            <div className="flex items-center justify-center pt-4 mb-6">
              <div className="flex flex-col items-center">
                <h1 className="text-[32px] md:text-[40px] font-[700]  leading-normal">
                  Tolu
                </h1>
                <p className="text-[16px] md:text-[18px] font-[700]  leading-normal">
                  Creator Studio
                </p>
              </div>
              <button
                onClick={() => setMenuMobOpen(false)}
                aria-label="Close menu"
                className="absolute top-[16px] right-[16px] z-10"
              >
                <span className="text-2xl font-bold">
                  <MaterialIcon iconName="close" />
                </span>
              </button>
            </div>
            <ScrollArea className="h-full px-4">
              <div className="flex flex-col gap-4 mt-6">
                {sideBarContent.map((link) => (
                  <CustomNavLink
                    item={link}
                    onClick={() => setMenuMobOpen(false)}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="flex flex-col gap-[16px] mt-6 py-[16px] px-[32px] ">
              <button
                onClick={() => {
                  setMenuMobOpen(false);
                  nav("/content-manager/profile");
                }}
                className="flex gap-4 items-center pl-4 bg-[#F3F6FB] w-full py-[8px] px-[16px] rounded-[8px] justify-between"
              >
                {/* <Avatar>
                  <AvatarImage src={user?.photo} alt="Avatar" />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar> */}
                <p className="text-[#1D1D1F] hover:text-[#1C63DB]  text-[16px]/[22px] font-semibold">
                  Profile
                </p>
                <span className="ml-auto">
                  <MaterialIcon iconName="keyboard_arrow_right" />
                </span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex gap-[12px] py-[16px] text-[16px] text-[#1C63DB] font-semibold cursor-pointer select-none"
              >
                <MaterialIcon iconName="exit_to_app" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative hidden ml-auto xl:flex">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="transition-colors duration-200"
        >
          <MaterialIcon
            iconName="menu"
            size={40}
            className={menuOpen ? "text-[#1C63DB]" : "text-black"}
          />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 p-3
             flex flex-col gap-2 z-50
             before:absolute before:-top-2 before:right-4 before:border-8 before:border-transparent before:border-b-white"
            style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                nav("/content-manager/profile");
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
  );
};
