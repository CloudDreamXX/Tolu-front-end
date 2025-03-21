import { IoClose } from "react-icons/io5";
import classNames from "classnames";
import { useEffect } from "react";

function Modal({ 
    title, 
    description, 
    children, 
    isOpen, 
    onClose, 
    onSkip, 
    onContinue,
    onBack,
    isLastStep,
    canContinue = true,
    className = ""
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm" onClick={onClose}>
            <div 
                className={classNames("bg-white p-6 w-[500px] rounded-lg shadow-lg", className)}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <IoClose className="w-6 h-6" />
                    </button>
                </div>
                {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
                <div className="mt-4">{children}</div>
                <div className="mt-4 flex justify-end gap-2">
                    {onBack && (
                        <button 
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                            onClick={onBack}
                        >
                            Back
                        </button>
                    )}
                    <button 
                        className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                        onClick={onSkip}
                    >
                        Skip
                    </button>
                    <button 
                        className={classNames(
                            "px-4 py-2 rounded-md text-white", 
                            canContinue ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
                        )}
                        onClick={onContinue}
                        disabled={!canContinue}
                    >
                        {isLastStep ? "Finish" : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
