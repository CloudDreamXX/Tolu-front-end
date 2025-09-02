import { useEffect } from "react";
import { LibraryClientContent } from "widgets/library-client-content";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { HealthHistoryService } from "entities/health-history";
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

export const Library = () => {
  const dispatch = useDispatch();
  const healthHistory = useSelector(
    (state: RootState) => state.healthHistory.data
  );
  const loading = useSelector((state: RootState) => state.client.loading);

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
    const fetchHealthHistory = async () => {
      try {
        dispatch(setLoading(true));
        const data = await HealthHistoryService.getUserHealthHistory();
        dispatch(setHealthHistory(data));
      } catch (error: any) {
        dispatch(setError("Failed to load user health history"));
        console.error("Health history fetch error:", error);
      }
    };

    fetchHealthHistory();

    return () => {
      dispatch(clearChatHistoryExceptActive());
    };
  }, [dispatch]);

  return (
    <main className="flex flex-col h-screen items-start gap-6 p-4 md:p-6 self-stretch overflow-y-auto bg-[#F2F4F6]">
      {loading && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <MaterialIcon
            iconName="progress_activity"
            className="text-blue-600 animate-spin"
          />
          Please wait, we are loading the information...
        </div>
      )}
      <div className="flex flex-col flex-1 w-full h-full min-h-0 gap-6 xl:flex-row">
        <LibraryClientContent healthHistory={healthHistory} />
        <div className="hidden w-full xl:block">
          <LibrarySmallChat />
        </div>
      </div>
    </main>
  );
};
