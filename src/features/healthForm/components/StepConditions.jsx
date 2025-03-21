function StepConditions({ data, setData }) {
  return (
      <div className="flex flex-col gap-4">
          <p>Select Your Diagnosed Conditions:</p>
          <select
              multiple
              className="border rounded p-2"
              value={data.conditions}
              onChange={(e) =>
                  setData({ conditions: [...e.target.selectedOptions].map((o) => o.value) })
              }
          >
              <option value="Diabetes">Diabetes</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Asthma">Asthma</option>
          </select>
      </div>
  );
}

export default StepConditions;