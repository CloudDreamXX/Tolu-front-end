import { FOLDERS } from "pages/content-manager";
import { MOCK_DOCUMENT } from "pages/content-manager/document/mock";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { sideBarContent } from "./lib";
import { useFetchAllChatsQuery } from "entities/chat";

export const UserManagementSideBar: React.FC = () => {
  const location = useLocation();
  const [links] = useState(sideBarContent);
  const [folder, setFolder] = useState<string | null>(null);
  const [document, setDocument] = useState<string | null>(null);
  const [tab, setTab] = useState<string | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const { folderId, documentId } = useParams<{
    folderId: string;
    documentId: string;
  }>();

  const { data: chats } = useFetchAllChatsQuery();

  const totalUnreadCount = chats?.reduce(
    (sum, chat) => sum + (chat.unreadCount ?? 0),
    0
  ) ?? 0;

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    setTab(pathSegments[2]);
    setFolder(FOLDERS.find((f) => f.id === folderId)?.name ?? null);
    setDocument(MOCK_DOCUMENT.find((d) => d.id === documentId)?.title ?? null);
  }, [location.pathname, folderId, documentId]);

  useEffect(() => {
    const checkWidth = () => {
      const w = window.innerWidth;
      setIsNarrow(w >= 1280 && w <= 1536);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <div
      className={`flex flex-col gap-8 h-full ${isNarrow ? "w-[81px] items-center" : "w-[284px]"}`}
    >
      <div className="flex flex-col items-center text-center">
        <h2
          className={`${isNarrow ? "text-[27px]" : "text-[40px]"} font-bold `}
        >
          Tolu AI
        </h2>
        {!isNarrow && <h3 className="text-[24px] font-semibold ">Admin</h3>}
      </div>
      <div className="flex flex-col gap-[24px]">
        <div
          className={`flex flex-col ${isNarrow ? "items-center" : "items-start"}`}
        >
          {links.map((link) => (
            <div key={link.title} className="flex flex-col w-full relative">
              <NavLink
                to={link.link || "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-[14px] text-[14px] font-semibold hover:text-[#1C63DB] ${isActive ? "text-[#1C63DB]" : "text-[#1D1D1F]"
                  }`
                }
              >
                {link.icon}
                {!isNarrow && link.title}
              </NavLink>
              {link.title.toLowerCase() === tab && folder && (
                <NavLink
                  to={`/content-manager/${tab}/folder/${folderId}`}
                  className={`flex flex-row w-full gap-2 px-4 py-[7px] ${isNarrow ? "pl-4" : "pl-12"} box-border`}
                >
                  <MaterialIcon iconName="folder" />
                  {!isNarrow && (
                    <span className={`${!document && "font-extrabold"}`}>
                      {folder}
                    </span>
                  )}
                  <MaterialIcon iconName="more_vert" className="ml-auto" />
                </NavLink>
              )}
              {link.title.toLowerCase() === tab && document && (
                <NavLink
                  to={`/content-manager/${tab}/folder/${folderId}/${documentId}`}
                  className={`flex flex-row w-full gap-2 px-4 py-[7px] ${isNarrow ? "pl-6" : "pl-16"} box-border`}
                >
                  <MaterialIcon iconName="docs" fill={1} />
                  {!isNarrow && (
                    <span className="font-extrabold truncate">{document}</span>
                  )}
                  <MaterialIcon
                    iconName="more_vert"
                    className="ml-auto min-w-6"
                  />
                </NavLink>
              )}
              {link.title === "Messages" && totalUnreadCount > 0 && (
                <span className="absolute top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
                  {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
