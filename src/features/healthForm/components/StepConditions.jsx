import { useState } from "react";
import classNames from "classnames";
import { diagnosedConditions } from "./config";
import { IoChevronDown } from "react-icons/io5";

function StepConditions({ data, setData }) {
    const [expanded, setExpanded] = useState(null);

    const toggleDropdown = (index) => {
        setExpanded((prev) => (prev === index ? null : index));
    };

    const handleCheckboxChange = (condition, point) => {
        const existing = data.conditions.find(c => c.title === condition.title);

        let updatedConditions;

        if (existing) {
            const alreadyChecked = existing.points.includes(point);
            const newPoints = alreadyChecked
                ? existing.points.filter(p => p !== point)
                : [...existing.points, point];

            if (newPoints.length > 0) {
                updatedConditions = data.conditions.map(c =>
                    c.title === condition.title ? { ...c, points: newPoints } : c
                );
            } else {
                updatedConditions = data.conditions.filter(c => c.title !== condition.title);
            }
        } else {
            updatedConditions = [...data.conditions, { title: condition.title, points: [point] }];
        }

        setData({ ...data, conditions: updatedConditions });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
                {diagnosedConditions.map((condition, index) => (
                    <div key={index}>
                        <div 
                            className="w-full flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown(index)}
                        >
                            <div
                                className="flex items-center gap-4">
                                <img src={condition.icon} alt={condition.title} className="w-8 h-8" />
                                <span className="text-md font-medium">{condition.title}</span>
                            </div>
                            <IoChevronDown
                                className={classNames(
                                    "transition-transform duration-300",
                                    { "transform rotate-180": expanded === index }
                                )}
                            />
                        </div>
                        {expanded === index && (
                            <div className="mt-4 flex flex-col gap-2 pl-10">
                                {condition.points.map((point, pointIndex) => {
                                    const isChecked = data.conditions.some(
                                        item =>
                                            item.title === condition.title &&
                                            item.points.includes(point)
                                    );
                                    return (
                                        <label key={pointIndex} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(condition, point)}
                                            />
                                            <span>{point}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StepConditions;
