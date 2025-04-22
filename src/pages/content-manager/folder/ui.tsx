import { useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  Input,
} from "shared/ui";
import { FOLDERS } from "./mock";
import { useState } from "react";
import {
  ClientsInfo,
  DocumentCard,
  FilesInfo,
  FolderInfo,
  IFolder,
  InstructionInfo,
} from "entities/folder";
import Search from "shared/assets/icons/search";
import { ArchiveRestore, Plus } from "lucide-react";
import { FolderClientsInfo } from "entities/folder/ui/folder-clients-info";

export const ContentManagerFolder: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const location = window.location.pathname;
  const folderName = location.split("/")[3];
  const [folder] = useState<IFolder | null>(
    FOLDERS.find((f) => f.id === folderId) || null
  );
  const [documents] = useState(folder?.documents);
  const [search, setSearch] = useState<string>("");
  const canChange = folderName === "approved";
  const isArchived = folder?.status === "archived";

  const filteredDocuments = documents?.filter((doc) => {
    return doc.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-12 p-8">
      <Breadcrumb className="flex flex-row gap-2 text-sm text-muted-foreground">
        <BreadcrumbLink href="/content-manager/approved">
          Approved
        </BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{folder?.name}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>...</BreadcrumbItem>
      </Breadcrumb>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          {isArchived ? (
            <div className="flex flex-row justify-between w-full gap-2">
              <FolderInfo folderName={folder?.name} />
              <Button variant={"blue2"} className="flex flex-row gap-1.5">
                <ArchiveRestore size={20} />
                Restore
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-row gap-[41px] min-h-[50px] items-center">
                <FolderInfo folderName={folder?.name} />
                <FilesInfo files={folder?.files} isAttached />
                <InstructionInfo
                  instructions={folder?.instructions}
                  title="Instructions to folder"
                  description="Personalize content using instructions"
                />
                {canChange ? (
                  <FolderClientsInfo client={folder?.clients} />
                ) : (
                  <ClientsInfo client={folder?.clients} />
                )}
              </div>
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
            </>
          )}
        </div>
        <div className="flex flex-row flex-wrap w-full gap-4">
          {filteredDocuments?.map((document) => (
            <DocumentCard
              key={document.title}
              document={document}
              customTabLink={`/content-manager/document/${folderName}/${document.folderId}/${document.id}`}
              withText={folderName === "published" || folderName === "archived"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
