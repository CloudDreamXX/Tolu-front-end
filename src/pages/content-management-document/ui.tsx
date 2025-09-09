import { ContentService, CreatorProfile } from "entities/content";
import { DocumentsService, IDocument } from "entities/document";
import { ChatLoading } from "features/chat";
import parse from "html-react-parser";
import { useTextSelectionTooltip } from "pages/content-manager/document/lib";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast, usePageWidth } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { DocumentLoadingSkeleton } from "pages/library-document/lib";
import { ChatActionsAdmin } from "features/chat/ui/chat-actions-admin/ui";
import { ChangeAdminStatusPopup } from "widgets/change-admin-status-popup";
import { AdminService, ManageContentData } from "entities/admin";

export const ContentManagementDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [isLoadingSession] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(
    null
  );
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [creatorPhoto, setCreatorPhoto] = useState<string | null>(null);
  const [isCreatorCardOpen, setIsCreatorCardOpen] = useState(false);
  const [statusPopup, setStatusPopup] = useState<
    "approve" | "reject" | "unpublish" | null
  >(null);

  const dispatch = useDispatch();
  const { tooltipPosition, showTooltip, handleTooltipClick } =
    useTextSelectionTooltip();
  const { isMobile } = usePageWidth();

  const loadDocument = async (docId: string | undefined) => {
    if (!docId) return;
    setIsLoadingDocument(true);
    try {
      const response = await DocumentsService.getDocumentById(docId);
      if (response) {
        setSelectedDocument(response);
        const creatorData = await ContentService.getCreatorProfile(
          response.creator_id
        );
        setCreator(creatorData);
        if (
          creatorData.detailed_profile &&
          creatorData.detailed_profile.personal_info &&
          creatorData.detailed_profile.personal_info.headshot_url
        ) {
          const filename =
            creatorData.detailed_profile.personal_info.headshot_url
              ?.split("/")
              .pop() || "";
          const blob = await ContentService.getCreatorPhoto(
            creatorData.creator_id,
            filename
          );
          const objectUrl = URL.createObjectURL(blob);
          setCreatorPhoto(objectUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setSelectedDocument(null);
    } finally {
      setIsLoadingDocument(false);
    }
  };

  useEffect(() => {
    loadDocument(documentId);
  }, [documentId, dispatch]);

  const onStatusChange = async (comment?: string, reason?: string) => {
    try {
      const payload: ManageContentData = {
        content_id: documentId || "",
        action: statusPopup ? statusPopup : "reject",
        admin_comment: comment?.trim() || undefined,
        unpublish_reason:
          statusPopup === "unpublish" ? reason?.trim() : undefined,
      };

      await AdminService.manageContent(payload);
      toast({
        title: "Status changed successfully",
      });
      setStatusPopup(null);
      loadDocument(documentId);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to change document status",
      });
    }
  };

  return (
    <div className="flex flex-col gap-[16px] md:gap-[35px] p-8 overflow-y-auto h-[calc(100vh-110px)]">
      {!isLoadingDocument && selectedDocument && (
        <div className="w-full flex justify-center text-[16px] text-[#1D1D1F] font-semibold relative">
          Created by{" "}
          {
            <span
              tabIndex={0}
              aria-haspopup="dialog"
              aria-expanded={isCreatorCardOpen}
              onMouseEnter={
                !isMobile ? () => setIsCreatorCardOpen(true) : undefined
              }
              onMouseLeave={
                !isMobile ? () => setIsCreatorCardOpen(false) : undefined
              }
              onFocus={!isMobile ? () => setIsCreatorCardOpen(true) : undefined}
              onBlur={!isMobile ? () => setIsCreatorCardOpen(false) : undefined}
              onClick={
                isMobile ? () => setIsCreatorCardOpen((v) => !v) : undefined
              }
              className="underline ml-[6px] cursor-pointer"
            >
              {selectedDocument.creator_name}
            </span>
          }{" "}
          <span className="ml-[6px]">
            {selectedDocument.published_date
              ? `on ${selectedDocument.published_date}`
              : ""}
          </span>
          {isCreatorCardOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-full max-w-[500px] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl p-4 z-50 flex items-start gap-6"
              onMouseEnter={
                !isMobile ? () => setIsCreatorCardOpen(true) : undefined
              }
              onMouseLeave={
                !isMobile ? () => setIsCreatorCardOpen(false) : undefined
              }
              role="dialog"
              aria-label="Coach details"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                {creatorPhoto ||
                  (creator &&
                    creator.detailed_profile &&
                    creator.detailed_profile.personal_info && (
                      <Avatar className="object-cover w-[80px] h-[80px] rounded-full">
                        <AvatarImage src={creatorPhoto || undefined} />
                        <AvatarFallback className="text-3xl bg-slate-300 ">
                          {creator.detailed_profile.personal_info.first_name !==
                            "" &&
                          creator.detailed_profile.personal_info.first_name !==
                            null &&
                          creator.detailed_profile.personal_info.last_name !==
                            null &&
                          creator.detailed_profile.personal_info.last_name !==
                            "" ? (
                            <div className="flex items-center">
                              <span>
                                {creator.detailed_profile.personal_info.first_name.slice(
                                  0,
                                  1
                                )}
                              </span>
                              <span>
                                {creator.detailed_profile.personal_info.last_name.slice(
                                  0,
                                  1
                                )}
                              </span>
                            </div>
                          ) : (
                            creator.basic_info.name.slice(0, 1)
                          )}
                        </AvatarFallback>
                      </Avatar>
                    ))}

                <div className="text-[18px] text-[#111827] font-semibold">
                  {creator?.basic_info.name}
                </div>
              </div>
              <div className="text-[16px] text-[#5F5F65] whitespace-pre-line w-full">
                Bio: <br />{" "}
                {(creator?.detailed_profile &&
                  creator?.detailed_profile.personal_info &&
                  creator.detailed_profile.personal_info.bio) ||
                  "No bio provided."}
              </div>
            </div>
          )}
        </div>
      )}
      {isLoadingDocument && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <MaterialIcon
            iconName="progress_activity"
            className="text-blue-600 animate-spin"
          />
          Please wait, we are loading the information...
        </div>
      )}
      <div className="flex flex-row w-full h-full gap-6 relative">
        <div className="hidden xl:block">
          <ChatActionsAdmin
            status={selectedDocument?.status || ""}
            setStatusPopup={setStatusPopup}
          />
        </div>

        {isLoadingSession ? (
          <ChatLoading />
        ) : (
          <div className={`relative flex flex-col w-full h-full xl:pr-4`}>
            {isLoadingDocument ? (
              <DocumentLoadingSkeleton />
            ) : selectedDocument ? (
              <div className="p-[24px] rounded-[16px] bg-white">
                <div className="prose-sm prose max-w-none">
                  {showTooltip && tooltipPosition && (
                    <div
                      className="fixed px-2 py-1 bg-white border border-blue-500 rounded-md"
                      style={{
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                      }}
                    >
                      <button
                        onClick={handleTooltipClick}
                        className="text-black text-[16px] font-semibold"
                      >
                        Ask Tolu
                      </button>
                    </div>
                  )}
                  {parse(selectedDocument.content)}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-red-500">
                Failed to load the document.
              </div>
            )}

            <div className="xl:hidden block mt-[16px] mb-[16px]">
              <ChatActionsAdmin
                status={selectedDocument?.status || ""}
                setStatusPopup={setStatusPopup}
              />
            </div>
          </div>
        )}
      </div>

      {statusPopup && (
        <ChangeAdminStatusPopup
          action={statusPopup}
          onClose={() => setStatusPopup(null)}
          onSave={onStatusChange}
        />
      )}
    </div>
  );
};
