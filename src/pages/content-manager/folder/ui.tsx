import {
  AIChatMessage,
  CoachService,
  useChangeStatusMutation,
} from "entities/coach";
import { RootState } from "entities/store";
import { title } from "process";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  Input,
  Textarea,
} from "shared/ui";
import { ChangeStatusPopup } from "widgets/ChangeStatusPopup";
import { PopoverClient, PopoverFolder } from "widgets/content-popovers";

export const ContentManagerFolder: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const location = useLocation();
  const folderName = location.pathname.split("/")[3];
  const accumulatedReply = location.state?.accumulatedReply ?? "";
  const contentId = location.state?.contentId ?? "";
  const [search, setSearch] = useState<string>("");
  const { folders } = useSelector((state: RootState) => state.folder);
  const [message, setMessage] = useState<string>("");
  const [newFolderId, setNewFolderId] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const nav = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showChangeStatusPopup, setShowChangeStatusPopup] = useState(false);
  const [changeStatus] = useChangeStatusMutation();

  const folderAndSubfolder = useMemo(() => {
    if (!folderId) return { folder: null, subfolder: null };

    const folder = folders.find((f) => f.id === folderId);
    if (folder) return { folder, subfolder: null };

    for (const f of folders) {
      const foundSub = f.subfolders?.find((sf) => sf.id === folderId);
      if (foundSub) return { folder: f, subfolder: foundSub };
    }

    return { folder: null, subfolder: null };
  }, [folderId, folders]);

  const { folder, subfolder } = folderAndSubfolder;
  const canChange = folderName === "approved";

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    setIsSending(true);

    const chatMessage: AIChatMessage = {
      user_prompt: message,
      is_new: false,
      chat_id: contentId,
      regenerate_id: null,
      chat_title: title,
      instructions: "",
    };

    let finalAccumulatedReply = "";

    try {
      await CoachService.aiLearningSearch(
        chatMessage,
        newFolderId,
        undefined,
        undefined,
        clientId,
        undefined,
        undefined,
        (chunk) => {
          if (chunk.reply) {
            finalAccumulatedReply += chunk.reply;
          }
        },
        (res) => {
          nav(`/content-manager/library/folder/${res.folderId}`, {
            state: {
              accumulatedReply: finalAccumulatedReply,
              contentId: contentId,
            },
          });
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const onStatusComplete = async (
    status:
      | "Raw"
      | "Ready for Review"
      | "Waiting"
      | "Second Review Requested"
      | "Ready to Publish"
      | "Live"
      | "Archived"
  ) => {
    const newStatus = {
      id: folderId ?? "",
      status: status,
    };
    await changeStatus(newStatus);
    setShowChangeStatusPopup(false);
  };

  return (
    <div className="flex flex-col gap-[16px] xl:gap-[20px] p-[16px] md:p-[24px] xl:py-[32px] xl:px-[90px] relative">
      <Breadcrumb className="flex flex-row gap-2 text-sm text-muted-foreground">
        {folder && (
          <>
            <BreadcrumbLink
              href={`/content-manager/${folderName}/${folder.id}`}
            >
              {folder.name}
            </BreadcrumbLink>
            {subfolder && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{subfolder.name}</BreadcrumbItem>
              </>
            )}
          </>
        )}
      </Breadcrumb>
      <div className="flex items-center justify-end">
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="bg-[#F3F6FB] rounded-full px-[4px] py-[3.5px]"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <MaterialIcon iconName="more_vert" />
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          {canChange && (
            <div className="flex flex-row gap-2">
              <Button variant={"blue2"}>
                <MaterialIcon iconName="add" />
                New subfolder
              </Button>
              <div className="w-[300px]">
                <Input
                  placeholder="Search"
                  icon={<MaterialIcon iconName="search" size={16} />}
                  className="rounded-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {accumulatedReply && (
          <div dangerouslySetInnerHTML={{ __html: accumulatedReply }} />
        )}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Let's start with a subject or writing request..."
          containerClassName="border-[#008FF6]"
          className="h-20 text-lg font-medium resize-none placeholder:text-[#1D1D1F80] text-[#1D1D1F]"
          footer={
            <div className="flex flex-row w-full gap-[10px]">
              <PopoverClient setClientId={setClientId} />
              <PopoverFolder setFolderId={setNewFolderId} />
              <Button
                variant="black"
                className="ml-auto w-12 h-12 p-[10px] rounded-full"
                onClick={handleSendMessage}
                disabled={isSending}
              >
                <MaterialIcon iconName="send" />
              </Button>
            </div>
          }
          footerClassName="rounded-b-[18px] border-[#008FF6] border-t-0"
        />

        {showPopup && (
          <PopupMenu
            onMarkAs={() => {
              setShowPopup(false);
              setShowChangeStatusPopup(true);
            }}
          />
        )}

        {showChangeStatusPopup && (
          <ChangeStatusPopup
            onClose={() => setShowChangeStatusPopup(false)}
            onComplete={onStatusComplete}
            currentStatus={
              folder!.status as
                | "Raw"
                | "Ready for Review"
                | "Waiting"
                | "Second Review Requested"
                | "Ready to Publish"
                | "Live"
                | "Archived"
            }
          />
        )}
      </div>
    </div>
  );
};

export const PopupMenu: React.FC<{ onMarkAs: () => void }> = ({ onMarkAs }) => {
  return (
    <div
      className="absolute z-50 top-[110px] right-[90px] w-[238px] p-[16px_14px] flex flex-col items-start gap-[16px]
                 bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
    >
      <MenuItem icon={<MaterialIcon iconName="edit" />} label="Edit" />
      <MenuItem
        icon={<MaterialIcon iconName="keyboard_arrow_right" />}
        label="Move"
      />
      <MenuItem
        icon={<MaterialIcon iconName="tab_duplicate" />}
        label="Duplicate"
      />
      <MenuItem
        icon={<MaterialIcon iconName="visibility" />}
        label="Mark as"
        onClick={onMarkAs}
      />
      <MenuItem icon={<MaterialIcon iconName="box" />} label="Save as" />
      <MenuItem icon={<MaterialIcon iconName="book_2" />} label="Archive" />
      <MenuItem
        icon={<MaterialIcon iconName="delete" fill={1} />}
        label="Delete"
        className="text-[#FF1F0F] "
      />
    </div>
  );
};

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}> = ({ icon, label, className = "", onClick }) => (
  <Button
    variant={"unstyled"}
    size={"unstyled"}
    onClick={onClick}
    className={`flex items-center gap-2 w-full text-left text-[16px] font-[500] ${className}`}
  >
    <span className="w-[24px] h-[24px]">{icon}</span>
    {label}
  </Button>
);
