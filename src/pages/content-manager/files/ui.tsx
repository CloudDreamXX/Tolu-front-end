import {
  useDeleteFileLibraryMutation,
  useFetchAllFilesQuery,
  useUploadFilesLibraryMutation,
} from "entities/files-library/filesLibraryApi";
import { useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button } from "shared/ui";
import { useFilePicker } from "shared/hooks/useFilePicker";
import { FileLibrary } from "./components/FileLibrary";

export const FilesLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);

  const { items, getDropzoneProps, getInputProps, dragOver, clear } =
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

  const handleUpload = async () => {
    await uploadFiles({
      files: items.map((item) => item.file),
      descriptions: JSON.stringify(
        items.map((item, index) => ({ [index]: item.file.name }))
      ),
    });
    clear();
    refetch();
  };

  const handleDelete = async (fileId: string) => {
    await deleteFile(fileId);
    await refetch();
  };

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
      <div className="flex flex-col gap-4 md:gap-[35px] p-3 md:p-8 overflow-y-auto h-full">
        <div className="flex flex-col md:flex-row gap-[16px] justify-between md:items-end">
          <div className="flex flex-col gap-2">
            <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
              <MaterialIcon iconName="folder" fill={1} />
              Files library
            </h1>
            <p>All the files you were attaching through the Tolu platform</p>
          </div>
          <div className="flex md:flex-row flex-row gap-2 md:gap-[20px] lg:gap-2">
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
          </div>
        </div>

        <div>
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
            <p className="text-[#1C63DB] text-[14px] font-[Nunito] font-semibold mt-[8px]">
              Click to upload
            </p>
            <p className="text-[#5F5F65] text-[14px] font-[Nunito]">
              or drag and drop
            </p>
            <p className="text-[#5F5F65] text-[14px] font-[Nunito]">
              pdf, doc, docx, png, jpeg and txt files
            </p>
            <input className="hidden" {...getInputProps()} />
          </div>
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

        <div className="flex flex-wrap gap-2">
          {files?.files.map((file) => (
            <FileLibrary
              key={file.id}
              fileLibrary={file}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
};
