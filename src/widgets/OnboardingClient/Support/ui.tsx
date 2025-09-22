import { setFormField } from "entities/store/clientOnboardingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Checkbox } from "shared/ui";
import { BottomButtons } from "widgets/BottomButtons";
import { OnboardingClientLayout } from "../Layout";
import { checkboxes } from "./utils";
import { RootState } from "entities/store";
import { UserService } from "entities/user";

export const Support = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const selectedSupport = clientOnboarding.support_network || [];

  const handleInputChange = (value: string, checked: boolean) => {
    if (checked) {
      dispatch(
        setFormField({
          field: "support_network",
          value: [...selectedSupport, value],
        })
      );
    } else {
      dispatch(
        setFormField({
          field: "support_network",
          value: selectedSupport.filter((v) => v !== value),
        })
      );
    }
  };

  const handleNext = async () => {
    const finalSupport = [...selectedSupport];

    const updated = {
      ...clientOnboarding,
      support_network: finalSupport,
    };

    dispatch(setFormField({ field: "support_network", value: finalSupport }));

    await UserService.onboardClient(updated, token);
    nav("/personality-type");
  };

  const isFilled = () => selectedSupport.length > 0;

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      Support Network
    </h1>
  );

  const mainContent = (
    <>
      <h3 className=" text-[18px] font-bold text-[#1D1D1F]">
        Who do you currently rely on for support (if anyone)?
      </h3>

      {checkboxes
        .reduce((rows, _, index) => {
          if (index % 2 === 0) rows.push(checkboxes.slice(index, index + 2));
          return rows;
        }, [] as string[][])
        .map((rowItems, rowIndex) => (
          <div key={rowIndex} className="flex flex-col w-full gap-6">
            {rowItems.map((item, i) => (
              <div key={i} className="flex items-center flex-1 gap-4">
                <Checkbox
                  onCheckedChange={(checked) =>
                    handleInputChange(item, checked === true)
                  }
                  value={item}
                  checked={selectedSupport.includes(item)}
                  className="w-6 h-6 rounded-lg"
                />
                <p className=" text-[16px] font-medium text-[#1D1D1F]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        ))}
    </>
  );

  return (
    <OnboardingClientLayout
      currentStep={4}
      numberOfSteps={8}
      title={title}
      children={mainContent}
      buttons={
        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/personality-type")}
          isButtonActive={isFilled}
        />
      }
    />
  );
};
