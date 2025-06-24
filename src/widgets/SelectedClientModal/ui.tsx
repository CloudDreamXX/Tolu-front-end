import React from "react";
import CloseIcon from "shared/assets/icons/close";
import TrashIcon from "shared/assets/icons/trash-icon";
import UserIcon from "shared/assets/icons/user-black";
import ChatsIcon from "shared/assets/icons/chats";
import EditIcon from "shared/assets/icons/edit-blue";
import { ClientProfile } from "entities/coach";
import { cards } from "pages/content-manager/clients/mock";
import ArrowLeft from "shared/assets/icons/arrowLeft";

interface SelectedClientModalProps {
  client: ClientProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SelectedClientModal: React.FC<SelectedClientModalProps> = ({
  client,
  activeTab,
  setActiveTab,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="absolute inset-0 top-[85px] min-h-[calc(100vh-85px)] bottom-0 md:top-0 z-10 bg-transparent md:bg-[rgba(0,0,0,0.3)] md:backdrop-blur-[2px] flex stretch md:items-center justify-center">
      <div className="bg-[#F2F4F6] md:bg-[#F9FAFB] md:rounded-[18px] md:shadow-xl px-[16px] py-[24px] pt-[64px] md:p-[24px] top-0 bottom-0 h-full w-full md:h-fit md:w-[720px] lg:w-[800px] text-left relative md:mx-[16px] overflow-y-auto">
        <button
          className="absolute md:hidden top-[24px] flex justify-center items-center text-[#1D1D1F]"
          onClick={onClose}
        >
          <ArrowLeft />
        </button>
        <span
          className="hidden md:block absolute top-[16px] right-[16px] cursor-pointer"
          onClick={onClose}
        >
          <CloseIcon />
        </span>
        <div className="flex gap-[24px] items-center justify-between md:justify-start mb-[24px]">
          <div className="flex items-center gap-[8px]">
            <UserIcon />
            <h2 className="text-[20px] font-[700]">
              {client.client_info.name}
            </h2>
          </div>
          <div className="flex gap-4 text-[16px] font-semibold text-[#1C63DB]">
            <button className="hidden md:flex items-center gap-[8px] px-[12px] py-[4px]">
              <ChatsIcon />
              Open Chat
            </button>
            <button
              className="flex items-center gap-[8px] px-[12px] py-[4px]"
              onClick={onEdit}
            >
              <EditIcon /> Edit info
            </button>
          </div>
        </div>

        <div className="flex gap-[16px] mb-[24px] border border-[#DBDEE1] bg-white rounded-[1000px] p-[8px]">
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] ${
              activeTab === "clientInfo"
                ? "bg-[#F2F4F6] text-[#000000]"
                : "text-[#000000]"
            }`}
            onClick={() => setActiveTab("clientInfo")}
          >
            Client info
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] ${
              activeTab === "healthProfile"
                ? "bg-[#F2F4F6] text-[#000000]"
                : "text-[#000000]"
            }`}
            onClick={() => setActiveTab("healthProfile")}
          >
            Health profile
          </button>
        </div>

