import { DetailsChatItemModel } from "entities/chat";
import { Client } from "entities/coach";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ChatsCircle from "shared/assets/icons/chats-circle";
import EditIcon from "shared/assets/icons/edit";
import UploadCloud from "shared/assets/icons/upload-cloud";
import { cn } from "shared/lib";
import { Button, Dialog, DialogContent, DialogTitle, Input } from "shared/ui";
import { MultiSelectField } from "widgets/MultiSelectField";
import { useFilePicker } from "./messages-tab/useFilePicker";

interface CreateGroupModalProps {
  showModal: boolean;
  onSave: ({
    name,
    image,
    add_participant,
    remove_participant,
  }: {
    name: string;
    image: File | null;
    description?: string;
    add_participant?: string[];
    remove_participant?: string[];
  }) => void;
  onClose: () => void;
  isEdit?: boolean;
  clientsData?: Client[];
  chat?: DetailsChatItemModel;
}

export const CreateGroupModal = ({
  showModal,
  onSave,
  onClose,
  isEdit,
  clientsData,
  chat,
}: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState(isEdit ? chat?.name || "" : "");
  const [groupDescription, setGroupDescription] = useState(
    isEdit ? chat?.description || "" : ""
  );
  const {
    files,
    items,
    getInputProps,
    open,
    getDropzoneProps,
    dragOver,
    remove,
  } = useFilePicker({
    accept: ["image/png", "image/jpeg"],
  });
  const [selectedOption, setSelectedOption] = useState<string[]>(
    chat?.participants.map((p) => p.user.name || "") || []
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    chat?.avatar_url || null
  );

  useEffect(() => {
    if (files.length > 0) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else if (isEdit && chat?.avatar_url) {
      setPreviewUrl(chat.avatar_url);
    } else {
      setPreviewUrl(null);
    }
  }, [files, setPreviewUrl, chat?.avatar_url, isEdit]);

  const localSave = () => {
    if (!isEdit) {
      onSave({
        name: groupName,
        image: files[0] || null,
        add_participant: selectedOption,
      });
      return;
    }

    const namesToAdd =
      clientsData
        ?.filter((c) => selectedOption.includes(c.name))
        .map((c) => c.client_id)
        .filter((id) => chat?.participants.every((p) => p.user.id !== id)) ||
      [];

    const namesToRemove =
      chat?.participants
        .filter((p) => !selectedOption.includes(p.user.name || ""))
        .map((p) => p.user.id) || [];

    onSave({
      description: groupDescription,
      name: groupName,
      image: files[0] || null,
      add_participant: namesToAdd,
      remove_participant: namesToRemove,
    });
  };

  if (!showModal) return null;

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl gap-6">
        <DialogTitle className="hidden">Title </DialogTitle>
        <div>
          <div className="flex gap-2">
            <ChatsCircle />
            <h3 className="text-xl font-semibold">Multiple chat settings</h3>
          </div>
          <p className="mt-3 text-sm text-gray-700">
            Please add this multiple chat name and image to make it more
            recognisable amongst other chats.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Chat avatar</p>
          <button
            {...getDropzoneProps()}
            onClick={() => {
              if (files.length > 0) return;
              open();
            }}
            className={cn(
              "mt-1 text-center  rounded-lg w-52 h-52 flex flex-col items-center justify-center gap-[2px]",
              dragOver ? "bg-blue-50" : "bg-white",
              previewUrl
                ? "undefined"
                : " border-blue-500 p-6  border-dashed border-2"
            )}
          >
            {previewUrl ? (
              <div className="relative w-full h-full group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-lg"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 rounded-lg opacity-0 bg-black/40 group-hover:opacity-100">
                  <button
                    className="flex items-center w-[104px] gap-1 px-3 py-2 text-black bg-white rounded-md hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
                      if (items[0]) remove(items[0].id);
                    }}
                  >
                    <EditIcon />
                    Change
                  </button>

                  <button
                    className="flex items-center w-[104px] gap-1 px-3 py-2 text-red-600 font-semibold bg-red-200 rounded-md hover:bg-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (items[0]) remove(items[0].id);
                      setPreviewUrl(null);
                    }}
                  >
                    <Trash2 />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="text-[#1C63DB]" />
                <p className="text-[#1C63DB] font-semibold text-sm">
                  Click to upload
                </p>
                <p className="text-[#5F5F65] text-sm">or drag and drop</p>
                <p className="text-[#5F5F65] text-sm">
                  SVG, PNG, JPG or GIF (max. 400x400px)
                </p>
              </>
            )}
            <input className="hidden" {...getInputProps()} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-700">Chat name</p>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter chat name"
              className="mt-1"
            />
          </div>

          {isEdit && (
            <>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Description
                </p>
                <Input
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Enter chat description"
                  className="mt-1"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Chat name</p>
                <MultiSelectField
                  className="mt-4 md:rounded-sm"
                  options={
                    clientsData?.map((c) => ({
                      label: c.name,
                    })) || []
                  }
                  selected={selectedOption}
                  onChange={setSelectedOption}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="blue" onClick={onClose} className="w-32">
            Cancel
          </Button>
          <Button
            variant="blue2"
            onClick={localSave}
            className="w-32"
            disabled={!groupName.trim()}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
