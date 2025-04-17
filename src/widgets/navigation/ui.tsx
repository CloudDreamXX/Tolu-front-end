import { NavLink } from "react-router-dom";
import { navigationItems } from "./lib";
import Menu from "shared/assets/icons/menu";
import { useState } from "react";
import ArrowPoligon from "shared/assets/icons/arrow-poligon";

export const Navigation: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="flex flex-row items-center justify-center h-[78px] gap-[30px] relative px-[48px] py-[19px]">
      <div className="flex flex-row gap-[30px] w-full">
        {navigationItems.map((item) => (
          <button
            key={item.mainLink}
            className="relative"
            onMouseEnter={() => setHoveredItem(item.mainLink)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <NavLink
              to={item.mainLink}
              className={({ isActive }) =>
                `px-4 py-2 font-medium ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-500"}`
              }
            >
              {item.title}
            </NavLink>

            {hoveredItem === item.mainLink &&
              item.links &&
              item.links.length > 0 && (
                <div className="absolute left-0 pt-4 top-full">
                  <div className="absolute top-[6px] left-[32px] z-40">
                    <ArrowPoligon />
                  </div>

                  <div
                    className={`rounded-xl bg-[#F3F6FB] shadow-lg z-50 p-5 w-auto ${item.variant === "small" ? "min-w-[250px]" : "min-w-max"}`}
                  >
                    <p className="flex w-full gap-2 mb-3 text-base font-semibold text-left">
                      <span className="w-full">{item.title}</span>
                      <span className="w-full">{item?.additionalTitle}</span>
                    </p>
                    <div
                      className={`grid ${item.variant === "small" ? "grid-cols-1" : "grid-cols-2"} gap-[10px]`}
                    >
                      {item.links.map((link) => (
                        <NavLink
                          key={link.link}
                          to={link.link}
                          className={({ isActive }) =>
                            `flex items-center hover:text-blue-700 text-[#1D1D1F] font-medium gap-2 rounded-md whitespace-nowrap ${
                              isActive && "bg-blue-100 text-blue-700"
                            }`
                          }
                        >
                          <span className="flex items-center justify-center w-8 h-8 text-gray-600 bg-white rounded-md shadow-md shrink-0">
                            {link.icon}
                          </span>
                          <span className="pr-2 text-left">
                            {link.title}{" "}
                            {link.titleAdditional && (
                              <span className="text-gray-500">
                                ({link.titleAdditional})
                              </span>
                            )}
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </button>
        ))}
      </div>
      <button className="">
        <Menu />
      </button>
    </div>
  );
};
