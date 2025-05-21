import { NavLink } from "react-router-dom";
import Menu from "shared/assets/icons/menu";
import Library from "shared/assets/icons/library";
import HeartBeat from "shared/assets/icons/heartbeat";
import Messages from "shared/assets/icons/messages";

export const NavigationClient: React.FC = () => {
  return (
    <div className="flex bg-white flex-row items-center justify-center h-[78px] gap-[30px] relative px-[48px] py-[19px]">
      <div className="flex flex-row gap-[30px] w-full">
        <NavLink
          to={"/health-snapshot"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <HeartBeat />
          Health Snapshot
        </NavLink>
        <NavLink
          to={"/health-snapshot"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <Library />
          Library
        </NavLink>
        <NavLink
          to={"/health-snapshot"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <Messages />
          Messages
        </NavLink>
        {/* <NavLink
          to={"/settings"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <Settings />
          Settings
        </NavLink> */}
      </div>

      <div
        className="relative"
      >
        <button>
          <Menu />
        </button>
      </div>
    </div>
  );
};
