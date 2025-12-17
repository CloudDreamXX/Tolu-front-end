import { useEffect, useState } from "react";
import { LibraryClientContent } from "widgets/library-client-content";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setHealthHistory,
  setLoading,
} from "entities/health-history/lib";
import { RootState } from "entities/store";
import { ChatSocketService } from "entities/chat";
import { toast, usePageWidth } from "shared/lib";
import { clearChatHistoryExceptActive } from "entities/client/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { useGetUserHealthHistoryQuery } from "entities/health-history";
import { useLocation } from "react-router-dom";
import { DemographicStep } from "widgets/OnboardingClient/DemographicStep";
import { ResizableLibraryChat } from "widgets/library-small-chat/components/ResizableSmallChat";
import {
  useAcceptCoachInviteMutation,
  useGetPendingInvitationsQuery,
} from "entities/client";
import { AcceptInviteBanner } from "./AcceptInviteBanner";

export const Library = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [widthPercent, setWidthPercent] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const { isMobileOrTablet } = usePageWidth();
  const [acceptInvitePopup, setAcceptInvitePopup] = useState<boolean>(false);
  const [acceptCoachInvite] = useAcceptCoachInviteMutation();
  const { data: invitations } = useGetPendingInvitationsQuery();

  const loading = useSelector((state: RootState) => state.client.loading);

  const {
    data: healthHistory,
    error,
    isLoading,
  } = useGetUserHealthHistoryQuery();

  useEffect(() => {
    if (location.state && location.state.incomplete) {
      setShowPopup(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup]);

  useEffect(() => {
    if (invitations && invitations.invitations.length) {
      setAcceptInvitePopup(true);
    }
  }, [invitations]);

  useEffect(() => {
    const handleCoachInvitation = (payload: any) => {
      toast({
        title: payload.title || "New coach invitation",
        description: payload.message,
        variant: "default",
      });

      setAcceptInvitePopup(true);
    };

    ChatSocketService.on("coach_invitation", handleCoachInvitation);

    return () => {
      ChatSocketService.off("coach_invitation", handleCoachInvitation);
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (
        message.notification.type === "content_share" ||
        message.notification.type === "message"
      ) {
        toast({
          title: message.notification.title,
          description: message.notification.message,
        });
      }
    };

    ChatSocketService.on("notification", (message: any) =>
      handleNewMessage(message)
    );

    return () => {
      ChatSocketService.off("notification", (message: any) =>
        handleNewMessage(message)
      );
    };
  }, []);

  useEffect(() => {
    if (healthHistory) {
      dispatch(setHealthHistory(healthHistory));
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setError("Failed to load user health history"));
      console.error("Health history fetch error:", error);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearChatHistoryExceptActive());
    };
  }, [dispatch]);

  const handleConfirmAcceptInvite = async () => {
    try {
      if (invitations?.invitations[0].invitation_token) {
        await acceptCoachInvite({ token: invitations.invitations[0].invitation_token }).unwrap();
        setAcceptInvitePopup(false);
        toast({
          title: "Invitation accepted successfully",
        });
      }
    } catch (acceptErr) {
      console.error(acceptErr);
      toast({
        title: "Unable to accept invite",
        description: "Please try again or request a new link.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDeclineInvite = async () => {
    try {

    } catch (err) {
      console.error(err)
      toast({
        title: "Unable to decline invite",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }

  return (
    <main className="flex flex-col h-screen items-start gap-6 p-4 md:p-6 xl:p-0 self-stretch overflow-y-auto bg-[#F2F4F6]">
      {acceptInvitePopup && invitations?.invitations?.length > 0 && (
        <div className="xl:pt-[24px] xl:px-[24px] w-full">
          <AcceptInviteBanner
            coachName={invitations.invitations[0].coach_name}
            onCancelConfirmed={handleConfirmDeclineInvite}
            onAccept={handleConfirmAcceptInvite}
          />
        </div>
      )}
      {loading && (
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
      {location.state?.incomplete && showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="rounded-2xl shadow-xl mx-[16px] md:mx-[24px] lg:p-8 lg:pt-0 overflow-y-auto bg-white relative">
            <div
              className="absolute top-[20px] right-[20px] z-50 cursor-pointer"
              onClick={() => setShowPopup(false)}
            >
              <MaterialIcon iconName="close" />
            </div>
            <DemographicStep />
          </div>
        </div>
      )}
      <div
        className={`flex flex-col flex-1 w-full h-full min-h-0 gap-6 xl:flex-row ${!isResizing ? "transition-[width] duration-300 ease-in-out" : ""}`}
      >
        <div
          className="xl:p-6 xl:pr-0 w-full h-full"
          style={{
            width: isMobileOrTablet || window.innerWidth < 1280 ? "100%" : `${100 - widthPercent}%`,
          }}
        >
          <LibraryClientContent />
        </div>
        <ResizableLibraryChat
          widthPercent={widthPercent}
          setWidthPercent={setWidthPercent}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={() => setIsResizing(false)}
        />
      </div>
    </main>
  );
};
