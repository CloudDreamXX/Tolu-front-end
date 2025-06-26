import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DocumentsService, IDocument } from "entities/document";
import {
  ClientsInfo,
  ContentToMove,
  DocumentFolderInfo,
  FilesInfo,
  FoldersService,
  IContentItem,
  IFolder,
  InstructionInfo,
  ISubfolder,
} from "entities/folder";
import {
  CoachService,
  ISessionResponse,
  ISessionResult,
  RateContent,
  Share,
  ShareContentData,
} from "entities/coach";
import { PopoverAttach, PopoverClient, PopoverFolder, PopoverInstruction } from "widgets/content-popovers";
import Star from "shared/assets/icons/grey-star";
import Bin from "shared/assets/icons/grey-bin";
import Arrow from "shared/assets/icons/grey-arrow";
import Folders from "shared/assets/icons/grey-folders";
import Edit from "shared/assets/icons/grey-edit";
import MarkAs from "shared/assets/icons/grey-mark-as";
import Dislike from "shared/assets/icons/dislike";
import { Send } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  Textarea,
  ScrollArea,
  BreadcrumbItem,
} from "shared/ui";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { RootState } from "entities/store";
import subfolder from "shared/assets/icons/subfolder";
import { ChangeStatusPopup } from "widgets/ChangeStatusPopup";
import { RatePopup } from "widgets/RatePopup";
import { BadRateResponse } from "widgets/BadRateResponsePopup";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup/ui";
import { ChooseSubfolderPopup } from "widgets/ChooseSubfolderPopup";
import { ContentService } from "entities/content";
import BlueChevron from "shared/assets/icons/blue-chevron";
import Voiceover from "shared/assets/icons/voiceover";
import Attach from "shared/assets/icons/attach";

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
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [existingInstruction, setExistingInstruction] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [instruction, setInstruction] = useState<string>("");

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
  const [isRateOpen, setIsRateOpen] = useState<boolean>(false);
  const [isBadResponseOpen, setIsBadResponseOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDublicateOpen, setIsDublicateOpen] = useState<boolean>(false);
  const [isMoveOpen, setIsMoveOpen] = useState<boolean>(false);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [selectedDocumentStatus, setSelectedDocumentStatus] = useState<
    string | null
  >(null);

  const isNewDocument = location.state?.isNewDocument;
  const isTemporaryDocument = documentId?.startsWith("temp_");
  const token = useSelector((state: RootState) => state.user.token);
  const [sharedClients, setSharedClients] = useState<Share[] | null>(null);
  const [mobilePage, setMobilePage] = useState<1 | 2>(1);
  const [ratingsMap, setRatingsMap] = useState<Record<string, { rating: number; comment: string }>>({});

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
        async ({ documentId: realDocumentId }) => {
          if (documentId && clientId) {
            const data: ShareContentData = {
              content_id: realDocumentId,
              client_id: clientId,
            };
            await CoachService.shareContent(data);
          }

          await loadConversation(documentId);
          const response = await CoachService.getContentShares(realDocumentId);
          setSharedClients(response.shares);
          setIsCreatingDocument(false);
          navigate(
            `/content-manager/library/folder/${folderId}/document/${realDocumentId}`,
            { replace: true }
          );
          loadDocument(realDocumentId);
        }
      ).catch((error) => {
        console.error("Error creating document:", error);
        setIsCreatingDocument(false);
        navigate(-1);
      });

      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [isNewDocument, location.state, sharedClients]);

  useEffect(() => {
    if (!isNewDocument && !isTemporaryDocument && documentId) {
      const fetchShared = async () => {
        const response = await CoachService.getContentShares(documentId);
        setSharedClients(response.shares);
      };

      fetchShared();
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
      const response: ISessionResponse = await CoachService.getSessionById(
        chatId,
        clientId
      );
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
        files,
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
        async () => {
          await loadConversation(document.chatId);
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
      | "Archived", contentId?: string
  ) => {
    const newStatus = {
      id: contentId ? contentId : selectedDocumentId,
      status: status,
    };

    try {
      await CoachService.changeStatus(newStatus, token);
      setIsMarkAsOpen(false);
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

    const status = findContentItemByIdInFolder(folder, contentId)?.status;

    if (status) {
      setSelectedDocumentId(contentId);
      setSelectedDocumentStatus(status);
      setIsMarkAsOpen(true);
    } else {
      console.warn("Status not found for content ID:", contentId);
    }

    return;
  };

  const handleRateClick = async (
    id: string,
    rating: number,
    comment: string,
    down: boolean
  ) => {
    setRatingsMap(prev => ({
      ...prev,
      [id]: { rating, comment }
    }));
    const payload: RateContent = {
      content_id: id,
      rating: rating,
      thumbs_down: down,
      comment: comment,
    };
    await CoachService.rateContent(payload);
    setIsRateOpen(false);
    setIsBadResponseOpen(false);
  };

  const handleDeleteClick = async (id: string) => {
    await FoldersService.deleteContent(id);
    setIsDeleteOpen(false);
  };

  const handleDublicateClick = async (id: string) => {
    setIsDublicateOpen(true);
    const response = await ContentService.duplicateContentById(id);
    setSelectedDocumentId(response.duplicated_content.id);
  };

  const handleDublicateAndMoveClick = async (
    id: string,
    subfolderId: string
  ) => {
    const payload: ContentToMove = {
      content_id: id,
      target_folder_id: subfolderId,
    };
    await FoldersService.moveFolderContent(payload);
    setIsDublicateOpen(false);
  };

  const handleMoveClick = async (id: string, subfolderId: string) => {
    const payload: ContentToMove = {
      content_id: id,
      target_folder_id: subfolderId,
    };
    await FoldersService.moveFolderContent(payload);
    setIsMoveOpen(false);
  };

  const refreshSharedClients = async () => {
    if (!documentId) return;
    const response = await CoachService.getContentShares(documentId);
    setSharedClients(response.shares);
  };

  return (
    <div className="flex flex-col gap-2 px-[16px] md:px-[24px] xl:px-[60px] py-6 h-[calc(100vh-78px)] w-full">
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

          <div className="flex w-full flex-col md:flex-row gap-[12px] md:gap-[41px] md:min-h-[50px] md:items-center">
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
              <InstructionInfo instructions={document.originalInstructions} />
            ) : (
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
            )}
            {sharedClients ? (
              <ClientsInfo clients={sharedClients} documentId={documentId} refreshSharedClients={refreshSharedClients} />
            ) : (
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>

          <div className="flex flex-col h-full pt-6 max-w-[1080px] m-auto">
            <ScrollArea className="h-[calc(100%-64px)]">
              <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[310px] md:max-w-[563px] xl:max-w-[800px] flex flex-col gap-[8px] mb-[40px]">
                <p className="text-[24px] font-[500] text-[#1D1D1F]">
                  {documentTitle}
                </p>
                <p className="text-[18px] font-[500] text-[#1D1D1F]">
                  {document?.query}
                </p>
              </div>
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

              <div className="pb-80 flex flex-col gap-[32px]">
                {isCreatingDocument && (
                  <div className="prose-sm prose max-w-none">
                    {streamingIsHtml || isHtmlContent(streamingContent) ? (
                      <>
                        {parse(streamingContent)}
                        <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap">
                          {streamingContent}
                        </div>
                        <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
                      </>
                    )}
                  </div>
                )}

                {conversation.map((pair, index) => {
                  const isHTML = isHtmlContent(pair.content);

                  return (
                    <div key={index} className="flex flex-col gap-4">
                      {index > 0 && pair.query && (
                        <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[310px] md:max-w-[563px] xl:max-w-[800px]">
                          <p className="text-[18px] font-[500] text-[#1D1D1F]">
                            {pair.query}
                          </p>
                        </div>
                      )}
                      {compareIndex === index && index > 0 ? (
                        <div className="md:flex flex-row gap-4 block">
                          {/* Mobile paginated view */}
                          <div className="block md:hidden">
                            {mobilePage === 1 && (
                              <div className="p-6 flex flex-col gap-[16px]">
                                <div className="prose-sm prose max-w-none">
                                  {isHtmlContent(conversation[index - 1].content)
                                    ? parse(conversation[index - 1].content)
                                    : <div className="whitespace-pre-wrap">{conversation[index - 1].content}</div>
                                  }
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex justify-center items-center gap-[8px] text-[#1C63DB]">
                                  <button
                                    onClick={() => setMobilePage(1)}
                                    disabled={mobilePage === 1}
                                  >
                                    <span><BlueChevron /></span>
                                  </button>

                                  <div className="text-[16px] font-[500]">
                                    {mobilePage}/2
                                  </div>

                                  <button
                                    onClick={() => setMobilePage(2)}
                                  >
                                    <span className="block transform rotate-180"><BlueChevron /></span>
                                  </button>
                                </div>

                                <Button
                                  variant="brightblue"
                                  className="self-center w-fit"
                                  onClick={() => onStatusComplete("Ready for Review", conversation[index - 1].id)}
                                >
                                  Confirm and Mark as Ready for Review
                                </Button>
                              </div>
                            )}

                            {mobilePage === 2 && (
                              <div className="p-6 flex flex-col gap-[16px]">
                                <div className="prose-sm prose max-w-none">
                                  {isHtmlContent(pair.content)
                                    ? parse(pair.content)
                                    : <div className="whitespace-pre-wrap">{pair.content}</div>
                                  }
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex justify-center items-center gap-[8px] text-[#1C63DB]">
                                  <button
                                    onClick={() => setMobilePage(1)}
                                  >
                                    <span><BlueChevron /></span>
                                  </button>

                                  <div className="text-[16px] font-[500]">
                                    {mobilePage}/2
                                  </div>

                                  <button
                                    onClick={() => setMobilePage(2)}
                                    disabled={mobilePage === 2}
                                  >
                                    <span className="block transform rotate-180"><BlueChevron /></span>
                                  </button>
                                </div>

                                <Button
                                  variant="brightblue"
                                  className="self-center w-fit"
                                  onClick={() => onStatusComplete("Ready for Review", pair.id)}
                                >
                                  Confirm and Mark as Ready for Review
                                </Button>
                              </div>
                            )}
                          </div>


                          {/* Desktop layout */}
                          <div className="hidden md:flex flex-row gap-4">
                            {/* previous version */}
                            <div className="flex-1 p-6 flex flex-col gap-[64px]">
                              {isHtmlContent(conversation[index - 1].content)
                                ? <div className="prose-sm prose max-w-none">{parse(conversation[index - 1].content)}</div>
                                : <div className="whitespace-pre-wrap">{conversation[index - 1].content}</div>
                              }
                              <Button
                                variant="brightblue"
                                className="self-center w-fit"
                                onClick={() => onStatusComplete("Ready for Review", conversation[index - 1].id)}
                              >
                                Confirm and Mark as Ready for Review
                              </Button>
                            </div>

                            {/* current version */}
                            <div className="flex-1 p-6 flex flex-col gap-[64px]">
                              {isHtmlContent(pair.content)
                                ? <div className="prose-sm prose max-w-none">{parse(pair.content)}</div>
                                : <div className="whitespace-pre-wrap">{pair.content}</div>
                              }
                              <Button
                                variant="brightblue"
                                className="self-center w-fit"
                                onClick={() => onStatusComplete("Ready for Review", pair.id)}
                              >
                                Confirm and Mark as Ready for Review
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : compareIndex !== index ? (
                        isHTML ? (
                          <div className="prose-sm prose max-w-none">
                            {parse(pair.content)}
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">
                            {pair.content}
                          </div>
                        )
                      ) : null}
                      <div className="relative flex items-center">
                        <button
                          className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
                          onClick={() => {
                            setSelectedDocumentId(pair.id);
                            setIsRateOpen(true);
                          }}
                        >
                          <Star />
                        </button>

                        {isRateOpen && selectedDocumentId === pair.id && (
                          <RatePopup
                            contentId={pair.id}
                            onClose={() => setIsRateOpen(false)}
                            handleRateClick={handleRateClick}
                            ratingsMap={ratingsMap} />
                        )}
                        <button className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]">
                          <Edit />
                        </button>
                        <button
                          className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
                          onClick={() => {
                            setSelectedDocumentId(pair.id);
                            setIsMoveOpen(true);
                          }}
                        >
                          <Arrow />
                        </button>
                        <button
                          className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
                          onClick={() => handleDublicateClick(pair.id)}
                        >
                          <Folders />
                        </button>
                        <button
                          className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
                          onClick={() => {
                            handleMarkAsClick(pair.id);
                          }}
                        >
                          <MarkAs />
                        </button>
                        <button className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]">
                          <Voiceover />
                        </button>
                        <button
                          className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
                          onClick={() => {
                            setSelectedDocumentId(pair.id);
                            setIsBadResponseOpen(true);
                          }}
                        >
                          <Dislike />
                        </button>
                        <button
                          className="p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
                          onClick={() => {
                            setSelectedDocumentId(pair.id);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Bin />
                        </button>
                        <button
                          onClick={() =>
                            setCompareIndex(
                              compareIndex === index ? null : index
                            )
                          }
                          className="py-[4px] px-[10px] rounded-[8px] text-[18px] text-[#5F5F65] ml-[24px] hover:bg-[#EDF3FF] hover:text-[#1C63DB]"
                        >
                          {compareIndex === index ? "Return" : "Compare"}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {isSendingMessage && message && (
                  <div className="flex flex-col gap-4">
                    <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[310px] md:max-w-[563px] xl:max-w-[800px]">
                      <p className="text-[18px] font-[500] text-[#1D1D1F]">
                        {message}
                      </p>
                    </div>
                    {newMessageIsHtml || isHtmlContent(newMessageStreaming) ? (
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
            placeholder="Let’s start with a subject or writing request..."
            disabled={isSendingMessage}
            containerClassName="absolute bottom-8 xl:left-[50%] xl:translate-x-[-50%] w-full xl:w-[1080px] bg-white z-10 rounded-3xl overflow-hidden border border-[#008FF6]"
            className="h-20 text-lg font-medium text-gray-900 resize-none placeholder:text-gray-500"
            footer={
              <div className="flex flex-row w-full gap-[10px]">
                <PopoverAttach
                  setFiles={setFiles}
                  disabled={!folderId}
                  customTrigger={
                    <button className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-[#F3F6FB]">
                      <Attach />
                    </button>
                  }
                />
                <PopoverClient
                  setClientId={setClientId}
                  documentId={documentId}
                />
                <div className="flex items-center gap-[32px] ml-auto">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      // aria-pressed={enabled}
                      // onClick={() => setEnabled(!enabled)}
                      className={`relative inline-flex items-center w-[57.6px] h-[32px] rounded-[80px] border-2 border-[#B0B0B5] transition-colors duration-300 bg-[#B0B0B5]`}
                    // enabled ? "bg-[#8800B5]" : "bg-[#E4E4E7]"
                    >
                      <span
                        className={`inline-block w-[28.8px] h-[28.8px] rounded-full bg-white shadow-md transform transition-transform duration-300`}
                      // enabled ? "translate-x-[26.8px]" : "translate-x-0"
                      />
                    </button>
                    <span className="text-[#5F5F65] font-semibold text-[16px]">
                      Case-based generation
                    </span>
                  </div>
                  <Button
                    variant="black"
                    className="ml-auto w-12 h-12 p-[10px] rounded-full"
                    onClick={handleSendMessage}
                    disabled={isSendingMessage}
                  >
                    <Send color="#fff" />
                  </Button>
                </div>
              </div>
            }
          />
        </div>

        {folder && folder.name === "Published" && (
          <div className="pt-[75px] w-full max-w-[196px] bg-[#F6F9FF] h-full px-0.5">
            <h3 className="text-lg font-semibold px-[22px] pb-[15px] border-b border-[#008FF6] border-opacity-20">
              User Engagement
            </h3>
            <div className="py-[23px] px-[31px] flex flex-col gap-5">
              {[
                {
                  label: "Revenue generated",
                  value: document?.revenueGenerated,
                },
                { label: "Read by users", value: document?.readCount },
                { label: "Saved by users", value: document?.savedCount },
                { label: "Feedback received", value: document?.feedbackCount },
                { label: "Comments", value: document?.comments },
                {
                  label: "Social media shares",
                  value: document?.socialMediaShares,
                },
              ].map((item, idx) => (
                <div className="flex flex-col" key={idx}>
                  <h5 className="text-sm font-semibold">{item.label}</h5>
                  <p className="text-2xl font-bold">
                    {item.value ?? (
                      <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isMarkAsOpen && selectedDocumentId && selectedDocumentStatus && (
          <ChangeStatusPopup
            onClose={() => setIsMarkAsOpen(false)}
            onComplete={onStatusComplete}
            currentStatus={selectedDocumentStatus as "Raw" |
              "Ready for Review" |
              "Waiting" |
              "Second Review Requested" |
              "Ready to Publish" |
              "Live" |
              "Archived"} handleMoveClick={handleMoveClick}
            contentId={selectedDocumentId}
          />
        )}
        {isBadResponseOpen && (
          <BadRateResponse
            contentId={selectedDocumentId}
            handleRateClick={handleRateClick}
            onClose={() => setIsBadResponseOpen(false)}
          />
        )}
        {isDeleteOpen && (
          <DeleteMessagePopup
            contentId={selectedDocumentId}
            onCancel={() => setIsDeleteOpen(false)}
            onDelete={handleDeleteClick}
          />
        )}
        {isDublicateOpen && (
          <ChooseSubfolderPopup
            title={"Duplicate"}
            contentId={selectedDocumentId}
            handleSave={handleDublicateAndMoveClick}
            onClose={() => setIsDublicateOpen(false)}
            parentFolderId={folder?.id || ""}
          />
        )}
        {isMoveOpen && (
          <ChooseSubfolderPopup
            title={"Move"}
            contentId={selectedDocumentId}
            handleSave={handleMoveClick}
            onClose={() => setIsMoveOpen(false)}
            parentFolderId={folder?.id || ""}
          />
        )}
      </div>
    </div>
  );
};
