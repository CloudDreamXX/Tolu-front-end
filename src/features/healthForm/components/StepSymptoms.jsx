import SymptomsSelect from './SymptomsSelect';
import { IoClose } from 'react-icons/io5';

function StepSymptoms({ data, setData }) {
  return (
    <div className="flex flex-col gap-4 max-w-[606px]">
      <p>Symptoms:</p>
      {data?.symptoms.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {data?.symptoms.map((symptom, index) => (
            <span
              key={index}
              className="bg-btnBg text-accent px-3 py-1 rounded-full flex items-center gap-1.5"
            >
              {symptom}
              <IoClose
                className="cursor-pointer"
                onClick={() => {
                  const newSymptoms = data.symptoms.filter(
                    (item) => item !== symptom
                  );
                  setData({ ...data, symptoms: newSymptoms });
                }}
              />
            </span>
          ))}
        </div>
      )}
      <SymptomsSelect data={data} setData={setData} />
    </div>
  );
}

export default StepSymptoms;
