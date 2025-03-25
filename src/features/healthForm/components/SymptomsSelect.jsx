import { useEffect, useState } from "react";
import classNames from "classnames";
import Search from "../../../shared/ui/Search";
import { symptoms } from "./config";
import { IoChevronDown } from "react-icons/io5";
import Button from "../../../shared/ui/Button";

function SymptomsSelect({ data, setData }) {
    const [showSelect, setShowSelect] = useState(false);
    const [customSymptom, setCustomSymptom] = useState("");
    const [selected, setSelected] = useState(data.symptoms || []);
    
    useEffect(() => {
        setData({ symptoms: selected });      
    }, [selected]);

    const toggleSelect = () => {
        setShowSelect((prev) => !prev);
    };

    const handleCheckboxChange = (symptom) => {
        if (selected.includes(symptom)) {
            setSelected((prev) => prev.filter((item) => item !== symptom));
            if (symptom === "Other special condition") {
                setCustomSymptom("");
            }
        } else {
            setSelected((prev) => [...prev, symptom]);
        }
    };

    const handleAddCustomSymptom = () => {
        if (customSymptom.trim()) {
            setSelected((prev) => [
                ...prev.filter((item) => item !== "Other special condition"),
                customSymptom.trim()
            ]);
            setCustomSymptom("");
        }
    };

    const handleCancelCustomSymptom = () => {
        setCustomSymptom("");
        setSelected((prev) => prev.filter((item) => item !== "Other special condition"));
    };

    const handleApply = () => {
        setData({ symptoms: selected });
        setShowSelect(false);
    };

    return (
        <div className="relative">
            <div onClick={toggleSelect} className="cursor-pointer flex items-center justify-between w-full border border-stroke rounded-full p-3 pr-4">
                Select Symptoms
                <IoChevronDown className={
                    classNames(
                        "transition-transform duration-300",
                        { "transform rotate-180": showSelect }
                    )
                } />
            </div>
            <div
                className={classNames(
                    "absolute top-14 left-0 w-full bg-white z-50 border border-stroke rounded-2xl p-6 flex flex-col gap-4",
                    { hidden: !showSelect }
                )}
            >
                <Search size="full" />
                <div className="flex flex-col gap-3">
                    {symptoms.map((symptom) => (
                        <div key={symptom} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selected.includes(symptom)}
                                onChange={() => handleCheckboxChange(symptom)}
                            />
                            <label>{symptom}</label>
                        </div>
                    ))}
                    {selected.includes("Other special condition") && (
                        <div className="flex flex-col gap-2">
                            <textarea
                                className="border border-stroke rounded-lg p-2"
                                placeholder="Type special conditions here..."
                                value={customSymptom}
                                onChange={(e) => setCustomSymptom(e.target.value)}
                                rows={1}
                            />
                            <div className="flex gap-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    onClick={handleAddCustomSymptom}
                                >
                                    Add
                                </button>
                                <button
                                    className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                                    onClick={handleCancelCustomSymptom}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <Button name="Apply" type="default" onClick={handleApply} />
            </div>
        </div>
    );
}

export default SymptomsSelect;
