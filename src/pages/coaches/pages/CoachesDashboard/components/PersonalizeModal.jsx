/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Dropdown from "../../../../../components/small/Dropdown";
import Input from "../../../../../components/small/Input";
import { IoCheckmarkCircle } from "react-icons/io5";
import Button from "../../../../../components/small/Button";
import {
  useCreateHealthHistoryMutation,
  useGetHealthHistoryQuery,
} from "../../../../../redux/apis/apiSlice";
import toast from "react-hot-toast";

const PersonalizeModal = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height_weight: "",
    current_health_concerns: [],
    diagnosed_conditions: [],
    medications: [],
    supplements: [],
    allergies_intolerances: [],
    family_health_history: [],
    specific_diet: [],
    exercise_habits: "",
    sleep_quality: "",
    stress_levels: "",
    energy_levels: "",
    menstrual_cycle_status: "",
    hormone_replacement_therapy: "",
    fertility_concerns: "",
    birth_control_use: "",
    blood_sugar_concerns: "",
    digestive_issues: "",
    recent_lab_tests: "",
    health_goals: "",
    desired_results_timeline: "",
    health_approach_preference: "",
  });

  const { data, isLoading: isLoadingHealth } = useGetHealthHistoryQuery();
  const [createHealth, { isLoading }] = useCreateHealthHistoryMutation();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.age) return "Age is required.";
    if (!formData.gender) return "Gender is required.";
    if (!formData.health_goals) return "Health goals are required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    const dataToSend = new FormData();
    dataToSend.append("health_data", JSON.stringify(formData));
    // dataToSend.append('lab_file', labFile)
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    try {
      await createHealth(dataToSend).unwrap();
      toast.success("Health history saved successfully!");
    } catch (error) {
      toast.error("Submission failed. Please try again");
      console.log("error while submitting form", error);
    }
  };

  useEffect(() => {
    if (data?.health_history !== null) {
      setFormData({
        age: data?.health_history?.age || "",
        gender: data?.health_history?.gender || "",
        height_weight: data?.health_history?.height_weight || "",
        current_health_concerns:
          data?.health_history?.current_health_concerns || [],
        diagnosed_conditions: data?.health_history?.diagnosed_conditions || [],
        medications: data?.health_history?.medications || [],
        supplements: data?.health_history?.supplements || [],
        allergies_intolerances:
          data?.health_history?.allergies_intolerances || [],
        family_health_history:
          data?.health_history?.family_health_history || [],
        specific_diet: data?.health_history?.specific_diet || [],
        exercise_habits: data?.health_history?.exercise_habits || "",
        sleep_quality: data?.health_history?.sleep_quality || "",
        stress_levels: data?.health_history?.stress_levels || "",
        energy_levels: data?.health_history?.energy_levels || "",
        menstrual_cycle_status:
          data?.health_history?.menstrual_cycle_status || "",
        hormone_replacement_therapy:
          data?.health_history?.hormone_replacement_therapy || "",
        fertility_concerns: data?.health_history?.fertility_concerns || "",
        birth_control_use: data?.health_history?.birth_control_use || "",
        blood_sugar_concerns: data?.health_history?.blood_sugar_concerns || "",
        digestive_issues: data?.health_history?.digestive_issues || "",
        recent_lab_tests:
          data?.health_history?.recent_lab_tests === true ? "Yes" : "No",
        health_goals: data?.health_history?.health_goals || "",
        desired_results_timeline:
          data?.health_history?.desired_results_timeline || "",
        health_approach_preference:
          data?.health_history?.health_approach_preference || "",
        consent: data?.health_history?.consent || false,
      });
    }
  }, [data]);

  console.log("formData", formData);
  console.log("health data", data);

  return isLoadingHealth ? (
    <span className="text-base">Loading...</span>
  ) : (
    <form onSubmit={handleSubmit}>
      {/* Basic Information */}
      <Heading title="Basic Information" mt={false} />
      <FormField
        label="Age"
        name="age"
        placeholder="Example: 42"
        value={formData.age}
        handleChange={handleChange}
      />
      <FormField
        label="Gender"
        name="gender"
        placeholder="Example: Female"
        value={formData.gender}
        handleChange={handleChange}
      />
      <FormField
        label="Height & Weight (Optional)"
        name="height_weight"
        placeholder="Height: 175 cm, Weight: 80 kg"
        value={formData.height_weight}
        handleChange={handleChange}
        note="⚠️ Please enter your details in the following format:  Height: 175 cm, Weight: 70 kg"
      />

      {/* Health Status & History */}
      <Heading title="Health Status & History" />
      <DropdownField
        label="Current health concerns or symptoms"
        name="current_health_concerns"
        options={[
          { label: "Fatigue", value: "fatigue" },
          { label: "Irregular periods", value: "irregular_periods" },
          { label: "Weight gain", value: "weight_gain" },
          { label: "Bloating", value: "bloating" },
          { label: "Brain fog", value: "brain_fog" },
        ]}
        value={formData.current_health_concerns}
        handleChange={handleChange}
      />
      <DropdownField
        label="Diagnosed medical conditions"
        name="diagnosed_conditions"
        options={[
          { label: "Hypothyroidism", value: "hypothyroidism" },
          { label: "Crohn's", value: "crohns" },
          { label: "PCOS", value: "pcos" },
          { label: "T2D", value: "t2d" },
        ]}
        value={formData.diagnosed_conditions}
        handleChange={handleChange}
      />
      <DropdownField
        label="Medications"
        name="medications"
        options={[
          { label: "Synthroid (Levothyroxine) 50 mcg", value: "synthroid" },
          { label: "Statin", value: "statin" },
          { label: "Metformin", value: "metformin" },
        ]}
        value={formData.medications}
        handleChange={handleChange}
      />
      <DropdownField
        label="Supplements"
        name="supplements"
        options={[
          { label: "Vitamin D", value: "vitamin_d" },
          { label: "Omega-3", value: "omega_3" },
          { label: "Magnesium", value: "magnesium" },
        ]}
        value={formData.supplements}
        handleChange={handleChange}
      />
      <DropdownField
        label="Known allergies or intolerances"
        name="allergies_intolerances"
        options={[
          { label: "Gluten", value: "gluten" },
          { label: "Dairy", value: "dairy" },
          { label: "Shellfish", value: "shellfish" },
        ]}
        value={formData.allergies_intolerances}
        handleChange={handleChange}
      />
      <DropdownField
        label="Family health history"
        name="family_health_history"
        options={[
          { label: "Heart disease", value: "heart_disease" },
          { label: "Cancer", value: "cancer" },
          { label: "Alzheimer's", value: "alzheimers" },
        ]}
        value={formData.family_health_history}
        handleChange={handleChange}
      />

      {/* Lifestyle & Habits */}
      <Heading title="Lifestyle & Habits" />
      <DropdownField
        label="Are you on any specific diet?"
        name="specific_diet"
        options={[
          { label: "Keto", value: "keto" },
          { label: "Vegan", value: "vegan" },
          { label: "Paleo", value: "paleo" },
        ]}
        value={formData.specific_diet}
        handleChange={handleChange}
      />
      <DropdownField
        label="Exercise habits"
        name="exercise_habits"
        options={[
          { label: "Sedentary", value: "sedentary" },
          { label: "Light activity", value: "light_activity" },
          { label: "Moderate", value: "moderate" },
          { label: "Intense", value: "intense" },
          { label: "Other", value: "other" },
        ]}
        value={formData.exercise_habits}
        handleChange={handleChange}
      />
      <DropdownField
        label="Sleep Quality"
        name="sleep_quality"
        options={[
          { label: "Poor", value: "poor" },
          { label: "Fair", value: "fair" },
          { label: "Good", value: "good" },
          { label: "Excellent", value: "excellent" },
        ]}
        value={formData.sleep_quality}
        handleChange={handleChange}
      />
      <DropdownField
        label="Stress levels"
        name="stress_levels"
        options={[
          { label: "Low", value: "low" },
          { label: "Moderate", value: "moderate" },
          { label: "High", value: "high" },
          { label: "Extreme", value: "extreme" },
        ]}
        value={formData.stress_levels}
        handleChange={handleChange}
      />
      <DropdownField
        label="Energy levels throughout the day"
        name="energy_levels"
        options={[
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
          { label: "Varies", value: "varies" },
        ]}
        value={formData.energy_levels}
        handleChange={handleChange}
      />

      {/* Women's Health (If Applicable) */}
      <Heading title="Women's Health (If Applicable)" />
      <DropdownField
        label="Menstrual cycle status"
        name="menstrual_cycle_status"
        options={[
          { label: "Regular", value: "regular" },
          { label: "Irregular", value: "irregular" },
          { label: "Perimenopause", value: "perimenopause" },
          { label: "Menopause", value: "menopause" },
          { label: "Other", value: "other" },
        ]}
        value={formData.menstrual_cycle_status}
        handleChange={handleChange}
      />
      <DropdownField
        label="Hormone replacement therapy use"
        name="hormone_replacement_therapy"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Considering", value: "considering" },
        ]}
        value={formData.hormone_replacement_therapy}
        handleChange={handleChange}
      />
      <DropdownField
        label="Fertility concerns"
        name="fertility_concerns"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Not applicable", value: "not_applicable" },
        ]}
        value={formData.fertility_concerns}
        handleChange={handleChange}
      />
      <DropdownField
        label="Birth control use"
        name="birth_control_use"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Not applicable", value: "not_applicable" },
        ]}
        value={formData.birth_control_use}
        handleChange={handleChange}
      />

      {/* Metabolic & Digestive Health */}
      <Heading title="Metabolic & Digestive Health" />
      <DropdownField
        label="Blood sugar management concerns"
        name="blood_sugar_concerns"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Other", value: "other" },
        ]}
        value={formData.blood_sugar_concerns}
        handleChange={handleChange}
      />
      <DropdownField
        label="Digestive issues"
        name="digestive_issues"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Other", value: "other" },
        ]}
        value={formData.digestive_issues}
        handleChange={handleChange}
      />
      <DropdownField
        label="Recent lab tests available?"
        name="recent_lab_tests"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
        value={formData.recent_lab_tests}
        handleChange={handleChange}
      />

      {/* Personalization & Goals */}
      <Heading title="Personalization & Goals" />
      <FormField
        label="What are you hoping to achieve?"
        name="health_goals"
        placeholder="Example: Improve fatigue, Lose weight, Manage anxiety"
        value={formData.health_goals}
        handleChange={handleChange}
      />
      <DropdownField
        label="How quickly do you want results?"
        name="desired_results_timeline"
        options={[
          { label: "Immediate guidance", value: "immediate" },
          { label: "Long-term sustainable change", value: "long_term" },
        ]}
        value={formData.desired_results_timeline}
        handleChange={handleChange}
      />
      <DropdownField
        label="Preferred approach to health solutions"
        name="health_approach_preference"
        options={[
          { label: "Conventional medicine", value: "conventional" },
          { label: "Holistic & natural", value: "holistic" },
          { label: "A mix of both", value: "mixed" },
        ]}
        value={formData.health_approach_preference}
        handleChange={handleChange}
      />

      {/* Consent & Submission */}
      <Heading title="Consent & Submission" />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.consent}
          onChange={(e) => handleChange("consent", e.target.checked)}
        />
        I agree to the privacy policy and understand how my data will be used.
      </label>
      <div className="mt-5 lg:mt-8 flex justify-center">
        <Button
          type="submit"
          text={isLoading ? "Submitting..." : "Save & Submit"}
          disabled={isLoading}
          className="text-white"
        />
      </div>
    </form>
  );
};

