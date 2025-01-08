/* eslint-disable react/prop-types */
import { useState } from "react";
import Mcq from "../../../components/questions/mcq/Mcq";
import Button from "../../../components/small/Button";
// import { questions } from "./questions";
import ConfirmAlert from "../../../components/small/ConfirmAlert";

const StepFour = ({ setCurrentStep }) => {
  const [isConfirmAlert, setIsConfirmAlert] = useState(false);

  const confirmToSaveAlert = () => {
    setIsConfirmAlert(!isConfirmAlert);
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* {questions.map((question, i) => (
          <section key={i} className="shadow-md rounded-lg p-4">
            <Mcq
              question={question.question}
              options={question.options}
              isRequired={question.isRequired}
            />
          </section>
        ))} */}
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
          <Button text="Submit" onClick={confirmToSaveAlert} />
          {/* <Button
            text="Next"
            onClick={() => {
              // setCurrentStep((prevStep) => prevStep + 1);
            }}
          /> */}
        </div>
      </div>
      {isConfirmAlert && (
        <ConfirmAlert
          title="Are You Sure?"
          message="You’re about to save your incomplete profile and move to the dashboard. Please note, without completing your profile, the AI might not provide accurate suggestions. If you want the best advice tailored to your needs, we highly recommend completing your profile first."
        >
          <div className="flex md:flex-row flex-col justify-end gap-4">
            <Button
              text="Save & Go to Dashboard"
              onClick={confirmToSaveAlert}
            />
            {/* <Button text="Complete Profile" onClick={confirmToSaveAlert} /> */}
          </div>
        </ConfirmAlert>
      )}
    </div>
  );
};

export default StepFour;
