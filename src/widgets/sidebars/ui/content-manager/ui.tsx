import AiCreate from "shared/assets/icons/ai-create";
import Chevron from "shared/assets/icons/chevron";
import Search from "shared/assets/icons/search";
import { Button } from "shared/ui/button";
import { Input } from "shared/ui/input";
import { sideBarContent } from "./lib";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Dots from "shared/assets/icons/dots";

export const ContentManagerSidebar: React.FC = () => {
  const nav = useNavigate();
  const [links] = useState(sideBarContent);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[40px] font-bold">VITAI</h2>
        <h3 className="text-2xl font-semibold">Admin</h3>
      </div>
      <div className="flex flex-col px-[14px] py-[17px] gap-[18px]">
        <Button
          variant={"blue"}
          className="w-full h-[44px] text-base font-semibold"
          onClick={() => nav("/content-manager/create")}
        >
          <AiCreate />
          Create
        </Button>
        <Input
          placeholder="Search"
          icon={<Search className="ml-[16px]" />}
          iconRight={<Chevron className="mr-[16px]" />}
          className="rounded-full px-[54px]"
        />
        <div className="flex flex-col gap-1 pt-4">
          {links.map((link) => (
            <NavLink
              key={link.title}
              to={link.link}
              className="flex items-center gap-3 p-4 font-semibold text-[#1D1D1F] text-lg"
            >
              {link.icon}
              {link.title}
              <Dots className="ml-auto" />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