// Controlled text input component that uses the passed value.
// eslint-disable-next-line react/prop-types
const FormField = ({ label, name, placeholder, value, handleChange, note }) => {
  const onChange = (e) => {
    handleChange(name, e.target.value);
  };
  return (
    <>
      <div className="mt-4 lg:mt-6 flex items-center gap-4">
        <Input
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {value && (
          <IoCheckmarkCircle className="text-[40px] text-[#393838] mt-7" />
        )}
      </div>
      {note && <span className="text-xs text-gray-600 pt-2 block">{note}</span>}
    </>
  );
};

// Controlled dropdown component using onSelect from Dropdown and the passed value.
const DropdownField = ({
  label,
  name,
  options = false,
  value,
  handleChange,
}) => {
  const onSelectHandler = (option) => {
    handleChange(name, option.value);
  };

  return (
    <div className="mt-4 lg:mt-6 flex items-center gap-4">
      <Dropdown
        label={label}
        options={options}
        onSelect={onSelectHandler}
        defaultText={value ? value : "Select"}
        value={value}
      />
      {value && value.length > 0 && (
        <IoCheckmarkCircle className="text-[40px] text-[#393838] mt-7" />
      )}
    </div>
  );
};

const Heading = ({ title, mt = true }) => (
  <h4
    className={`text-base lg:text-2xl font-medium text-[#393838] ${
      mt ? "mt-5 lg:mt-[50px]" : ""
    }`}
  >
    {title}
  </h4>
);

export default PersonalizeModal;
