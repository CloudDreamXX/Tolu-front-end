import { cloneElement, isValidElement, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "shared/lib";
import { SideBarItem } from "widgets/sidebars/ui/model";

interface CustomNavLinkProps {
  item: SideBarItem;
  onClick?: () => void;
  isNarrow?: boolean;
}

export const CustomNavLink: React.FC<CustomNavLinkProps> = ({
  item,
  onClick,
  isNarrow,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (item.link) {
    return (
      <NavLink
        to={item.link}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-4 py-[14px] text-[14px] font-semibold hover:text-[#1C63DB]",
            isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
          )
        }
      >
        {item.icon}
        {!isNarrow && item.title}
      </NavLink>
    );
  }

  if (item.content) {
    return (
      <div className="flex flex-col">
        <button
          className={cn(
            "flex items-center gap-3 px-4 py-[14px] text-[14px] font-semibold hover:text-[#1C63DB]",
            location.pathname.includes(item.title.toLowerCase())
              ? "text-[#1C63DB]"
              : "text-[#1D1D1F]"
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          {item.icon}
          {!isNarrow && item.title}
        </button>
        {open && (
          <div className="pl-6">
            {isValidElement(item.content)
              ? cloneElement(item.content, { onChildrenItemClick: onClick })
              : item.content}
          </div>
        )}
      </div>
    );
  }

  return null;
};
