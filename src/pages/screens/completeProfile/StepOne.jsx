import axios from "axios";

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Mcq from "../../../components/questions/mcq/Mcq";
import Question from "../../../components/questions/mcq/Question";
import Button from "../../../components/small/Button";
import { stepOneQuestions } from "./questions";
import IncompleteProfileMessage from "./IncompleteProfileMessage";

const StepOne = ({ setCurrentStep }) => {
  const [isConfirmAlert, setIsConfirmAlert] = useState(false);

  const [answers, setAnswers] = useState(() => {
    return stepOneQuestions.reduce((acc, question, index) => {
      acc[index] = "";
      return acc;
    }, {});
  });

  const confirmToSaveAlert = () => {
    setIsConfirmAlert(!isConfirmAlert);
  };
  const [isFormValid, setIsFormValid] = useState(false);

  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: value,
    }));
  };

  useEffect(() => {
    const allRequiredFilled = stepOneQuestions.every((question, index) => {
      if (question.isRequired) {
        return answers[index]?.trim().length > 0;
      }
      return true;
    });
    setIsFormValid(allRequiredFilled);
  }, [answers]);

  const handleSubmit = async () => {
    try {
      const payload = {
        date_of_birth: answers[0],
        birth_gender: answers[1],
        current_gender: answers[2],
        pronouns: answers[3],
        heritage: answers[4],
        primary_language: answers[5],
        partner_pronouns: answers[6],
        partner_status: answers[7] === "Yes" ? "Has partner" : "No partner",
        blood_type: answers[8] || null,
        children_details: answers[9],
        height_and_weight: answers[10] || null,
      };

      const response = await axios.post(
        "https://search.vitai.health:8000/personal-information",
        payload
      );

      console.log("Data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error.response || error.message);
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {stepOneQuestions.map((question, i) => (
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
      <div className="flex justify-end gap-2">
        <Button
          text="Save & Exit"
          onClick={confirmToSaveAlert}
          disabled={!isFormValid}
        />
        <Button text="Next" onClick={handleSubmit} disabled={!isFormValid} />
      </div>
      {isConfirmAlert && (
        <IncompleteProfileMessage
          percentage={25}
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

export default StepOne;
