import { useEffect, useState } from "react";
import { LibraryClientContent } from "widgets/library-client-content";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setHealthHistory,
  setLoading,
} from "entities/health-history/lib";
import { RootState } from "entities/store";
import { ChatSocketService } from "entities/chat";
import { toast } from "shared/lib";
import { clearChatHistoryExceptActive } from "entities/client/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { useGetUserHealthHistoryQuery } from "entities/health-history";
import { useLocation } from "react-router-dom";
import { DemographicStep } from "widgets/OnboardingClient/DemographicStep";

export const Library = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

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

  return (
    <main className="flex flex-col h-screen items-start gap-6 p-4 md:p-6 self-stretch overflow-y-auto bg-[#F2F4F6]">
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
          <div className="rounded-2xl shadow-xl mx-[16px] md:mx-[24px] lg:p-8 lg:pt-0 overflow-y-auto bg-white">
            <DemographicStep />
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 w-full h-full min-h-0 gap-6 xl:flex-row">
        <LibraryClientContent />
        <div className="hidden w-full xl:block">
          <LibrarySmallChat />
        </div>
      </div>
    </main>
  );
};
