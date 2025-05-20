import { NavLink, useLocation } from "react-router-dom";
import Menu from "shared/assets/icons/menu";
import { useState, useRef, useEffect } from "react";
import ArrowPoligon from "shared/assets/icons/arrow-poligon";
import Library from "shared/assets/icons/library";
import HeartBeat from "shared/assets/icons/heartbeat";
import Settings from "shared/assets/icons/settings";

export const NavigationClient: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<"left" | "right" | null>(null);
  const navItemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const location = useLocation();

  const calculatePopupPosition = (button: HTMLButtonElement) => {
    const buttonRect = button.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    if (buttonRect.right > windowWidth - 500) {
      setPopupPosition("right");
    } else {
      setPopupPosition("left");
    }
  };

  const handleMouseEnter = (mainLink: string) => {
    setHoveredItem(mainLink);
    const button = navItemRefs.current.get(mainLink);
    if (button) {
      calculatePopupPosition(button);
    }
  };

  useEffect(() => {
    setHoveredItem(null);
    setPopupPosition(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (hoveredItem) {
        const button = navItemRefs.current.get(hoveredItem);
        if (button) {
          calculatePopupPosition(button);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hoveredItem]);

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
          to={"/library"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <Library />
          Library
        </NavLink>
        <NavLink
          to={"/settings"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-[16px] py-[16px] text-lg text-[#1D1D1F] hover:text-[#1C63DB] ${isActive ? "font-bold" : "font-semibold"
            }`
          }
        >
          <Settings />
          Settings
        </NavLink>
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
