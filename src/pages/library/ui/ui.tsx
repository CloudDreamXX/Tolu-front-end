import { useState, useEffect } from "react";
import {
  MenopauseSubmissionRequest,
  Recommendation,
  Symptom,
  UserService,
} from "entities/user";
import { toast } from "shared/lib/hooks/use-toast";
import { SystemCheck } from "./system-check";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { LibraryClientContent } from "widgets/library-client-content";
import { MultiStepModal, SymptomCheckModal } from "widgets/MenopauseModals";

export const Library = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const data = await UserService.getMenopauseSymptoms();
        setSymptoms(data.Symptoms);
      } catch (error) {
        console.error("Failed to load steps", error);
        toast({
          variant: "destructive",
          title: "Failed to load steps",
          description: "Failed to load steps. Please try again.",
        });
      }
    };

    fetchSteps();
  }, []);

  const handleStartCheckIn = () => {
    setModalOpen(false);
    setStepModalOpen(true);
  };

  const handleFinishCheckIn = async (results: MenopauseSubmissionRequest) => {
    await UserService.submitMenopauseResults(results);
    const data = await UserService.getMenopauseRecommendations();

    setRecommendations(data.content);

    setStepModalOpen(false);
    setCompletionModalOpen(true);
    setShowResults(true);
  };

  return (
    <main className="flex flex-col h-full items-start gap-6 p-6 self-stretch overflow-y-auto bg-[#F1F3F5]">
      <SystemCheck
        showResults={showResults}
        setModalOpen={setModalOpen}
        recommendations={recommendations}
      />
      <SymptomCheckModal
        isOpen={modalOpen}
        onStepModalOpen={handleStartCheckIn}
        onClose={() => setModalOpen(false)}
        variant="intro"
      />

      {symptoms && (
        <MultiStepModal
          isOpen={stepModalOpen}
          onClose={() => setStepModalOpen(false)}
          onComplete={handleFinishCheckIn}
          symptoms={symptoms}
        />
      )}

      <SymptomCheckModal
        isOpen={completionModalOpen}
        onStepModalOpen={() => setCompletionModalOpen(false)}
        onClose={() => setCompletionModalOpen(false)}
        variant="completion"
      />
      <div className="flex flex-row w-full h-full gap-6">
        <LibraryClientContent />
        <LibrarySmallChat />
      </div>
    </main>
  );
};
