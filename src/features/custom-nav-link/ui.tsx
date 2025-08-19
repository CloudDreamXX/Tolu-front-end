import { ChevronDown, ChevronUp } from "lucide-react";
import { cloneElement, isValidElement, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "shared/lib";
import { SideBarItem } from "widgets/sidebars/ui/model";
interface CustomNavLinkProps {
  item: SideBarItem;
  onClick?: () => void;
  isNarrow?: boolean;
  setOpenSidebar?: (open: boolean) => void;
}

export const CustomNavLink: React.FC<CustomNavLinkProps> = ({
  item,
  onClick,
  isNarrow,
  setOpenSidebar,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isNarrow) {
      setOpen(false);
    }
  }, [isNarrow]);

  if (item.link) {
    return (
      <NavLink
        to={item.link}
        onClick={() => {
          setOpenSidebar?.(false);
          onClick?.();
        }}
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
          onClick={() => {
            setOpenSidebar?.(true);
            setOpen((prev) => !prev);
          }}
        >
          {item.icon}
          {!isNarrow && item.title}
          {!isNarrow &&
            (open ? (
              <ChevronUp className="w-5 h-5 shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 shrink-0" />
            ))}
        </button>
        {open && (
          <div className="pl-6">
            {isValidElement(item.content)
              ? cloneElement(item.content, {
                  onChildrenItemClick: () => {
                    setOpenSidebar?.(false);
                    onClick?.();
                  },
                })
              : item.content}
          </div>
        )}
      </div>
    );
  }

  return null;
};
