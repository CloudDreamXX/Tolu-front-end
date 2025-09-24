import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { UserService } from "entities/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Checkbox, Input } from "shared/ui";
import { BottomButtons } from "widgets/BottomButtons";
import { OnboardingClientLayout } from "../Layout";
import { checkboxes } from "./utils";

export const Values = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const selectedValues = clientOnboarding.important_values || [];
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const values = clientOnboarding.important_values || [];

    const custom = values.find((v) => !checkboxes.includes(v));

    if (custom) {
      setInputValue(custom);

      const updatedValues = values.map((v) =>
        !checkboxes.includes(v) ? "Other" : v
      );

      dispatch(
        setFormField({
          field: "important_values",
          value: updatedValues,
        })
      );
    }
  }, [clientOnboarding.important_values, dispatch]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    let updated = [...selectedValues];
    if (checked && updated.length < 3) {
      updated.push(value);
    } else if (!checked) {
      updated = updated.filter((v) => v !== value);
    }
    dispatch(setFormField({ field: "important_values", value: updated }));
  };

  const handleNext = async () => {
    let finalValues = [...selectedValues];
    if (finalValues.includes("Other") && inputValue.trim()) {
      finalValues = finalValues.map((v) =>
        v === "Other" ? inputValue.trim() : v
      );
    }

    const updated = {
      ...clientOnboarding,
      important_values: finalValues,
    };

    dispatch(setFormField({ field: "important_values", value: finalValues }));

    await UserService.onboardClient(updated, token);
    nav("/barriers");
  };

  const isFilled = () => selectedValues.length > 0 || inputValue.trim() !== "";

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      Values & Inner Drivers
    </h1>
  );

  const mainContent = (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-[18px] font-bold text-[#1D1D1F]">
          What values are most important to you right now?
        </h3>
        <div className="flex items-center justify-between w-full">
          <p className="text-[#1D1D1F] text-[16px] font-medium">
            Please choose up to 3.
          </p>
          <p className="text-[#1D1D1F] text-[16px] font-bold">
            {selectedValues.length}/
            <span className="text-[12px] font-normal text-[#B3BCC8]">3</span>
          </p>
        </div>
      </div>

      {checkboxes
        .reduce((rows, _, index) => {
          if (index % 2 === 0) rows.push(checkboxes.slice(index, index + 2));
          return rows;
        }, [] as string[][])
        .map((rowItems, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-col w-full gap-6 md:flex-row md:items-center"
          >
            {rowItems.map((item, i) => (
              <div key={i} className="flex items-center flex-1 gap-4">
                <Checkbox
                  checked={selectedValues.includes(item)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(item, checked === true)
                  }
                  disabled={
                    !selectedValues.includes(item) && selectedValues.length >= 3
                  }
                  className="w-6 h-6 rounded-lg"
                />
                <p className="text-[16px] font-medium text-[#1D1D1F]">{item}</p>
              </div>
            ))}
          </div>
        ))}

      {selectedValues.includes("Other") && (
        <div className="flex flex-col gap-[10px] w-full items-start">
          <label className="text-[16px] font-medium text-[#1D1D1F]">
            Say it in your own words
          </label>
          <Input
            className="w-full"
            placeholder="Other"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      )}
    </div>
  );

  return (
    <OnboardingClientLayout
      currentStep={2}
      numberOfSteps={8}
      title={title}
      children={mainContent}
      buttons={
        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/barriers")}
          isButtonActive={isFilled}
        />
      }
    />
  );
};
