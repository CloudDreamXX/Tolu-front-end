import React from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, title, onClose, children, className, height }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-5"
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 rounded-lg  min-w-7  max-w-full overflow-y-scroll custom-scroll ${
          height ? height : "h-full"
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <section className="flex justify-between items-center">
          {title}
          <IoClose className="text-lg cursor-pointer" onClick={onClose} />
        </section>
        {children}
      </div>
    </div>
  );
};

export default Modal;
