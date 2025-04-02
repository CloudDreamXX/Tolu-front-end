import React, { useEffect } from 'react';
import Button from '../../../../components/small/Button';

const AddInstruction = ({
  handleInstructionChange,
  closeInstructionModal,
  addInstruction,
  instruction,
}) => {
  useEffect(() => {
    const savedInstructions = localStorage.getItem('instruction');
    if (savedInstructions && !instruction) {
      handleInstructionChange({ target: { value: savedInstructions } });
    }
  }, [handleInstructionChange, instruction]);

  return (
    <div>
      <textarea
        className="w-full mt-4 h-40 p-4 border rounded"
        placeholder="Enter instructions here..."
        value={instruction || ''}
        onChange={handleInstructionChange}
      />
      <section className="flex justify-end gap-2 mt-4">
        <Button
          className="!bg-[#8E8E8E] text-white"
          text="Close"
          onClick={closeInstructionModal}
        />
        <Button
          className="!bg-[#B6B6B6] text-[#1D1D1F99]"
          text="Add instructions"
          onClick={addInstruction}
        />
      </section>
    </div>
  );
};

export default AddInstruction;