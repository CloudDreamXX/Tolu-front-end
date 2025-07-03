import {
  MenopauseSubmissionRequest,
  Recommendation,
  Symptom,
  UserService,
} from "entities/user";
import { useEffect, useState } from "react";
import { LibraryClientContent } from "widgets/library-client-content";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { MultiStepModal, SymptomCheckModal } from "widgets/MenopauseModals";
import { SystemCheck } from "./system-check";

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
    setStepModalOpen(false);
    setCompletionModalOpen(true);
    setShowResults(true);

    try {
      const data = await UserService.getMenopauseRecommendations();
      setRecommendations(data.content);
    } catch (error) {
      console.error("Failed to load recommendations", error);
    }
  };

  return (
    <main className="flex flex-col h-full items-start gap-6 p-6 self-stretch overflow-y-auto bg-[#F2F4F6]">
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
        />
      )}

      <SymptomCheckModal
        isOpen={completionModalOpen}
        onStepModalOpen={() => setCompletionModalOpen(false)}
        onClose={() => setCompletionModalOpen(false)}
        variant="completion"
      />
      <div className="flex flex-col flex-1 w-full h-full min-h-0 gap-6 xl:flex-row">
        <LibraryClientContent />
        <LibrarySmallChat />
      </div>
    </main>
  );
};
