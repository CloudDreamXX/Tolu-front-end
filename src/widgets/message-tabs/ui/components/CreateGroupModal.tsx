import { DetailsChatItemModel } from "entities/chat";
import { Client } from "entities/coach";
import { useEffect, useState } from "react";
import { cn } from "shared/lib";
import { Button, Dialog, DialogContent, DialogTitle, Input } from "shared/ui";
import { MultiSelectField } from "widgets/MultiSelectField";
import { useFilePicker } from "../messages-tab/useFilePicker";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface CreateGroupModalProps {
  open: boolean;
  mode: "create" | "edit";
  chat: DetailsChatItemModel | null;
  initialSelectedClients: string[];
  clientsData: Client[];
  onSubmit: ({
    mode,
    name,
    image,
    description,
    add_participant,
    remove_participant,
  }: {
    mode: "create" | "edit";
    name: string;
    image: File | null;
    description?: string;
    add_participant?: string[];
    remove_participant?: string[];
  }) => void;
  onClose: () => void;
}

export const CreateGroupModal = ({
  open,
  mode,
  chat,
  initialSelectedClients,
  clientsData,
  onSubmit,
  onClose,
}: CreateGroupModalProps) => {
  const isEdit = mode === "edit";
  const [groupName, setGroupName] = useState(isEdit ? chat?.name || "" : "");
  const [groupDescription, setGroupDescription] = useState(
    isEdit ? chat?.description || "" : ""
  );
  const {
    files,
    items,
    getInputProps,
    open: openFilePicker,
    getDropzoneProps,
    dragOver,
    remove,
  } = useFilePicker({
    accept: ["image/png", "image/jpeg", "application/pdf", ".pdf"],
  });
  const [selectedOption, setSelectedOption] = useState<string[]>(
    chat?.participants.map((p) => p.user.name || "") || []
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>();
  const file = files?.[0] ?? null;

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => (prev === url ? prev : url));

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    if (file) return;

    const next = isEdit && chat?.avatar_url ? chat.avatar_url : null;
    setPreviewUrl((prev) => (prev === next ? prev : next));
  }, [file, isEdit, chat?.avatar_url]);

  const localSave = () => {
    if (!isEdit) {
      onSubmit({
        mode,
        name: groupName,
        image: files[0] || null,
        description: groupDescription,
        add_participant:
          initialSelectedClients.length > 0
            ? initialSelectedClients
            : selectedOption,
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

    onSubmit({
      mode,
      name: groupName,
      image: files[0] || null,
      description: groupDescription,
      add_participant: namesToAdd,
      remove_participant: namesToRemove,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl gap-6">
        <DialogTitle className="hidden">Title </DialogTitle>
        <div>
          <div className="flex gap-2">
            <MaterialIcon iconName="forum" fill={1} />
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
              openFilePicker();
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
                      openFilePicker();
                      if (items[0]) remove(items[0].id);
                    }}
                  >
                    <MaterialIcon iconName="edit" fill={1} />
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
                    <MaterialIcon iconName="delete" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <MaterialIcon
                  iconName="upload"
                  fill={1}
                  className="text-[#1C63DB]"
                />
                <p className="text-[#1C63DB] font-semibold text-sm">
                  Click to upload
                </p>
                <p className="text-[#5F5F65] text-sm">or drag and drop</p>
                <p className="text-[#5F5F65] text-sm">
                  SVG, PNG, JPG, PDF or GIF (max. 400x400px)
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

          {!initialSelectedClients.length && (
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
