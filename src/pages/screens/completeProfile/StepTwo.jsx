/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Mcq from "../../../components/questions/mcq/Mcq";
import Button from "../../../components/small/Button";
import { stepTwoQuestions } from "./questions";
import IncompleteProfileMessage from "./IncompleteProfileMessage";
import Question from "../../../components/questions/mcq/Question";

const StepTwo = ({ setCurrentStep }) => {
  const [isConfirmAlert, setIsConfirmAlert] = useState(false);
  const [answers, setAnswers] = useState(() => {
    return stepTwoQuestions.reduce((acc, question, index) => {
      acc[index] = "";
      return acc;
    }, {});
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: value,
    }));
  };

  useEffect(() => {
    const allRequiredFilled = stepTwoQuestions.every((question, index) => {
      if (question.isRequired) {
        return answers[index]?.trim().length > 0;
      }
      return true;
    });
    setIsFormValid(allRequiredFilled);
  }, [answers]);

  const handleSubmit = () => {
    setCurrentStep((prevStep) => prevStep + 1);
    console.log(answers);
  };

  const confirmToSaveAlert = () => {
    setIsConfirmAlert(!isConfirmAlert);
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {stepTwoQuestions.map((question, i) => (
          <section key={i} className="shadow-md rounded-lg p-4">
            {question?.questionType === "text" ? (
              <Question
                label={question.question}
                placeholder={question?.placeholder}
                style="block font-bold text-lg leading-5 sm:leading-7 mb-2"
                isRequired={question?.isRequired}
                value={answers[i]}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
                type={question.type || "text"}
              />
            ) : (
              <Mcq
                question={question?.question}
                options={question?.options}
                isRequired={question?.isRequired}
                name={`mcq-${i}`}
                selectedValue={answers[i]}
                onChange={(value) => handleAnswerChange(i, value)}
              />
            )}
          </section>
        ))}
      </div>
      <div className="flex justify-between">
        <div>
          <Button
            text="Back"
            bg="bg-[#8F9AA1] border-none text-white hover:bg-[#8F9AA195]"
            onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            text="Save & Exit"
            onClick={confirmToSaveAlert}
            disabled={!isFormValid}
          />
          <Button text="Next" onClick={handleSubmit} disabled={!isFormValid} />
        </div>
      </div>
      {isConfirmAlert && (
        <IncompleteProfileMessage
          percentage={50}
          title="Your Profile Is Incomplete!"
          message="To get better results and maximize your experience, please complete your profile. A complete profile helps us provide tailored recommendations and connect you with the right opportunities."
        >
          <div className="flex md:flex-row flex-col  justify-end gap-4">
            <Button text="Remind Me Later" />
            <Button text="Complete Profile Now" onClick={confirmToSaveAlert} />
          </div>
        </IncompleteProfileMessage>
      )}
    </div>
  );
};

export default StepTwo;
