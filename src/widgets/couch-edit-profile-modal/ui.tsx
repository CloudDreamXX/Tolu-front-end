import { useCallback, useState } from "react";
import ProfileCoach from "shared/assets/icons/profile-coach";
import { cn } from "shared/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from "shared/ui";
import { StepFocus } from "./components/StepFocus";
import { StepGeneral } from "./components/StepGeneral";
import { StepPractice } from "./components/StepPractice";
import { StepSafety } from "./components/StepSafety";
import { StepType } from "./components/StepType";
import { defaultData, ProfileData, steps } from "./helpers";

function StepBody({
  id,
  data,
  setData,
}: Readonly<{
  id: string;
  data: ProfileData;
  setData: (p: Partial<ProfileData>) => void;
}>) {
  switch (id) {
    case "general":
      return <StepGeneral data={data} setData={setData} />;
    case "safety":
      return <StepSafety />;
    case "practice":
      return <StepPractice />;
    case "type":
      return <StepType />;
    case "focus":
      return <StepFocus />;
    default:
      return null;
  }
}

type CouchEditProfileModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initial?: ProfileData;
};

export const CouchEditProfileModal = ({
  open,
  setOpen,
  initial = defaultData,
}: CouchEditProfileModalProps) => {
  const [step, setStep] = useState(0);
  const [dataState, setDataState] = useState<ProfileData>(initial);

  const setData = useCallback(
    (p: Partial<ProfileData>) => setDataState((prev) => ({ ...prev, ...p })),
    []
  );

  const next = () => {
    if (step === steps.length - 1) {
      setOpen(false);
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showMobileBack={false}
        className="bg-[#F9FAFB] p-0 rounded-none
      fixed inset-0 w-screen overflow-y-auto overscroll-contain
      md:bottom-auto md:top-1/2 md:left-1/2 md:right-auto 
      md:w-[min(800px,calc(100vw-64px))] 
      md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:overflow-visible
    "
      >
        <DialogHeader className="flex flex-col gap-6 p-6">
          <DialogTitle className="flex items-center gap-2">
            <ProfileCoach /> Edit profile
          </DialogTitle>
          <div className="flex items-center max-w-[310px] no-scrollbar gap-4 p-2 overflow-x-auto bg-white border rounded-full md:max-w-full">
            {steps.map((s, i) => (
              <button
                key={s.id}
                className={cn(
                  "py-2.5 px-4 font-bold text-sm text-nowrap",
                  s.id === steps[step].id
                    ? "bg-[#F2F4F6] border rounded-full"
                    : undefined
                )}
                onClick={() => setStep(i)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 md:flex hidden">
          <StepBody id={steps[step].id} data={dataState} setData={setData} />
        </ScrollArea>

        <div className="block px-6 md:hidden">
          <StepBody id={steps[step].id} data={dataState} setData={setData} />
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-1 p-4 md:pt-8 md:p-6">
          <Button variant="blue2" onClick={close} className="w-32">
            Cancel
          </Button>

          <Button variant="brightblue" onClick={next} className="w-32">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
