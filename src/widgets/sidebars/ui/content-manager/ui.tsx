import AiCreate from "shared/assets/icons/ai-create";
import Chevron from "shared/assets/icons/chevron";
import Search from "shared/assets/icons/search";
import { Button } from "shared/ui/button";
import { Input } from "shared/ui/input";
import { sideBarContent } from "./lib";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import Dots from "shared/assets/icons/dots";
import { FOLDERS } from "pages/content-manager";
import ClosedFolder from "shared/assets/icons/closed-folder";
import { MOCK_DOCUMENT } from "pages/content-manager/document/mock";
import { File } from "lucide-react";

export const ContentManagerSidebar: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [links] = useState(sideBarContent);
  const [folder, setFolder] = useState<string | null>(null);
  const [document, setDocument] = useState<string | null>(null);
  const [tab, setTab] = useState<string | null>(null);
  const { folderId, documentId } = useParams<{
    folderId: string;
    documentId: string;
  }>();

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    setTab(pathSegments[2]);

    setFolder(FOLDERS.find((f) => f.id === folderId)?.name ?? null);
    setDocument(MOCK_DOCUMENT.find((d) => d.id === documentId)?.title ?? null);
  }, [location.pathname, folderId, documentId]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[40px] font-bold">TOLU</h2>
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
            <div key={link.title} className="flex flex-col">
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-[7px] text-lg text-[#1D1D1F] ${
                    isActive ? "font-bold" : "font-semibold"
                  }`
                }
              >
                {link.icon}
                {link.title}
              </NavLink>
              {link.title.toLowerCase() === tab && folder && (
                <NavLink
                  to={`/content-manager/${tab}/folder/${folderId}`}
                  className="flex flex-row w-full gap-2 px-4 py-[7px] pl-12 box-border"
                >
                  <ClosedFolder width={24} height={24} />
                  <span className={`${!document && "font-extrabold"}`}>
                    {folder}
                  </span>
                  <Dots className="ml-auto" />
                </NavLink>
              )}
              {link.title.toLowerCase() === tab && document && (
                <NavLink
                  to={`/content-manager/${tab}/folder/${folderId}/${documentId}`}
                  className="flex flex-row w-full gap-2 px-4 py-[7px] pl-16 box-border"
                >
                  <File width={24} height={24} className="min-w-6" />
                  <span className="font-extrabold truncate">{document}</span>
                  <Dots className="ml-auto min-w-6" />
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
