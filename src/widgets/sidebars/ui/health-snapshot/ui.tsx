import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AvatarWoman from "shared/assets/images/AvatarWoman.png";
import { UserService } from "entities/user";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import ChatsCircle from "shared/assets/icons/chats-circle";
import Library from "shared/assets/icons/library";
import Heartbeat from "shared/assets/icons/heartbeat";
import Dots from "shared/assets/icons/threeDots";
import { User } from "lucide-react";
import SignOutIcon from "shared/assets/icons/signout";
import { toast } from "shared/lib/hooks/use-toast";
import { SearchAiSmallInput } from "entities/search";

export const HealthSnapshotSidebar: React.FC = () => {
  const nav = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
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

  return (
    <div
      className={`flex flex-col justify-between h-full ${isNarrow ? "w-[81px] items-center" : "w-[268px]"}`}
    >
      <div className="flex flex-col gap-[32px]">
        <NavLink to={"/"} className="flex flex-col items-center text-center">
          <h2
            className={`${isNarrow ? "text-[27px]" : "text-[46.667px]"} font-bold font-open`}
          >
            TOLU
          </h2>
        </NavLink>
        <div className="flex flex-col px-[14px] gap-[18px]">
          <SearchAiSmallInput />
        </div>

        <div
          className={`flex flex-col w-full ${isNarrow ? "items-center" : "items-start"}`}
        >
          {/* <NavLink
            to={"/health-snapshot"}
            className={({ isActive }) =>
              `flex items-center justify-center 2xl:justify-start gap-3 w-full px-[16px] py-[16px] text-lg font-semibold hover:text-[#1C63DB] ${
                isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
              }`
            }
          >
            <Heartbeat />
            {isNarrow ? "" : "Health Snapshot"}
          </NavLink> */}

          <NavLink
            to={"/library"}
            className={({ isActive }) =>
              `flex items-center gap-3 justify-center 2xl:justify-start w-full px-[16px] py-[16px] text-lg font-semibold hover:text-[#1C63DB] ${isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
              }`
            }
          >
            <Library />
            {isNarrow ? "" : "Library"}
          </NavLink>

          <NavLink
            to={"/messages"}
            className={({ isActive }) =>
              `flex items-center justify-center 2xl:justify-start gap-3 w-full px-[16px] py-[16px] text-lg font-semibold text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
              }`
            }
          >
            <ChatsCircle />
            {isNarrow ? "" : "Messages"}
          </NavLink>
        </div>
      </div>
      <button
        onClick={isNarrow ? () => setMenuOpen(!menuOpen) : () => { }}
        className={`flex gap-4 items-center ${isNarrow ? "" : "pl-4"}`}
      >
        <Avatar>
          <AvatarImage src={AvatarWoman} alt="Avatar" />
          <AvatarFallback>USR</AvatarFallback>
        </Avatar>
        {!isNarrow && (
          <p className="text-[#1D1D1F] hover:text-[#1C63DB] font-[Nunito] text-[16px]/[22px] font-semibold">
            Frances Swann
          </p>
        )}
        {!isNarrow && (
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
          className={`
            absolute ${isNarrow ? "left-[70px] bottom-[20px]" : "left-[90px] bottom-[80px]"} 
            mt-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 py-[12px] px-[20px]
            flex flex-col gap-2 z-50
            ${!isNarrow && "before:content-[''] before:absolute before:-bottom-2 before:right-7 before:border-x-8 before:border-t-8 before:border-x-transparent before:border-t-white"}`}
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
  );
};
