import React from 'react';
import Button from '../../../../components/small/Button';
// import Button from './Button'; // Adjust the import path as needed

const AddInstruction = ({
    handleInstructionChange ,
    closeInstructionModal,
    addInstruction,
    instruction,

}) => {
  // Handler for text area changes – uses parent's state setter

  return (
    <div>
      <textarea
        className="w-full mt-4 h-40 p-4 border rounded"
        placeholder="Enter instructions here..."
        value={instruction}
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
