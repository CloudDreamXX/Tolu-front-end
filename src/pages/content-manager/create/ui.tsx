import { RootState } from "entities/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/ui";
import { EmptyStateTolu } from "widgets/empty-state-tolu";
import { LibrarySmallChat } from "widgets/library-small-chat";
import z from "zod";

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
  const activeChatKey = useSelector(
    (state: RootState) => state.client.activeChatKey
  );

  return (
    <div
      className={`flex gap-[24px] items-center h-[calc(100vh-125px)] md:h-[calc(100vh-145px)] xl:h-[calc(100vh-78px)] p-[16px]`}
    >
      <div className="hidden w-full h-full xl:block">
        <EmptyStateTolu
          text="To deep research a knowledge source upload files to your File Library and ask Tolu to conduct a research or create an inspired content."
          footer={
            <div className="flex gap-4">
              <Button
                variant="brightblue"
                className="min-w-40"
                onClick={() => navigate("/content-manager/files")}
              >
                {activeChatKey === "Research"
                  ? "Upload Files"
                  : "Create a folder"}
              </Button>
            </div>
          }
        />
      </div>
      <div className="w-full h-full">
        <LibrarySmallChat isCoach isDraft />
      </div>
    </div>
  );
};
