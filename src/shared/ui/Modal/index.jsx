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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
            <div 
                className={classNames("bg-white p-6 w-full max-w-[993px] rounded-lg shadow-lg", className)}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center pb-3">
                    <h2 className="text-3xl font-bold">{title}</h2>
                </div>
                {description && <p className="text-base mt-2 text-center max-w-[700px] mx-auto">{description}</p>}
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
