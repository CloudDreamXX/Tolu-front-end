import { useState } from "react";
import Modal from "../../../shared/ui/Modal";
import { stepConfig } from "./config";

function HealthForm({ isOpen, onClose, onSubmit }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        symptoms: [],
        conditions: [],
        allergies: [],
    });

    const CurrentStepComponent = stepConfig[currentStep].component;

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        if (currentStep < stepConfig.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            onSubmit(formData);
            onClose();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    console.log(formData);    

    return (
        <Modal
            title={stepConfig[currentStep].title}
            description={stepConfig[currentStep].description}
            isOpen={isOpen}
            onClose={onClose}
            onSkip={onClose}
            onContinue={() => handleNext(formData)}
            onBack={currentStep > 0 ? handleBack : null}
            isLastStep={currentStep === stepConfig.length - 1}
            canContinue={formData[stepConfig[currentStep].id]?.length > 0}
        >
            <CurrentStepComponent
                data={formData}
                setData={(data) => setFormData((prev) => ({ ...prev, ...data }))}
            />
        </Modal>
    );
}

export default HealthForm;
