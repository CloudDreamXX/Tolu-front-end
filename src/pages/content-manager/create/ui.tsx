import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/ui";
import { EmptyStateTolu } from "widgets/empty-state-tolu";
import { CreateSubfolderPopup } from "widgets/CreateSubfolderPopup";
import {
  useGetFoldersQuery,
  useCreateFolderMutation,
} from "entities/folder/api";
import { setFolders } from "entities/folder";
import { toast } from "shared/lib/hooks/use-toast";
import { RootState } from "entities/store";
import z from "zod";
import { ResizableLibraryChat } from "widgets/library-small-chat/components/ResizableSmallChat";
import { usePageWidth } from "shared/lib";

export const caseBaseSchema = z.object({
  age: z
    .string()
    .min(1, "Age is required")
    .regex(/^\d+$/, "Age must be a number"),
  employmentStatus: z.string().min(1, "Employment status is required"),
  menopausePhase: z.string().min(1, "Menopause phase is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  diagnosedConditions: z.string().optional(),
  medication: z.string().optional(),
  lifestyleFactors: z.string().optional(),
  previousInterventions: z.string().optional(),
  interventionOutcome: z.string().optional(),
  suspectedRootCauses: z.string().optional(),
  protocol: z.string().min(1, "Protocol is required"),
  goal: z.string().min(1, "Goal is required"),
});

export const ContentManagerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeChatKey = useSelector(
    (state: RootState) => state.client.activeChatKey
  );

  const [widthPercent, setWidthPercent] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [createPopup, setCreatePopup] = useState(false);

  const { data: folderResponse, refetch } = useGetFoldersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createFolderMutation] = useCreateFolderMutation();
  const { isMobileOrTablet } = usePageWidth();

  useEffect(() => {
    if (folderResponse && folderResponse.folders.length > 0) {
      const firstFolder =
        folderResponse.folders[1] ?? folderResponse.folders[0];
      dispatch(setFolders(folderResponse));
      if (firstFolder.subfolders) {
        setParentFolderId(firstFolder.id);
      }
    }
  }, [folderResponse, dispatch]);

  const createFolder = async (name: string, description: string) => {
    if (!parentFolderId) return;
    try {
      await createFolderMutation({
        name,
        description,
        parent_folder_id: parentFolderId,
      }).unwrap();

      toast({ title: "Created successfully" });
      setCreatePopup(false);
      await refetch();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast({
        variant: "destructive",
        title: "Failed to create folder",
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center h-[calc(100vh-125px)] md:h-[calc(100vh-145px)] xl:h-screen overflow-hidden">
      <div
        className={`hidden xl:flex h-full p-[16px] flex-none ${!isResizing ? "transition-[width] duration-300 ease-in-out" : ""
          }`}
        style={{ width: isMobileOrTablet ? "100%" : `${100 - widthPercent}%` }}
      >
        <EmptyStateTolu
          text={
            activeChatKey === "Research"
              ? "To deep research a knowledge source upload files to your File Library and ask Tolu to conduct a research or create an inspired content."
              : "To get started with content creation, select or create a folder for giving instructions to your AI assistant."
          }
          footer={
            <div className="flex gap-4">
              {activeChatKey === "Research" ? (
                <Button
                  variant="brightblue"
                  className="min-w-40"
                  onClick={() => navigate("/content-manager/files")}
                >
                  Upload Files
                </Button>
              ) : (
                <Button
                  variant="brightblue"
                  className="min-w-40"
                  onClick={() => setCreatePopup(true)}
                >
                  Create a folder
                </Button>
              )}
            </div>
          }
        />
      </div>

      <ResizableLibraryChat
        widthPercent={widthPercent}
        setWidthPercent={setWidthPercent}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
        isCoach
      />

      {createPopup && (
        <CreateSubfolderPopup
          onClose={() => setCreatePopup(false)}
          onComplete={createFolder}
        />
      )}
    </div>
  );
};
