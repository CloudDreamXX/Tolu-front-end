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

export const Library = () => {
  const dispatch = useDispatch();
  const healthHistory = useSelector(
    (state: RootState) => state.healthHistory.data
  );

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
  }, [dispatch]);

  return (
    <main className="flex flex-col h-full items-start gap-6 p-6 self-stretch overflow-y-auto bg-[#F2F4F6]">
      <div className="flex flex-col flex-1 w-full h-full min-h-0 gap-6 xl:flex-row">
        <LibraryClientContent />
        <div className="hidden xl:block">
          <LibrarySmallChat healthHistory={healthHistory} />
        </div>
      </div>
    </main>
  );
};
