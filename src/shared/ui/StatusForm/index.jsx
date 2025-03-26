import { useState } from "react";
import Button from "../Button";
import SelectField from "./SelectField";

function StatusForm({ setStatusModal }) {
  const [concerns, setConcerns] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [family, setFamily] = useState([]);
  const [diet, setDiet] = useState([]);

  return (
    <div className="flex flex-col gap-4 md:gap-10 w-full max-h-[800px] overflow-y-auto pr-4">
      <div className="flex flex-col gap-4 md:gap-6">
        <h2 className="text-xl font-bold">Health Status</h2>

        <label htmlFor="brief" className="flex flex-col gap-2 w-full">
          Briefly explain your health concern. *
          <textarea
            name="brief"
            id="brief"
            placeholder="I have a history of breast cancer and chronic constipation..."
            className="border border-gray-300 rounded-lg p-4 w-full"
            rows={2}
          />
        </label>

        <SelectField label="Current health concerns or symptoms" value={concerns} setValue={setConcerns} />
        <SelectField label="Diagnosed medical conditions" value={conditions} setValue={setConditions} />
        <SelectField label="Supplements (Type)" value={supplements} setValue={setSupplements} />
        <SelectField label="Known allergies or intolerances" value={allergies} setValue={setAllergies} />
        <SelectField label="Family health history" value={family} setValue={setFamily} />
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <h2 className="text-xl font-bold">Lifestyle & Habits</h2>
        <SelectField label="Are you on any specific diet?" value={diet} setValue={setDiet} />
      </div>

      <div className="w-full flex justify-end">
        <div className="w-full max-w-[170px]">
          <Button name="Save & submit" type="default" onClick={() => setStatusModal(false)} />
        </div>
      </div>
    </div>
  );
}

export default StatusForm;
