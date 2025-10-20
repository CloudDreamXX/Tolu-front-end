import { RootState } from "entities/store";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "shared/ui";
import { EmptyStateTolu } from "widgets/empty-state-tolu";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { CreateSubfolderPopup } from "widgets/CreateSubfolderPopup";
import z from "zod";
import { useEffect, useState } from "react";
import {
  useGetFoldersQuery,
  useCreateFolderMutation,
} from "entities/folder/api";
import { toast } from "shared/lib/hooks/use-toast";
import { setFolders } from "entities/folder";
import { AboutYourPractice } from "widgets/OnboardingPractitioner/about-your-practice";
import { ProfileSetup } from "widgets/OnboardingPractitioner/profile-setup";
import { OnboardingMain } from "widgets/OnboardingPractitioner/onboarding-main";
import { SelectType } from "widgets/OnboardingPractitioner/select-type";

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

  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [createPopup, setCreatePopup] = useState(false);

  const { data: folderResponse, refetch } = useGetFoldersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createFolderMutation] = useCreateFolderMutation();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (
      location.state &&
      location.state.incompleteRoute &&
      location.state.incompleteRoute.length > 0
    ) {
      setShowPopup(true);
    }
  }, [location.state]);

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

  const renderIncompletePage = () => {
    switch (location.state?.incompleteRoute) {
      case "/profile-setup":
        return <ProfileSetup />;
      case "/select-type":
        return <SelectType />;
      case "/onboarding-welcome":
        return <OnboardingMain />;
      case "/about-your-practice":
        return <AboutYourPractice />;
      default:
        return <SelectType />;
    }
  };

  return (
    <div
      className={`flex gap-[24px] items-center h-[calc(100vh-125px)] md:h-[calc(100vh-145px)] xl:h-[calc(100vh-78px)] p-[16px]`}
    >
      <div className="hidden w-full h-full xl:block">
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

      <div className="w-full h-full">
        <LibrarySmallChat isCoach isDraft />
      </div>

      {location.state?.incompleteRoute && showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div
            className="rounded-2xl shadow-xl max-h-[90%] mx-[16px] md:p-8 overflow-y-auto"
            style={{
              background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
            }}
          >
            {renderIncompletePage()}
          </div>
        </div>
      )}

      {createPopup && (
        <CreateSubfolderPopup
          onClose={() => setCreatePopup(false)}
          onComplete={createFolder}
        />
      )}
    </div>
  );
};
