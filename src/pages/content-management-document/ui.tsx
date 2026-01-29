import { useGetDocumentByIdQuery } from "entities/document";
import { ChatLoading } from "features/chat";
import { useTextSelectionTooltip } from "pages/content-manager/document/lib";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, usePageWidth } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage, Button } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { DocumentLoadingSkeleton } from "pages/library-document/lib";
import { ChatActionsAdmin } from "features/chat/ui/chat-actions-admin/ui";
import { ChangeAdminStatusPopup } from "widgets/change-admin-status-popup";
import { ManageContentData, useManageContentMutation } from "entities/admin";
import {
  useGetCreatorProfileQuery,
  useGetCreatorPhotoQuery,
} from "entities/content";

const extractScripts = (content: string) => {
  const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/g;
  const scripts: string[] = [];
  let match;

  while ((match = scriptRegex.exec(content)) !== null) {
    scripts.push(match[1]);
  }

  const contentWithoutScripts = content.replace(scriptRegex, "");

  return { contentWithoutScripts, scripts };
};

export const ContentManagementDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [isLoadingSession] = useState(false);
  const [creatorPhoto, setCreatorPhoto] = useState<string | null>(null);
  const [isCreatorCardOpen, setIsCreatorCardOpen] = useState(false);
  const [statusPopup, setStatusPopup] = useState<
    "approve" | "reject" | "unpublish" | null
  >(null);

  const {
    data: selectedDocument,
    isLoading: isLoadingDocument,
    refetch,
  } = useGetDocumentByIdQuery(documentId!);
  console.log(documentId)
  const { data: creator } = useGetCreatorProfileQuery(
    selectedDocument?.creator_id || ""
  );
  const { data: creatorPhotoBlob } = useGetCreatorPhotoQuery(
    {
      id: creator?.creator_id || "",
      filename:
        creator?.detailed_profile?.personal_info?.headshot_url
          ?.split("/")
          .pop() || "",
    },
    { skip: !creator?.creator_id }
  );
  const [renderedContent, setRenderedContent] = useState<JSX.Element | null>(
    null
  );
  const [scripts, setScripts] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDocument) {
      const { contentWithoutScripts, scripts } = extractScripts(
        selectedDocument.content
      );
      setRenderedContent(
        <div dangerouslySetInnerHTML={{ __html: contentWithoutScripts }} />
      );
      setScripts(scripts);
    }
  }, [selectedDocument]);

  useEffect(() => {
    scripts.forEach((scriptContent) => {
      const script = document.createElement("script");
      script.innerHTML = scriptContent;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    });
  }, [scripts]);

  useEffect(() => {
    if (creatorPhotoBlob) {
      const objectUrl = URL.createObjectURL(creatorPhotoBlob);
      setCreatorPhoto(objectUrl);
    }
  }, [creatorPhotoBlob]);

  const [manageContent] = useManageContentMutation();

  const { tooltipPosition, showTooltip, handleTooltipClick } =
    useTextSelectionTooltip();
  const { isMobile } = usePageWidth();

  const onStatusChange = async (comment?: string, reason?: string) => {
    try {
      const payload: ManageContentData = {
        content_id: documentId || "",
        action: statusPopup ? statusPopup : "reject",
        admin_comment: comment?.trim() || undefined,
        unpublish_reason:
          statusPopup === "unpublish" ? reason?.trim() : undefined,
      };

      await manageContent(payload);
      refetch();
      toast({
        title: "Status changed successfully",
      });
      setStatusPopup(null);
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
                {creator &&
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
                  )}

                <div className="text-[18px] text-[#111827] text-center font-semibold">
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
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <MaterialIcon
              iconName="progress_activity"
              className="text-blue-600 animate-spin"
            />
          </span>
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
                      <Button
                        variant={"unstyled"}
                        size={"unstyled"}
                        onClick={handleTooltipClick}
                        className="text-black text-[16px] font-semibold"
                      >
                        Ask Tolu
                      </Button>
                    </div>
                  )}
                  {renderedContent}
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
