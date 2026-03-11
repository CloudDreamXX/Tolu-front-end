import { cloneElement, isValidElement, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button } from "shared/ui";
import { SideBarItem } from "widgets/sidebars/ui/model";
interface CustomNavLinkProps {
  item: SideBarItem;
  onClick?: () => void;
  isNarrow?: boolean;
  setOpenSidebar?: (open: boolean) => void;
  hideArrow?: boolean;
}

export const CustomNavLink: React.FC<CustomNavLinkProps> = ({
  item,
  onClick,
  isNarrow,
  setOpenSidebar,
  hideArrow,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isContentItemActive =
    item.title === "Content library"
      ? location.pathname.startsWith("/content-manager/library")
      : location.pathname.includes(item.title.toLowerCase());

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
          onClick?.();
        }}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-4 py-[14px] text-[14px] font-semibold hover:text-[#1C63DB] rounded-[10px] w-full",
            isActive ? "text-[#1C63DB] bg-[#F3F6FB]" : "text-[#1D1D1F]"
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
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className={cn(
            "flex items-center gap-3 px-4 py-[14px] text-[14px] font-semibold hover:text-[#1C63DB] rounded-[8px]",
            isContentItemActive
              ? "text-[#1C63DB] bg-[#F3F6FB]"
              : "text-[#1D1D1F]"
          )}
          onClick={() => {
            setOpenSidebar?.(true);
            setOpen((prev) => !prev);
          }}
        >
          {item.icon}
          {!isNarrow && item.title}
          {!hideArrow &&
            !isNarrow &&
            (open ? (
              <MaterialIcon iconName="keyboard_arrow_up" />
            ) : (
              <MaterialIcon iconName="keyboard_arrow_down" />
            ))}
        </Button>
        {open && (
          <div className="pl-2 pr-1 min-w-0 max-w-full overflow-x-hidden">
            {isValidElement(item.content)
              ? cloneElement(item.content, {
                  onChildrenItemClick: () => {
                    if (
                      !location.pathname.startsWith(
                        "/content-manager/library/folder/"
                      )
                    ) {
                      setOpenSidebar?.(false);
                    }
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
