/* eslint-disable react/prop-types */
const ConfirmAlert = ({ title, onClose, children, width, message }) => {
  return (
    <div
      className="modal bg-[#00000060] fixed -top-5 left-0 inset-0 z-[99] p-6 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-md shadow-lg p-4 md:p-6 overflow-y-auto custom-scroll h-fit max-h-full space-y-3 ${
          width ? width : "w-[300px] md:w-[400px] lg:w-[700px] xl:w-[900px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[#111111] font-semibold text-base md:text-xl">
          {title}
        </h2>
        <p className="text-sm md:text-base text-[#71717A]">{message}</p>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
