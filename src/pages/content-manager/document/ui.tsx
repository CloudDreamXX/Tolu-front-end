import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ClientsInfo,
  FilesInfo,
  DocumentFolderInfo,
  DocumentEditPopover,
  IFolder,
  FoldersService,
} from "entities/folder";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  ScrollArea,
  Textarea,
} from "shared/ui";

import { PopoverClient, PopoverFolder } from "widgets/content-popovers";
import { Send } from "lucide-react";
import { DocumentsService, IDocument } from "entities/document";
import { useSelector } from "react-redux";
import { RootState } from "entities/store";
import { CoachService } from "entities/coach";

export const ContentManagerDocument: React.FC = () => {
  const { tab, documentId, folderId } = useParams();
  const { folders } = useSelector((state: RootState) => state.folder);
  const [document, setDocument] = useState<IDocument | null>();
  const [folder, setFolder] = useState<IFolder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);

  const subfolder = folder?.subfolders.find(
    (subfolder) => subfolder.id === document?.originalFolderId
  );

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await DocumentsService.getDocumentById(
          documentId ?? ""
        );
        console.log("Fetched document:", response);
        setDocument(response);
      } catch (error) {
        console.error("Error fetching document:", error);
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        if (!folderId) return;

        const folder = folders.find((f) => f.id === folderId);
        if (folder) {
          setFolder(folder);
          return;
        }

        const response = await FoldersService.getFolder(folderId);
        if (response) {
          setFolder(response);
        } else {
          setFolder(null);
        }
      } catch (error) {
        console.error("Error fetching folder:", error);
      }
    };

    fetchFolder();
  }, [folderId]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    if (!document || !folderId) return;

    setLoading(true);

    try {
      await CoachService.aiLearningSearch(
        {
          user_prompt: message,
          is_new: false,
          chat_id: document.chatId ?? "",
          regenerate_id: null,
          chat_title: document?.title ?? "",
        },
        subfolder?.id ?? folderId,
        [],
        clientId,
        (chunk) => {
          console.log("Streaming chunk:", chunk.reply);
        },
        (completedFolderId) => {
          console.log(
            "Message sent successfully to folder:",
            completedFolderId
          );
          setMessage("");
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!document) {
    return <div>Document not found</div>;
  }

  console.log("folder", folder);

  return (
    <div className="flex flex-col gap-2 px-[60px] py-6 h-[calc(100vh-78px)] w-full">
      <div className="flex flex-row w-full h-full gap-[26px]">
        <div className="relative flex flex-col w-full h-full gap-2">
          <Breadcrumb className="flex flex-row gap-2 text-sm text-muted-foreground">
            {folder && (
              <>
                <BreadcrumbLink
                  className="capitalize"
                  href={`/content-manager/${tab}`}
                >
                  {tab}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbLink
                  className="capitalize"
                  href={`/content-manager/${tab}/folder/${folder.id}`}
                >
                  {folder.name}
                </BreadcrumbLink>
                {subfolder && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {subfolder.name ?? "Unknown Folder"}
                    </BreadcrumbItem>
                  </>
                )}
              </>
            )}
          </Breadcrumb>
          <div className="flex w-full flex-row gap-[41px] min-h-[50px] items-center">
            <DocumentFolderInfo
              folderId={document.originalFolderId}
              folderName={document.originalFolderName}
            />
            <FilesInfo files={document.originalFiles} />
            <ClientsInfo client={document.sharedWith.clients} />
            <div className="ml-auto">
              {folder && (
                <DocumentEditPopover
                  document={document}
                  folder={folder}
                  tab={tab}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col h-full pt-6">
            <ScrollArea className="h-[calc(100%-64px)]">
              <h1 className="mb-4 text-3xl font-bold">{document.title}</h1>

              <div
                dangerouslySetInnerHTML={{ __html: document.content }}
                className="pb-40"
              />
            </ScrollArea>
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Let's start with a subject or writing request..."
            containerClassName={
              "absolute bottom-8 left-[140px] w-[70%] bg-white z-10 rounded-3xl overflow-hidden border border-[#008FF6]"
            }
            className="h-20 text-lg font-medium text-gray-900 resize-none placeholder:text-gray-500"
            footer={
              <div className="flex flex-row w-full gap-[10px]">
                <PopoverClient setClientId={setClientId} />
                <Button
                  variant="black"
                  className="ml-auto w-12 h-12 p-[10px] rounded-full"
                  onClick={handleSendMessage}
                >
                  <Send color="#fff" />
                </Button>
              </div>
            }
          />
        </div>

        <div className="pt-[75px] w-full max-w-[196px] bg-[#F6F9FF] h-full px-0.5">
          <h3 className="text-lg font-semibold px-[22px] pb-[15px] border-b border-[#008FF6] border-opacity-20">
            User Engagement
          </h3>
          <div className="py-[23px] px-[31px] flex flex-col gap-5">
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Revenue generated</h5>
              <p className="text-2xl font-bold">
                {document.revenueGenerated ?? "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Read by users</h5>
              <p className="text-2xl font-bold">{document.readCount ?? "--"}</p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Saved by users</h5>
              <p className="text-2xl font-bold">
                {document.savedCount ?? "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Feedback received</h5>
              <p className="text-2xl font-bold">
                {document.feedbackCount ?? "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Comments</h5>
              <p className="text-2xl font-bold">{document.comments ?? "--"}</p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Social media shares</h5>
              <p className="text-2xl font-bold">
                {document.socialMediaShares ?? "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
