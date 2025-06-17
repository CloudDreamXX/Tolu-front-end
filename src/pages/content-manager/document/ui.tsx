import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ClientsInfo,
  FilesInfo,
  DocumentFolderInfo,
  DocumentEditPopover,
  IFolder,
  FoldersService,
} from "entities/folder";
import parse from "html-react-parser";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  ScrollArea,
  Textarea,
} from "shared/ui";

import { PopoverClient } from "widgets/content-popovers";
import { Send } from "lucide-react";
import { DocumentsService, IDocument } from "entities/document";
import { useSelector } from "react-redux";
import { RootState } from "entities/store";
import { CoachService } from "entities/coach";

const isHtmlContent = (content: string): boolean => {
  const htmlRegex = /<[^>]*>/;
  return htmlRegex.test(content);
};

export const ContentManagerDocument: React.FC = () => {
  const { tab, documentId, folderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { folders } = useSelector((state: RootState) => state.folder);

  const [document, setDocument] = useState<IDocument | null>();
  const [folder, setFolder] = useState<IFolder | null>(null);
  const [message, setMessage] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);

  const [isCreatingDocument, setIsCreatingDocument] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingIsHtml, setStreamingIsHtml] = useState<boolean>(false);
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [originalMessage, setOriginalMessage] = useState<string>("");

  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [newMessageStreaming, setNewMessageStreaming] = useState<string>("");
  const [newMessageIsHtml, setNewMessageIsHtml] = useState<boolean>(false);

  const [finalContent, setFinalContent] = useState<string>("");

  const subfolder = folder?.subfolders.find(
    (subfolder) => subfolder.id === document?.originalFolderId
  );

  const isNewDocument = location.state?.isNewDocument;
  const isTemporaryDocument = documentId?.startsWith("temp_");

  useEffect(() => {
    if (isNewDocument && location.state) {
      setIsCreatingDocument(true);
      setDocumentTitle(location.state.originalTitle ?? "New Document");
      setOriginalMessage(location.state.originalMessage ?? "");
      setStreamingContent("");
      setStreamingIsHtml(false);
      const {
        chatMessage,
        folderId: stateFolderId,
        files: stateFiles,
        instruction: stateInstruction,
        clientId: stateClientId,
      } = location.state;

      let accumulatedReply = "";

      CoachService.aiLearningSearch(
        chatMessage,
        stateFolderId,
        stateInstruction ?? "",
        stateFiles ?? [],
        stateClientId,
        (chunk) => {
          if (chunk.reply) {
            accumulatedReply += chunk.reply;
            setStreamingContent(accumulatedReply);

            if (!streamingIsHtml && isHtmlContent(accumulatedReply)) {
              setStreamingIsHtml(true);
            }
          }
        },
        ({
          folderId: completedFolderId,
          documentId: realDocumentId,
          chatId,
        }) => {
          setFinalContent(accumulatedReply);
          setIsCreatingDocument(false);

          const newUrl = `/content-manager/library/folder/${folderId}/document/${realDocumentId}`;
          navigate(newUrl, { replace: true });

          loadDocument(realDocumentId);
        }
      ).catch((error) => {
        console.error("Error creating document:", error);
        setIsCreatingDocument(false);
        navigate(-1);
      });

      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [isNewDocument, location.state]);

  useEffect(() => {
    if (!isNewDocument && !isTemporaryDocument) {
      loadDocument(documentId);
    }
  }, [documentId, isNewDocument, isTemporaryDocument]);

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

  const loadDocument = async (docId: string | undefined) => {
    if (!docId) return;

    try {
      const response = await DocumentsService.getDocumentById(docId);

      if (response) {
        setDocument(response);

        if (finalContent) {
          console.debug("Using existing final content:", finalContent);
        } else if (response.content) {
          setFinalContent(response.content);
          setStreamingIsHtml(isHtmlContent(response.content));
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setDocument(null);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    if (!document || !folderId) return;

    setIsSendingMessage(true);
    setNewMessageStreaming("");
    setNewMessageIsHtml(false);

    let accumulatedReply = "";

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
        undefined,
        undefined,
        clientId,
        (chunk) => {
          if (chunk.reply) {
            accumulatedReply += chunk.reply;
            setNewMessageStreaming(accumulatedReply);

            if (!newMessageIsHtml && isHtmlContent(accumulatedReply)) {
              setNewMessageIsHtml(true);
            }
          }
        },
        (completedData) => {
          const isHtml = newMessageIsHtml || isHtmlContent(accumulatedReply);
          const separator = isHtml ? "<br><br>" : "\n\n";
          const newContent = finalContent + separator + accumulatedReply;

          setFinalContent(newContent);
          setStreamingIsHtml(isHtml || streamingIsHtml);
          setNewMessageStreaming("");
          setNewMessageIsHtml(false);
          setMessage("");
          setIsSendingMessage(false);
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSendingMessage(false);
      setNewMessageStreaming("");
      setNewMessageIsHtml(false);
    }
  };

  const displayContent = isCreatingDocument
    ? streamingContent
    : ((finalContent || document?.content) ?? "");

  const contentIsHtml = streamingIsHtml ?? isHtmlContent(displayContent);

  const fullDisplayContent =
    isSendingMessage && newMessageStreaming
      ? displayContent +
        (contentIsHtml ? "<br><br>" : "\n\n") +
        newMessageStreaming
      : displayContent;

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
            {document ? (
              <DocumentFolderInfo
                folderId={document.originalFolderId}
                folderName={document.originalFolderName}
              />
            ) : (
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
            )}
            {document ? (
              <FilesInfo files={document.originalFiles} />
            ) : (
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
            )}
            {document ? (
              <ClientsInfo client={document.sharedWith.clients} />
            ) : (
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
            )}
            {folder && document ? (
              <div className="ml-auto">
                <DocumentEditPopover
                  document={document}
                  folder={folder}
                  tab={tab}
                />
              </div>
            ) : (
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>

          <div className="flex flex-col h-full pt-6">
            <ScrollArea className="h-[calc(100%-64px)]">
              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-3xl font-bold">
                  {document?.title ?? documentTitle}
                </h1>
                {(isCreatingDocument || isSendingMessage) && (
                  <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                    {isCreatingDocument ? "Creating..." : "Generating..."}
                  </span>
                )}
              </div>

              {fullDisplayContent ? (
                <div className="pb-40">
                  {contentIsHtml ? (
                    <div className="prose-sm prose max-w-none">
                      {parse(fullDisplayContent)}
                      {isSendingMessage && newMessageStreaming
                        ? '<span class="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span> '
                        : ""}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">
                      {fullDisplayContent}
                      {((isCreatingDocument && streamingContent) ||
                        (isSendingMessage && newMessageStreaming)) && (
                        <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-blue-600">
                    {isCreatingDocument
                      ? "AI is creating your document..."
                      : "AI is generating response..."}
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Continue the conversation..."
            disabled={isSendingMessage}
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
                  disabled={isSendingMessage}
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
                {document?.revenueGenerated ?? (
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                )}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Read by users</h5>
              <p className="text-2xl font-bold">
                {document?.readCount ?? (
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                )}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Saved by users</h5>
              <p className="text-2xl font-bold">
                {document?.savedCount ?? (
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                )}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Feedback received</h5>
              <p className="text-2xl font-bold">
                {document?.feedbackCount ?? (
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                )}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Comments</h5>
              <p className="text-2xl font-bold">
                {document?.comments ?? (
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                )}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Social media shares</h5>
              <p className="text-2xl font-bold">
                {document?.socialMediaShares ?? (
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
