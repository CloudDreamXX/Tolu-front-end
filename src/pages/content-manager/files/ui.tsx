import {
  useCreateFolderMutation,
  useDeleteFileLibraryMutation,
  useDeleteFolderMutation,
  useFetchAllFilesQuery,
  useGetFolderContentsQuery,
  useMoveFilesMutation,
  useUpdateFolderMutation,
  useUploadFilesLibraryMutation,
} from "entities/files-library/filesLibraryApi";
import { useEffect, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";
import { FileLibrary } from "./components/FileLibrary";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup";
import { UpdateFolderPopup } from "./components/UpdateFileFolderPopup";
import { FileLibraryFolder } from "entities/files-library";
import { useFilePicker } from "shared/hooks/useFilePicker";
import { cn } from "shared/lib";
import { EmptyStateTolu } from "widgets/empty-state-tolu";
import { MoveFilesPopup } from "./components/MoveFilesPopup";
import { findViewingFolderInFiles } from "./lib";

export const FilesLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);
  const [createPopup, setCreatePopup] = useState<boolean>(false);
  const [updatePopup, setUpdatePopup] = useState<boolean>(false);
  const [menuOpenFolder, setMenuOpenFolder] =
    useState<FileLibraryFolder | null>(null);
  const [movePopup, setMovePopup] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const { items, getDropzoneProps, getInputProps, dragOver, clear, open } =
    useFilePicker({
      accept: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "text/plain",
      ],
      maxFiles: 10,
    });

  const {
    refetch,
    data: files,
    isLoading,
    isFetching,
  } = useFetchAllFilesQuery({
    page,
    per_page: 20,
    search: searchTerm || null,
    file_type: null,
  });

  const [uploadFiles, { isLoading: isUploading }] =
    useUploadFilesLibraryMutation();
  const [deleteFile, { isLoading: isDeleting }] =
    useDeleteFileLibraryMutation();
  const [createFolder] = useCreateFolderMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const [updateFolder] = useUpdateFolderMutation();
  const [viewingFolder, setViewingFolder] = useState<FileLibraryFolder | null>(
    null
  );
  const [moveFiles] = useMoveFilesMutation();
  const [draggingFileId, setDraggingFileId] = useState<string | null>(null);
  const { data: folderContents } = useGetFolderContentsQuery(
    {
      folderId: menuOpenFolder?.id || viewingFolder?.id || "",
      page: "1",
      per_page: "10",
    },
    { skip: !viewingFolder && !menuOpenFolder }
  );

  useEffect(() => {
    if (viewingFolder?.id) {
      const refreshedFolder = findViewingFolderInFiles(
        viewingFolder?.id,
        files
      );
      setViewingFolder(refreshedFolder);
    }
  }, [files]);

  const handleFileSelect = (fileId: string) => {
    if (!selectedFiles.includes(fileId)) {
      setSelectedFiles((prev) => [...prev, fileId]);
    } else {
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    }
  };

  const handleUpload = async () => {
    await uploadFiles({
      files: items.map((item) => item.file),
      descriptions: JSON.stringify(
        items.map((item, index) => ({ [index]: item.file.name }))
      ),
      folder_id: viewingFolder ? viewingFolder.id : null,
    });
    clear();
    refetch();
  };

  const handleDelete = async (fileId: string) => {
    await deleteFile(fileId);
    await refetch();
  };

  const createNewFolder = async (
    name: string,
    description: string,
    parentId?: string
  ) => {
    const payload = { name, description, parent_folder_id: parentId };
    await createFolder(payload).then(() => {
      refetch();
    });
    setCreatePopup(false);
    setMenuOpenFolder(null);
  };

  const handleDotsClick = (folder: FileLibraryFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenFolder((prev) => (prev === folder ? null : folder));
  };

  const handleFolderDelete = async (folderId: string) => {
    await deleteFolder(folderId);
    refetch();
    setIsDeleteOpen(false);
    setMenuOpenFolder(null);
  };

  const handleFolderUpdate = async (name: string, description: string) => {
    if (menuOpenFolder) {
      await updateFolder({
        folderId: menuOpenFolder.id,
        payload: { name, description },
      });
      refetch();
      setUpdatePopup(false);
      setMenuOpenFolder(null);
    }
  };

  const handleFolderClick = (folder: FileLibraryFolder) => {
    setMenuOpenFolder(folder);
    setViewingFolder(folder);
  };

  const handleReturnToAll = () => {
    setMenuOpenFolder(null);
    setViewingFolder(null);
  };

  const handleMoveFiles = async (targetFolderId: string) => {
    try {
      await moveFiles({
        file_ids: selectedFiles,
        folder_id: targetFolderId,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error moving files:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    setDraggingFileId(fileId);
  };

  const handleDrop = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (draggingFileId) {
      try {
        await moveFiles({
          file_ids: [draggingFileId],
          folder_id: folderId,
        }).unwrap();
        setDraggingFileId(null);
        refetch();
      } catch (error) {
        console.error("Error moving files:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const LibraryLoadingSkeleton = () => {
    const getRandomWidth = (min: number, max: number) =>
      `${Math.floor(Math.random() * (max - min + 1)) + min}px`;

    return (
      <div className="flex flex-col gap-4 md:gap-[35px] p-[32px] animate-pulse">
        <div className="flex flex-col gap-2">
          <div
            className="h-[32px] skeleton-gradient rounded-[8px] w-[200px]"
            style={{ width: getRandomWidth(150, 250) }}
          />
          <div
            className="h-[20px] skeleton-gradient rounded-[8px] w-[300px]"
            style={{ width: getRandomWidth(200, 400) }}
          />
        </div>
        <div className="w-full bg-white rounded-[12px] flex flex-col justify-center items-center text-center p-4 cursor-pointer transition-colors h-[149px] skeleton-gradient" />
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-[55px] w-full rounded-md bg-gray-200 skeleton-gradient"
            />
          ))}
        </div>
      </div>
    );
  };

  const loading = isLoading || isFetching || isDeleting || isUploading;

  if (loading) {
    return (
      <>
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <MaterialIcon
              iconName="progress_activity"
              className="text-blue-600 animate-spin"
            />
          </span>
          Please wait, we are loading the files...
        </div>
        <LibraryLoadingSkeleton />
      </>
    );
  }

  return (
    <>
      {(isDeleting || isLoading || isFetching) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <MaterialIcon
            iconName="progress_activity"
            className="text-white animate-spin"
            fill={1}
            size={48}
          />
        </div>
      )}
      <div className="flex flex-col gap-4 md:gap-[35px] p-3 md:p-8 overflow-y-auto h-full min-h-[calc(100vh-78px)]">
        <div className="flex flex-col md:flex-row gap-[16px] justify-between md:items-end">
          <div className="flex flex-col gap-2">
            <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
              <MaterialIcon iconName="folder" fill={1} />
              Files library
            </h1>
            <p>All the files you were attaching through the Tolu platform</p>
          </div>
          <div className="flex items-center md:flex-row flex-row gap-2 md:gap-[20px] lg:gap-2">
            <div className="flex gap-[8px] items-center w-full lg:w-[300px] rounded-full border border-[#DBDEE1] px-[12px] py-[8px] bg-white h-[32px]">
              <MaterialIcon iconName="search" size={16} />
              <input
                placeholder="Search"
                className="outline-none w-full placeholder-custom text-[14px] font-semibold text-[#000]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
            <Button variant="brightblue" onClick={() => setCreatePopup(true)}>
              Create a folder
            </Button>
          </div>
        </div>

        <div>
          {files?.total_files === 0 ? (
            <EmptyStateTolu
              text="To deep research a knowledge source upload files to your File Library and ask Tolu to conduct a research or create an inspired content."
              footer={
                <div className="flex gap-4">
                  <Button
                    variant="brightblue"
                    className="min-w-40"
                    onClick={open}
                  >
                    Upload Files
                  </Button>
                </div>
              }
            />
          ) : (
            <div
              className={cn(
                "w-full border-[2px] border-dashed border-[#1C63DB] bg-white rounded-[12px] flex flex-col justify-center items-center text-center p-4 cursor-pointer transition-colors ",
                { "bg-blue-50 border-blue-400": dragOver }
              )}
              {...getDropzoneProps()}
            >
              <MaterialIcon
                iconName="cloud_upload"
                fill={1}
                className="text-[#1C63DB] p-2 border rounded-xl"
              />
              <p className="text-[#1C63DB] text-[14px]  font-semibold mt-[8px]">
                Click to upload
              </p>
              <p className="text-[#5F5F65] text-[14px] ">or drag and drop</p>
              <p className="text-[#5F5F65] text-[14px] ">
                pdf, doc, docx, png, jpeg and txt files
              </p>
            </div>
          )}

          <input className="hidden" {...getInputProps()} />
        </div>
        {items.length > 0 && (
          <Button
            variant="brightblue"
            className="self-end w-52"
            onClick={handleUpload}
          >
            {isUploading ? (
              <MaterialIcon
                iconName="progress_activity"
                className="text-white animate-spin"
                fill={1}
              />
            ) : (
              `Upload ${items.length} files`
            )}
          </Button>
        )}

        {selectedFiles.length > 0 && (
          <button
            className="w-fit flex items-center gap-2"
            onClick={() => setMovePopup(true)}
          >
            Move to another folder
            <MaterialIcon iconName="drive_file_move" />
          </button>
        )}

        <div className="flex flex-wrap gap-2">
          {!viewingFolder ? (
            <>
              {files?.root_folders.map((folder) => (
                <button
                  key={folder.id}
                  className="h-[55px] w-full md:w-[49%] bg-white px-3 py-2 rounded-md flex justify-between gap-4 items-center relative"
                  onClick={() => handleFolderClick(folder)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, folder.id)}
                >
                  <div className="flex items-center gap-2">
                    <MaterialIcon
                      iconName="folder"
                      fill={1}
                      className="text-blue-600"
                    />
                    <h3>{folder.name}</h3>
                  </div>
                  <span
                    onClick={(e) => handleDotsClick(folder, e)}
                    className="cursor-pointer"
                  >
                    <MaterialIcon iconName="more_vert" />
                  </span>
                  {menuOpenFolder && menuOpenFolder.id === folder.id && (
                    <div className="absolute z-50 w-fit p-[16px_14px] flex flex-col items-start gap-[6px] bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] right-0 top-[45px]">
                      <MenuItem
                        icon={<MaterialIcon iconName="create_new_folder" />}
                        label="Create subfolder"
                        onClick={() => setCreatePopup(true)}
                      />
                      <MenuItem
                        icon={<MaterialIcon iconName="edit" />}
                        label="Update folder"
                        onClick={() => setUpdatePopup(true)}
                      />
                      <MenuItem
                        icon={
                          <MaterialIcon
                            iconName="delete"
                            className="text-[#FF1F0F]"
                          />
                        }
                        label="Delete"
                        onClick={() => setIsDeleteOpen(true)}
                      />
                    </div>
                  )}
                </button>
              ))}

              {files?.root_files.map((file) => (
                <FileLibrary
                  key={file.id}
                  fileLibrary={file}
                  onDelete={handleDelete}
                  onFileSelect={handleFileSelect}
                  isSelected={selectedFiles.includes(file.id)}
                  onDragStart={handleDragStart}
                />
              ))}
            </>
          ) : (
            <>
              <div className="flex gap-[8px] items-start">
                <button
                  className="flex items-center justify-center w-fit"
                  onClick={handleReturnToAll}
                >
                  <MaterialIcon
                    iconName="arrow_back"
                    className="flex items-center justify-center w-[32px] h-[32px]"
                  />
                </button>
                <div className="flex flex-col gap-[8px] mb-[24px] justify-start">
                  <h2 className="text-2xl font-bold">
                    {folderContents?.current_folder.name}
                  </h2>
                  <p>{folderContents?.current_folder.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-full gap-[24px]">
                <div className="flex flex-wrap w-full gap-2">
                  {viewingFolder.subfolders?.map((subfolder) => (
                    <button
                      key={subfolder.id}
                      className="h-[55px] w-full md:w-[49%] bg-white px-3 py-2 rounded-md flex justify-between gap-4 items-center relative"
                      onClick={() => handleFolderClick(subfolder)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, subfolder.id)}
                    >
                      <div className="flex items-center gap-2">
                        <MaterialIcon
                          iconName="folder"
                          fill={1}
                          className="text-blue-600"
                        />
                        <h3>{subfolder.name}</h3>
                      </div>
                      <span
                        onClick={(e) => handleDotsClick(subfolder, e)}
                        className="cursor-pointer"
                      >
                        <MaterialIcon iconName="more_vert" />
                      </span>
                      {menuOpenFolder && menuOpenFolder.id === subfolder.id && (
                        <div className="absolute z-50 w-fit p-[16px_14px] flex flex-col items-start gap-[6px] bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] right-0 top-[45px]">
                          <MenuItem
                            icon={<MaterialIcon iconName="create_new_folder" />}
                            label="Create subfolder"
                            onClick={() => setCreatePopup(true)}
                          />
                          <MenuItem
                            icon={<MaterialIcon iconName="edit" />}
                            label="Update folder"
                            onClick={() => setUpdatePopup(true)}
                          />
                          <MenuItem
                            icon={
                              <MaterialIcon
                                iconName="delete"
                                className="text-[#FF1F0F]"
                              />
                            }
                            label="Delete"
                            onClick={() => setIsDeleteOpen(true)}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                  {viewingFolder.files?.map((file) => (
                    <FileLibrary
                      key={file.id}
                      fileLibrary={file}
                      onDelete={handleDelete}
                      onFileSelect={handleFileSelect}
                      isSelected={selectedFiles.includes(file.id)}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {menuOpenFolder && isDeleteOpen && (
        <DeleteMessagePopup
          contentId={menuOpenFolder.id}
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={handleFolderDelete}
        />
      )}
      {!menuOpenFolder && createPopup && (
        <UpdateFolderPopup
          onClose={() => setCreatePopup(false)}
          onComplete={createNewFolder}
          mode="Create"
        />
      )}
      {menuOpenFolder && createPopup && (
        <UpdateFolderPopup
          onClose={() => setCreatePopup(false)}
          onComplete={(name, decription) =>
            createNewFolder(name, decription, menuOpenFolder.id)
          }
          mode="CreateSubfolder"
        />
      )}
      {menuOpenFolder && updatePopup && (
        <UpdateFolderPopup
          onClose={() => setUpdatePopup(false)}
          onComplete={handleFolderUpdate}
          folder={folderContents}
          mode="Update"
        />
      )}
      {movePopup && (
        <MoveFilesPopup
          folders={
            viewingFolder ? viewingFolder.subfolders : files?.root_folders
          }
          onClose={() => setMovePopup(false)}
          onMove={handleMoveFiles}
        />
      )}
    </>
  );
};

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick: () => void;
}> = ({ icon, label, className = "", onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`flex items-center gap-2 w-full text-left text-[16px] font-[500] ${className}`}
  >
    <span className="w-[24px] h-[24px]">{icon}</span>
    {label}
  </button>
);
