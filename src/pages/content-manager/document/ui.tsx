import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DocumentsService, IDocument } from "entities/document";
import { ClientsInfo, DocumentEditPopover, DocumentFolderInfo, FilesInfo, FoldersService, IContentItem, IFolder, ISubfolder } from "entities/folder";
import { CoachService, ISessionResponse, ISessionResult } from "entities/coach";
import { PopoverClient } from "widgets/content-popovers";
import Star from "shared/assets/icons/grey-star";
import Bin from "shared/assets/icons/grey-bin";
import Arrow from "shared/assets/icons/grey-arrow";
import Folders from "shared/assets/icons/grey-folders";
import Edit from "shared/assets/icons/grey-edit";
import MarkAs from "shared/assets/icons/grey-mark-as";
import Dislike from "shared/assets/icons/dislike";
import { Send } from "lucide-react";
import { Breadcrumb, BreadcrumbLink, BreadcrumbSeparator, Button, Textarea, ScrollArea, BreadcrumbItem } from "shared/ui";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { RootState } from "entities/store";
import subfolder from "shared/assets/icons/subfolder";
import { ChangeStatusPopup } from "widgets/ChangeStatusPopup";

const isHtmlContent = (content: string): boolean => /<[^>]*>/.test(content);

export const ContentManagerDocument: React.FC = () => {
  const { tab, documentId, folderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { folders } = useSelector((state: RootState) => state.folder);

  const [document, setDocument] = useState<IDocument | null>(null);
  const [folder, setFolder] = useState<IFolder | null>(null);
  const [message, setMessage] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);

  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingIsHtml, setStreamingIsHtml] = useState(false);
  const [documentTitle, setDocumentTitle] = useState<string>("");

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [newMessageStreaming, setNewMessageStreaming] = useState<string>("");
  const [newMessageIsHtml, setNewMessageIsHtml] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ISessionResult[]>([]);
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [isMarkAsOpen, setIsMarkAsOpen] = useState<boolean>(false);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedDocumentStatus, setSelectedDocumentStatus] = useState<string | null>(null);

  const isNewDocument = location.state?.isNewDocument;
  const isTemporaryDocument = documentId?.startsWith("temp_");
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (isNewDocument && location.state) {
      setIsCreatingDocument(true);
      setDocumentTitle(location.state.originalTitle ?? "New Document");
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
        ({ documentId: realDocumentId }) => {
          // setConversation([
          //   {
          //     user: location.state.originalMessage ?? "",
          //     ai: accumulatedReply,
          //     isHtml: streamingIsHtml || isHtmlContent(accumulatedReply),
          //   },
          // ]);
          setIsCreatingDocument(false);
          navigate(`/content-manager/library/folder/${folderId}/document/${realDocumentId}`, { replace: true });
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
        console.log("suoperresonaeofkasd", response)
        if (response) setFolder(response);
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
        setDocumentTitle(response.title);
        loadConversation(response.chatId);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setDocument(null);
    }
  };

  const loadConversation = async (chatId: string | undefined) => {
    if (!chatId) return;

    try {
      const response: ISessionResponse = await CoachService.getSessionById(chatId, clientId);
      if (response?.search_results) {
        setConversation(response.search_results);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !document || !folderId) return;

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
        folderId,
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
        () => {
          // setConversation((prev) => [
          //   ...prev,
          //   {
          //     user: message,
          //     ai: accumulatedReply,
          //     isHtml: newMessageIsHtml || isHtmlContent(accumulatedReply),
          //   },
          // ]);
          setMessage("");
          setIsSendingMessage(false);
          setNewMessageStreaming("");
          setNewMessageIsHtml(false);
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSendingMessage(false);
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
    if (!selectedDocumentId) return;

    const newStatus = {
      id: selectedDocumentId,
      status: status,
    };

    try {
      await CoachService.changeStatus(newStatus, token);
      setIsMarkAsOpen(false);
      console.log("Selected status:", status);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  function findContentItemByIdInFolder(
    currentFolder: IFolder | ISubfolder,
    contentItemId: string
  ): IContentItem | null {
    for (const contentItem of currentFolder.content) {
      if (contentItem.id === contentItemId) {
        return contentItem;
      }

      if (Array.isArray(contentItem.messages)) {
        for (const message of contentItem.messages) {
          if (message.id === contentItemId) {
            return contentItem;
          }
        }
      }
    }

    for (const subfolder of currentFolder.subfolders) {
      const result = findContentItemByIdInFolder(subfolder, contentItemId);
      if (result) {
        return result;
      }
    }

    return null;
  }



  const handleMarkAsClick = (contentId: string) => {
    if (!folder) return;

    const status = findContentItemByIdInFolder(folder, contentId)?.status

    if (status) {
      setSelectedDocumentId(contentId);
      setSelectedDocumentStatus(status);
      setIsMarkAsOpen(true);
    } else {
      console.warn("Status not found for content ID:", contentId);
    }

    return;
  };

  console.log(folder)

  return (
    <div className="flex flex-col gap-2 px-[60px] py-6 h-[calc(100vh-78px)] w-full">
      <div className="flex flex-row w-full h-full gap-[26px]">
        <div className="relative flex flex-col w-full h-full gap-2">
          <Breadcrumb className="flex flex-row gap-2 text-sm text-muted-foreground">
            {folder && (
              <>
                <BreadcrumbLink className="capitalize" href={`/content-manager/${tab}`}>{tab}</BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbLink className="capitalize" href={`/content-manager/${tab}/folder/${folder.id}`}>{folder.name}</BreadcrumbLink>
                {subfolder && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>{subfolder.name ?? "Unknown Folder"}</BreadcrumbItem>
                  </>
                )}
              </>
            )}
          </Breadcrumb>

          <div className="flex w-full flex-row gap-[41px] min-h-[50px] items-center">
            {document ? <DocumentFolderInfo folderId={document.originalFolderId} folderName={document.originalFolderName} /> : <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>}
            {document ? <FilesInfo files={document.originalFiles} /> : <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>}
            {document ? <ClientsInfo client={document.sharedWith.clients} /> : <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>}
          </div>

          <div className="flex flex-col h-full pt-6">
            <ScrollArea className="h-[calc(100%-64px)]">
              <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[800px] flex flex-col gap-[8px] mb-[40px]">
                <p className="text-[24px] font-[500] text-[#1D1D1F]">{documentTitle}</p>
                <p className="text-[18px] font-[500] text-[#1D1D1F]">{document?.query}</p>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-3xl font-bold">{document?.title ?? documentTitle}</h1>
                {(isCreatingDocument || isSendingMessage) && (
                  <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                    {isCreatingDocument ? "Creating..." : "Generating..."}
                  </span>
                )}
              </div>

              <div className="pb-80 flex flex-col gap-[32px]">
                {conversation.map((pair, index) => {
                  console.log(pair)

                  const isHTML = isHtmlContent(pair.content)

                  return (
                    <div key={index} className="flex flex-col gap-4">
                      {index > 0 && pair.query && (
                        <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[800px]">
                          <p className="text-[18px] font-[500] text-[#1D1D1F]">{pair.query}</p>
                        </div>
                      )}
                      {compareIndex === index && index > 0 ? (
                        <div className="flex flex-row gap-4">
                          {/* Previous version */}
                          <div className="flex-1 p-6 flex flex-col gap-[64px]">
                            {isHtmlContent(conversation[index - 1].content) ? (
                              <div className="prose-sm prose max-w-none">{parse(conversation[index - 1].content)}</div>
                            ) : (
                              <div className="whitespace-pre-wrap">{conversation[index - 1].content}</div>
                            )}
                            <Button variant="brightblue" className="self-center w-fit">
                              Confirm and Mark as Ready for Review
                            </Button>
                          </div>

                          {/* Current version */}
                          <div className="flex-1 p-6 flex flex-col gap-[64px]">
                            {isHTML ? (
                              <div className="prose-sm prose max-w-none">{parse(pair.content)}</div>
                            ) : (
                              <div className="whitespace-pre-wrap">{pair.content}</div>
                            )}
                            <Button variant="brightblue" className="self-center w-fit">
                              Confirm and Mark as Ready for Review
                            </Button>
                          </div>
                        </div>
                      ) : compareIndex !== index ? (
                        isHTML ? (
                          <div className="prose-sm prose max-w-none">{parse(pair.content)}</div>
                        ) : (
                          <div className="whitespace-pre-wrap">{pair.content}</div>
                        )
                      ) : null}
                      <div className="flex items-center">
                        <button className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"><Star /></button>
                        <button className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"><Edit /></button>
                        <button className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"><Arrow /></button>
                        <button className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"><Folders /></button>
                        <button
                          className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
                          onClick={() => {
                            console.log("ID:", pair.id);
                            handleMarkAsClick(pair.id);
                          }}
                        >
                          <MarkAs />
                        </button>
                        <button className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"><Dislike /></button>
                        <button className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"><Bin /></button>
                        <button
                          onClick={() => setCompareIndex(compareIndex === index ? null : index)}
                          className="py-[4px] px-[10px] rounded-[8px] text-[18px] text-[#5F5F65] ml-[24px] hover:bg-[#EDF3FF] hover:text-[#1C63DB]"
                        >
                          {compareIndex === index ? "Return" : "Compare"}
                        </button>
                      </div>
                    </div>
                  )

                })}

                {isSendingMessage && message && (
                  <div className="flex flex-col gap-4">
                    <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[800px]">
                      <p className="text-[18px] font-[500] text-[#1D1D1F]">{message}</p>
                    </div>
                    {(newMessageIsHtml || isHtmlContent(newMessageStreaming)) ? (
                      <div className="prose-sm prose max-w-none">
                        {parse(newMessageStreaming)}
                        <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {newMessageStreaming}
                        <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Continue the conversation..."
            disabled={isSendingMessage}
            containerClassName="absolute bottom-8 left-[140px] w-[70%] bg-white z-10 rounded-3xl overflow-hidden border border-[#008FF6]"
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

        {folder && folder.name === "Published" && <div className="pt-[75px] w-full max-w-[196px] bg-[#F6F9FF] h-full px-0.5">
          <h3 className="text-lg font-semibold px-[22px] pb-[15px] border-b border-[#008FF6] border-opacity-20">
            User Engagement
          </h3>
          <div className="py-[23px] px-[31px] flex flex-col gap-5">
            {[
              { label: "Revenue generated", value: document?.revenueGenerated },
              { label: "Read by users", value: document?.readCount },
              { label: "Saved by users", value: document?.savedCount },
              { label: "Feedback received", value: document?.feedbackCount },
              { label: "Comments", value: document?.comments },
              { label: "Social media shares", value: document?.socialMediaShares },
            ].map((item, idx) => (
              <div className="flex flex-col" key={idx}>
                <h5 className="text-sm font-semibold">{item.label}</h5>
                <p className="text-2xl font-bold">
                  {item.value ?? <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />}
                </p>
              </div>
            ))}
          </div>
        </div>}

        {isMarkAsOpen && selectedDocumentId && selectedDocumentStatus && (
          <ChangeStatusPopup
            onClose={() => setIsMarkAsOpen(false)}
            onComplete={onStatusComplete}
            currentStatus={selectedDocumentStatus as
              | "Raw"
              | "Ready for Review"
              | "Waiting"
              | "Second Review Requested"
              | "Ready to Publish"
              | "Live"
              | "Archived"}
          />
        )}
      </div>
    </div>
  );
};