        {activeTab === "clientInfo" && (
          <div className="bg-white p-[16px] md:p-0 rounded-[8px] md:rounded-0 border border-[#DBDEE1] md:border-none md:bg-transparent grid grid-cols-2 md:grid-cols-3 gap-[24px] text-[14px]">
            <div className="flex flex-col gap-[24px]">
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Gender
                </p>
                <p className="text-[16px] text-[#5F5F65]">
                  {client.client_info.gender}
                </p>
              </div>
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Recent updates
                </p>
                <p className="text-[16px] text-[#1D1D1F]">
                  {client.client_info.last_activity
                    ? new Date(
                        client.client_info.last_activity
                      ).toLocaleDateString("en-GB")
                    : "-"}
                </p>
              </div>
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Learning now
                </p>
                {client.client_info.learning_now.recent_items.length > 0 && (
                  <p className="text-[16px] text-[#1D1D1F]">
                    <span className="underline">
                      {client.client_info.learning_now.recent_items[0].title}
                    </span>
                    <span> and </span>
                    <span className="text-[#1C63D8] underline cursor-pointer">
                      {client.client_info.learning_now.recent_items.length >
                        1 &&
                        `${client.client_info.learning_now.recent_items.length - 1} more`}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[24px]">
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Last seen
                </p>
                <p className="text-[16px] text-[#1D1D1F]">
                  {client.client_info.last_activity
                    ? new Date(
                        client.client_info.last_activity
                      ).toLocaleDateString("en-GB")
                    : "-"}
                </p>
              </div>
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Cycle status
                </p>
                {client.client_info.cycle_status && (
                  <span className="inline-flex items-center gap-[4px] bg-[#E0F5FF] px-[12px] py-[4px] rounded-full">
                    <span className="w-[6px] h-[6px] bg-[#1C63DB] rounded-full"></span>
                    <span className="text-[#000000] text-[16px]">
                      {client.client_info.cycle_status}
                    </span>
                  </span>
                )}
              </div>
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Recent Interventions
                </p>
                <p className="text-[16px] text-[#1D1D1F]">
                  {client.client_info.recent_interventions}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[24px]">
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Chief Concern
                </p>
                <p className="text-[16px] text-[#1D1D1F]">
                  {client.client_info.chief_concerns}
                </p>
              </div>
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Menopause Status
                </p>
                {client.client_info.menopause_status !== "" && (
                  <span className="inline-flex items-center gap-[4px] bg-[#F7501826] px-[12px] py-[4px] rounded-full">
                    <span className="w-[6px] h-[6px] bg-[#F75018] rounded-full"></span>
                    <span className="text-[#000000] text-[16px]">
                      {client.client_info.menopause_status}
                    </span>
                  </span>
                )}
              </div>
              <div className="h-[50px]">
                <p className="text-[12px] text-[#5F5F65] mb-[4px] font-semibold">
                  Recent Labs
                </p>
                <p className="text-[16px] text-[#1D1D1F]">
                  {client.client_info.recent_labs}
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === "healthProfile" && (
          <div className="md:h-[286px] md:overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[24px] text-[14px]">
            {cards.map(({ title, sections }) => (
              <div
                key={title}
                className="bg-white border border-[#DBDEE1] rounded-[8px] flex flex-col gap-[12px] h-fit min-w-[280px] flex-shrink-0"
              >
                <h3 className="text-[#1C63DB] font-[700] text-[20px] border-b border-[#DBDEE1] rounded-t-[8px] px-[16px] py-[12px] bg-[#F3F6FB]">
                  {title}
                </h3>
                {sections.map(({ heading, content }) => (
                  <div key={heading} className="px-[16px]">
                    <p className="text-[#5F5F65] text-[12px] font-semibold mb-[4px]">
                      {heading}
                    </p>
                    <p className="text-[14px] text-[#1D1D1F]">{content}</p>
                  </div>
                ))}
                <div className="flex gap-[8px] border-t border-[#DBDEE1] rounded-b-[8px] px-[16px] py-[12px]">
                  <button className="bg-[#1C63DB] text-white px-[16px] py-[4px] rounded-[1000px] font-semibold">
                    Recommend
                  </button>
                  <button className="text-[#1C63DB] font-semibold self-center">
                    Show more
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-[8px] md:flex-row md:justify-between items-center mt-[18px] md:mt-[48px]">
          <button
            className="hidden md:block p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="w-full md:hidden p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold flex gap-[8px] items-center justify-center">
            <ChatsIcon />
            Open Chat
          </button>
          <button
            className="w-full md:w-[144px] h-[46px] md:h-[40px] rounded-[1000px] text-[#FF1F0F] text-[16px] font-semibold flex gap-[8px] items-center justify-center"
            onClick={onDelete}
          >
            <TrashIcon fill="#FF1F0F" /> Delete user
          </button>
        </div>
      </div>
    </div>
  );
};
