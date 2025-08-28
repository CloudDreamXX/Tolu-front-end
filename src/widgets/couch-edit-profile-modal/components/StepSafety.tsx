import { useEffect, useState } from "react";
import {
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "shared/ui";
import { RECOVERY_QUESTIONS } from "../helpers";
import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";

type StepSafetyProps = {
  data: CoachOnboardingState;
  setDataState: React.Dispatch<React.SetStateAction<CoachOnboardingState>>;
};

export function StepSafety({ data, setDataState }: StepSafetyProps) {
  const [twoFA, setTwoFA] = useState(data.two_factor_enabled || false);
  const [twoFAMethod, setTwoFAMethod] = useState(data.two_factor_method || "");
  const [question, setQuestion] = useState(data.security_questions || "");
  const [answer, setAnswer] = useState(data.security_answers || "");

  useEffect(() => {
    setDataState((prevState) => ({
      ...prevState,
      two_factor_enabled: twoFA,
      two_factor_method: twoFAMethod,
      security_questions: question,
      security_answers: answer,
    }));
  }, [twoFA, question, answer]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h4 className="text-[#1D1D1F] font-semibold">
          Two-factor authentication
        </h4>
        <div className="flex items-center gap-3 mt-2">
          <Switch checked={twoFA} onCheckedChange={setTwoFA} />
          Enable two-factor authentication
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Choose method:</label>
        <RadioGroup
          className="flex flex-wrap gap-10"
          value={twoFAMethod}
          onValueChange={(value) => setTwoFAMethod(value)}
          disabled={!twoFA}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sms" />
            <span>SMS</span>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="authenticator" />
            <span>Authenticator App</span>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" />
            <span>Email</span>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <label>Set recovery question</label>
          <Select value={question} onValueChange={(v) => setQuestion(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a question" />
            </SelectTrigger>
            <SelectContent>
              {RECOVERY_QUESTIONS.map((q) => (
                <SelectItem key={q} value={q}>
                  {q}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2.5">
          <label>Answer the questions for recovery</label>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
