function StepAllergies({ data, setData }) {
  return (
      <div className="flex flex-col gap-4">
          <p>Select Your Allergies:</p>
          <select
              className="border rounded p-2"
              value={data.allergies}
              onChange={(e) => setData({ allergies: [e.target.value] })}
          >
              <option value="">Select</option>
              <option value="Pollen">Pollen</option>
              <option value="Nuts">Nuts</option>
              <option value="Dairy">Dairy</option>
          </select>
      </div>
  );
}

export default StepAllergies;
