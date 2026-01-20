import { setFilesFromLibrary } from "entities/client/lib";
import { FileLibraryFile, FileLibraryFolder } from "entities/files-library";
import {
  useFetchAllFilesQuery,
  useGetFolderContentsQuery,
} from "entities/files-library/api";
import { RootState } from "entities/store";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, formatFileSize, toast } from "shared/lib";
import {
  Badge,
  Button,
  DropArea,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";

const TABS = ["From Library", "Upload"] as const;
type TabType = (typeof TABS)[number];

interface AttachedFile {
  name: string;
  size: string;
  type: string;
  file: File;
}

interface PopoverAttachProps {
  files?: File[];
  setFiles?: (files: File[]) => void;
  customTrigger?: React.ReactNode;
  title?: string;
  description?: string;
  existingFiles?: any[];
  disabled?: boolean;
  isDocumentPage?: boolean;
  fileExtensions?: string[];
  maxFiles?: number;
  hideFromLibrary?: boolean;
}

export const PopoverAttach: React.FC<PopoverAttachProps> = ({
  files,
  setFiles,
  customTrigger,
  title,
  description,
  existingFiles,
  disabled = false,
  isDocumentPage,
  fileExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".txt",
    ".mp4",
  ],
  maxFiles = 10,
  hideFromLibrary = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<TabType>("Upload");
  const [selectedFiles, setSelectedFiles] = useState<Set<FileLibraryFile>>(
    new Set()
  );

  const [viewingFolder, setViewingFolder] = useState<FileLibraryFolder | null>(
    null
  );

  const filesFromLibrary = useSelector(
    (state: RootState) => state.client.selectedFilesFromLibrary || []
  );

  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.user?.token);

  const { data: filesLibrary } = useFetchAllFilesQuery(
    { page: 1, per_page: 20 },
    { skip: step !== "From Library" || !token }
  );

  const { data: folderContents } = useGetFolderContentsQuery(
    {
      folderId: viewingFolder?.id || "",
      page: "1",
      per_page: "20",
    },
    { skip: !viewingFolder || step !== "From Library" }
  );

  useEffect(() => {
    const noUploadedFiles = !files || files.length === 0;
    const noLibraryFiles = filesFromLibrary.length === 0;

    if (noUploadedFiles && noLibraryFiles) {
      setAttachedFiles([]);
      setSelectedFiles(new Set());
      setViewingFolder(null);
    }
  }, [files, filesFromLibrary]);

  useEffect(() => {
    if (attachedFiles.length && setFiles) {
      setFiles(attachedFiles.map((file) => file.file));
    }
  }, [attachedFiles]);

  useEffect(() => {
    if (files && files.length > 0) {
      const newAttachedFiles = files.map((file) => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        file,
      }));
      setAttachedFiles(newAttachedFiles);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };
  const handleBrowseClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    const filesArray = Array.from(selectedFiles);
    processFiles(filesArray);
    e.target.value = "";
  };
  const processFiles = (files: File[]) => {
    const totalFiles = attachedFiles.length + files.length;
    if (totalFiles > maxFiles) {
      toast({
        variant: "destructive",
        title: `You cannot add more than ${maxFiles} files.`,
      });
      return;
    }
    const validFiles = files.filter((file) => {
      const extension = file.name
        .toLowerCase()
        .slice(file.name.lastIndexOf("."));
      return fileExtensions.includes(extension);
    });
    const newAttachedFiles: AttachedFile[] = validFiles.map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      file,
    }));
    const updatedFiles = [...attachedFiles, ...newAttachedFiles];
    setAttachedFiles(updatedFiles);
    updateParentFiles(updatedFiles);
  };
  const updateParentFiles = (files: AttachedFile[]) => {
    setFiles?.(files.map((file) => file.file));
  };
  const removeFile = (index: number) => {
    const updatedFiles = attachedFiles.filter((_, i) => i !== index);
    setAttachedFiles(updatedFiles);
    updateParentFiles(updatedFiles);
  };
  const handleSave = () => setIsOpen(false);

  const handleSelectFileLibrary = (file: FileLibraryFile) => {
    const newSelectedFiles = new Set(selectedFiles);

    if (Array.from(newSelectedFiles).some((f) => f.id === file.id)) {
      newSelectedFiles.forEach((f) => {
        if (f.id === file.id) newSelectedFiles.delete(f);
      });
    } else {
      newSelectedFiles.add(file);
    }

    setSelectedFiles(newSelectedFiles);
    dispatch(
      setFilesFromLibrary(Array.from(newSelectedFiles).map((f) => f.id))
    );
  };

  const handleFolderClick = (folder: FileLibraryFolder) => {
    setViewingFolder(folder);
  };

  const handleReturnToRoot = () => {
    setViewingFolder(null);
  };

  const renderUpload = () => (
    <>
      {attachedFiles.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {attachedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex flex-row items-center justify-between w-full px-3 py-2 bg-white border rounded-lg"
            >
              <div className="flex flex-row items-center flex-1 gap-2">
                <MaterialIcon iconName="docs" fill={1} />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-[#5F5F65]">{file.size}</span>
                </div>
              </div>
              {!isDocumentPage && (
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  onClick={() => removeFile(index)}
                  className="flex items-center justify-center p-1 rounded hover:bg-red-50"
                >
                  <MaterialIcon
                    iconName="delete"
                    fill={1}
                    size={16}
                    className="text-red-500"
                  />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <DropArea
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        dragActive={dragActive}
        onBrowseClick={handleBrowseClick}
      />

      <Input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={fileExtensions.join(",")}
        onChange={handleFileChange}
      />

      <div className="flex flex-row justify-between">
        <Button variant="light-blue" className="w-[128px]" onClick={handleSave}>
          Cancel
        </Button>
        <Button variant="brightblue" className="w-[128px]" onClick={handleSave}>
          Attach
        </Button>
      </div>
    </>
  );

  const renderUploadFromLibrary = () => {
    const allFiles = [
      ...(filesLibrary?.root_files || []),
      ...(filesLibrary?.root_folders?.flatMap((folder) => folder.files) || []),
      ...(filesLibrary?.root_folders?.flatMap(
        (folder) =>
          folder.subfolders?.flatMap((subfolder) => subfolder.files) || []
      ) || []),
    ];

    const filesToRender = allFiles.filter((file) =>
      filesFromLibrary.includes(file.id)
    );

    const handleRemoveFileLibrary = (file: FileLibraryFile) => {
      const newSelectedFiles = new Set(
        Array.from(selectedFiles).filter((f) => f.id !== file.id)
      );
      setSelectedFiles(newSelectedFiles);

      dispatch(
        setFilesFromLibrary(Array.from(newSelectedFiles).map((f) => f.id))
      );
    };

    return (
      <>
        {filesToRender.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {filesToRender.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex flex-row items-center justify-between w-full px-3 py-2 bg-white border rounded-lg"
              >
                <div className="flex flex-row items-center flex-1 gap-2">
                  <MaterialIcon iconName="docs" fill={1} />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-[#5F5F65]">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                {!isDocumentPage && (
                  <Button
                    variant={"unstyled"}
                    size={"unstyled"}
                    onClick={() => handleRemoveFileLibrary(file)}
                    className="flex items-center justify-center p-1 rounded hover:bg-red-50"
                  >
                    <MaterialIcon
                      iconName="delete"
                      fill={1}
                      size={16}
                      className="text-red-500"
                    />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  const renderLibrary = () => {
    const currentFolders = viewingFolder
      ? (folderContents?.subfolders ?? [])
      : (filesLibrary?.root_folders ?? []);
    const currentFiles = viewingFolder
      ? (folderContents?.files ?? [])
      : (filesLibrary?.root_files ?? []);

    return (
      <div className="flex flex-col gap-2">
        {renderUploadFromLibrary()}
        {viewingFolder && (
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={handleReturnToRoot}
              className="flex items-center text-sm text-blue-600 hover:underline"
            >
              <MaterialIcon iconName="arrow_back" />
            </Button>
            <span className="font-bold text-gray-800">
              {viewingFolder.name}
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {currentFolders.map((folder: any) => (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              key={folder.id}
              className="h-[55px] w-full bg-white px-3 py-2 rounded-md flex justify-between gap-4 items-center border hover:border-gray-300"
              onClick={() => handleFolderClick(folder)}
            >
              <div className="flex items-center gap-2">
                <MaterialIcon
                  iconName="folder"
                  fill={1}
                  className="text-blue-600"
                />
                <h3>{folder.name}</h3>
              </div>
            </Button>
          ))}

          {currentFiles.map((file: any) => (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              key={file.id}
              onClick={() => handleSelectFileLibrary(file)}
              className={cn(
                "flex flex-row items-center justify-between w-full px-3 py-2 bg-white border rounded-lg",
                selectedFiles.has(file)
                  ? "border-blue-500 bg-blue-50"
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <div className="flex flex-row items-center flex-1 gap-2">
                <MaterialIcon
                  iconName="draft"
                  fill={1}
                  className="text-blue-600"
                />
                <div className="flex flex-col items-start flex-1">
                  <span className="font-medium text-gray-800 truncate text-sm max-w-52">
                    {file.original_filename || file.name}
                  </span>
                  <span className="text-xs text-[#5F5F65]">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild disabled={disabled}>
        {customTrigger ?? (
          <Button
            variant="outline"
            className="relative flex flex-col w-full gap-3 py-[8px] px-[16px] md:p-[16px] xl:px-[32px] xl:py-[16px] rounded-[18px] h-fit"
          >
            <h4 className="flex flex-row items-center gap-2 text-[16px] md:text-[18px] xl:text-[20px] font-bold">
              <MaterialIcon iconName="attach_file" />
              Attach files to folder
            </h4>
            <p className="text-[12px] xl:text-[14px] text-[#5F5F65]">
              Add credible references to support information integrity
            </p>
            {(attachedFiles.length > 0 || filesFromLibrary.length > 0) && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
              >
                {attachedFiles.length + filesFromLibrary.length}
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[358px] md:w-[720px] xl:w-[742px] p-6 flex flex-col gap-3 rounded-2xl bg-[#F9FAFB] max-h-[500px] overflow-y-auto">
        <h4 className="flex flex-row items-center gap-2 text-[16px] md:text-[18px] xl:text-[20px] font-bold">
          <MaterialIcon iconName="attach_file" />
          {attachedFiles.length > 0 ||
          (existingFiles && existingFiles?.length > 0)
            ? "Sources"
            : (title ?? "Attach files to folder")}
        </h4>
        <p className="text-[12px] xl:text-[14px] text-[#5F5F65]">
          {description ??
            "Add credible references to support information integrity"}
        </p>

        {existingFiles &&
          Array.isArray(existingFiles) &&
          existingFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              {existingFiles.map((file, index) => (
                <div
                  key={`${file}-${index}`}
                  className="flex flex-row items-center justify-between w-full px-3 py-2 bg-white border border-green-300 rounded-lg"
                >
                  <div className="flex flex-row items-center flex-1 gap-2">
                    <MaterialIcon iconName="docs" fill={1} />
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {file.filename || file}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {!isDocumentPage && (
          <>
            {!hideFromLibrary && (
              <div className="flex items-center gap-4 p-2 bg-white border rounded-full max-w-fit">
                {TABS.map((s) => (
                  <Button
                    variant={"unstyled"}
                    size={"unstyled"}
                    key={s}
                    className={cn(
                      "py-2.5 px-4 font-bold text-sm text-nowrap flex items-center justify-center gap-2.5",
                      s === step
                        ? "bg-[#F2F4F6] border rounded-full glow-effect"
                        : undefined
                    )}
                    onClick={() => setStep(s)}
                  >
                    {s}
                    {s === "From Library" && selectedFiles.size > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#1C63DB] flex justify-center items-center text-white text-[10px]">
                        {selectedFiles.size}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}
            {step === "From Library" && renderLibrary()}
            {step === "Upload" && renderUpload()}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
