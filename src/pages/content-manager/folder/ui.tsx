import { AIChatMessage, CoachService } from "entities/coach";
import { RootState } from "entities/store";
import { Archive, Plus, Send } from "lucide-react";
import { title } from "process";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowRight from "shared/assets/icons/arrow-right";
import Dots from "shared/assets/icons/dots";
import Dublicate from "shared/assets/icons/dublicate";
import Edit from "shared/assets/icons/edit";
import { Eye } from "shared/assets/icons/eye";
import Save from "shared/assets/icons/save";
import Search from "shared/assets/icons/search";
import Trash from "shared/assets/icons/trash-icon";
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
    await CoachService.changeStatus(newStatus);
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
        <button
          className="bg-[#F3F6FB] rounded-full px-[4px] py-[3.5px]"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <Dots />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          {canChange && (
            <div className="flex flex-row gap-2">
              <Button variant={"blue2"}>
                <Plus />
                New subfolder
              </Button>
              <div className="w-[300px]">
                <Input
                  placeholder="Search"
                  icon={<Search />}
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
                <Send color="#fff" />
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
      <MenuItem icon={<Edit />} label="Edit" />
      <MenuItem icon={<ArrowRight />} label="Move" />
      <MenuItem icon={<Dublicate />} label="Duplicate" />
      <MenuItem
        icon={<Eye width={24} height={24} />}
        label="Mark as"
        onClick={onMarkAs}
      />
      <MenuItem icon={<Save />} label="Save as" />
      <MenuItem icon={<Archive size={24} />} label="Archive" />
      <MenuItem icon={<Trash />} label="Delete" className="text-[#FF1F0F]" />
    </div>
  );
};

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}> = ({ icon, label, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full text-left text-[16px] font-[500] ${className}`}
  >
    <span className="w-[24px] h-[24px]">{icon}</span>
    {label}
  </button>
);
