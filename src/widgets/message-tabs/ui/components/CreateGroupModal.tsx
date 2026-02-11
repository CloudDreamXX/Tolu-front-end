import { DetailsChatItemModel } from "entities/chat";
import { Client } from "entities/coach";
import { useEffect, useRef, useState } from "react";
import { cn } from "shared/lib";
import { Button, Input } from "shared/ui";
import { MultiSelectField } from "widgets/MultiSelectField";
import { useFilePicker } from "../../../../shared/hooks/useFilePicker";
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
    accept: ["image/png", "image/jpeg", "application/pdf", ".pdf", "video/mp4"],
  });
  const [selectedOption, setSelectedOption] = useState<string[]>(
    chat?.participants.map((p) => (p?.user.first_name && p?.user.last_name ? `${p?.user.first_name} ${p?.user.last_name}` : p?.user.name)) || []
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(chat?.avatar_url || null);
  const file = files?.[0] ?? null;

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => (prev === url ? prev : url));

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Manage object URL for Blob avatar_url
  const avatarObjectUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (file) return;

    let next: string | null = null;
    if (isEdit && chat?.avatar_url) {
      if (typeof chat.avatar_url === "object" && chat.avatar_url && (chat.avatar_url as Blob).size !== undefined) {
        // Revoke previous object URL if any
        if (avatarObjectUrlRef.current) {
          URL.revokeObjectURL(avatarObjectUrlRef.current);
        }
        next = URL.createObjectURL(chat.avatar_url);
        avatarObjectUrlRef.current = next;
      } else {
        next = chat.avatar_url;
        // Revoke previous object URL if any
        if (avatarObjectUrlRef.current) {
          URL.revokeObjectURL(avatarObjectUrlRef.current);
          avatarObjectUrlRef.current = null;
        }
      }
    } else {
      // Revoke previous object URL if any
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
        avatarObjectUrlRef.current = null;
      }
    }
    setPreviewUrl((prev) => (prev === next ? prev : next));
    return () => {
      // Only revoke on unmount
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
        avatarObjectUrlRef.current = null;
      }
    };
  }, [file, isEdit, chat?.avatar_url]);
  console.log(selectedOption)

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
        .filter((p) => {
          const displayName = p?.user.first_name && p?.user.last_name
            ? `${p?.user.first_name} ${p?.user.last_name}`
            : p?.user.name;
          return !selectedOption.includes(displayName);
        })
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
    <div
      className={cn(
        "fixed top-[85px] md:top-0 inset-0 z-[999] bg-transparent md:bg-[rgba(0,0,0,0.3)] md:backdrop-blur-[2px]",
        "flex items-start md:items-center justify-center overflow-y-auto"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "relative bg-[#F2F4F6] md:bg-[#F9FAFB] md:rounded-[18px] md:shadow-xl",
          "px-[16px] py-[24px] md:p-[24px] top-0 bottom-0 h-full md:min-h-auto md:max-h-[90vh]",
          "w-full md:h-fit md:w-[720px] lg:w-[800px] text-left md:mx-[16px]",
          "overflow-hidden flex flex-col gap-[24px]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-[#5F5F65] hover:text-[#1D1D1F] transition-colors"
        >
          <MaterialIcon iconName="close" className="text-[24px]" />
        </Button>

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
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            {...getDropzoneProps()}
            onClick={() => {
              if (files.length > 0) return;
              openFilePicker();
            }}
            className={cn(
              "mt-1 text-center rounded-lg w-52 h-52 flex flex-col items-center justify-center gap-[2px]",
              dragOver ? "bg-blue-50" : "bg-white",
              previewUrl || chat?.avatar_url
                ? "undefined"
                : "border-blue-500 p-6 border-dashed border-2"
            )}
          >
            {previewUrl || chat?.avatar_url ? (
              <div className="relative w-full h-full group">
                <img
                  src={previewUrl || chat?.avatar_url}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-lg"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 rounded-lg opacity-0 bg-black/40 group-hover:opacity-100">
                  <Button
                    variant={"unstyled"}
                    size={"unstyled"}
                    className="flex items-center w-[104px] gap-1 px-3 py-2 text-black bg-white rounded-md hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFilePicker();
                      if (items[0]) remove(items[0].id);
                    }}
                  >
                    <MaterialIcon iconName="edit" fill={1} />
                    Change
                  </Button>
                  <Button
                    variant={"unstyled"}
                    size={"unstyled"}
                    className="flex items-center w-[104px] gap-1 px-3 py-2 text-red-600 font-semibold bg-red-200 rounded-md hover:bg-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (items[0]) remove(items[0].id);
                      setPreviewUrl(null);
                    }}
                  >
                    <MaterialIcon iconName="delete" fill={1} />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <MaterialIcon
                  iconName="cloud_upload"
                  fill={1}
                  className="text-[#1C63DB] p-2 border rounded-xl"
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
            <Input className="hidden" {...getInputProps()} />
          </Button>
        </div>

        <div className="flex flex-col gap-[24px]">
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
                <p className="text-sm font-semibold text-gray-700">
                  Participants{" "}
                </p>
                <MultiSelectField
                  className="mt-[4px] md:rounded-sm"
                  options={
                    clientsData?.map((c) => ({
                      label:
                        c.first_name && c.last_name
                          ? `${c.first_name} ${c.last_name}`
                          : c.first_name || c.name,
                    })) || []
                  }
                  selected={selectedOption}
                  onChange={setSelectedOption}
                  height="h-[180px]"
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
      </div>
    </div>
  );
};
