import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
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
  return (
    <div
      className={`flex gap-[24px] items-center h-[calc(100vh-125px)] md:h-[calc(100vh-145px)] xl:h-[calc(100vh-78px)] p-[16px]`}
    >
      <div className="hidden w-full h-full xl:block">
        <div className="flex-1 flex flex-col items-center justify-center mt-[200px]">
          <MaterialIcon
            iconName="category_search"
            size={150}
            className="mb-2"
          />
          <div className="text-center flex flex-col items-center justify-center gap-[8px]">
            <p className="text-[32px] font-[700] text-[#1D1D1F]">
              Select or Create a Topic
            </p>
            <p className="text-[20px] font-[500] text-[#5F5F65] max-w-[450px]">
              To get started, choose a topic from the library or use Tolu's AI
              assistant to create a new one.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <LibrarySmallChat isCoach isDraft />
      </div>
    </div>
  );
};
