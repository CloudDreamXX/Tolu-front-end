import { useState } from "react";

function StepSymptoms({ data, setData }) {
    const [selectedSymptoms, setSelectedSymptoms] = useState(data.symptoms || []);

    const handleSelect = (symptom) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
        );
        setData({ symptoms: [...selectedSymptoms] });
    };

    return (
        <div className="flex flex-col gap-4">
            <p>Symptoms:</p>
            <div className="flex gap-2 flex-wrap">
                {["Headache", "Fatigue", "Dizziness"].map((symptom) => (
                    <button
                        key={symptom}
                        className={`px-3 py-1 rounded-lg text-sm ${selectedSymptoms.includes(symptom) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => handleSelect(symptom)}
                    >
                        {symptom}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default StepSymptoms;
