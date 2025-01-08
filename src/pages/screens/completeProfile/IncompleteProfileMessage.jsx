/* eslint-disable react/prop-types */
import profileIncompletePic from "../../../assets/images/profile-incomplete.png";

const IncompleteProfileMessage = ({
  title,
  onClose,
  children,
  width,
  message,
  percentage,
}) => {
  return (
    <div
      className="modal bg-[#00000060] fixed -top-5 left-0 inset-0 z-[99] p-6 flex items-center justify-center "
      onClick={onClose}
    >
      <div
        className={`bg-white flex flex-col items-center rounded-md shadow-lg p-4 md:p-6 overflow-y-auto custom-scroll h-fit max-h-full space-y-3 ${
          width ? width : "w-[300px] lg:w-[400px] xl:w-[500px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[#111111] font-semibold text-base md:text-xl">
          {title}
        </h2>
        <img src={profileIncompletePic} className="w-[150px] md:w-[245px]" />

        <div className="w-full">
          <p className="text-end text-sm text-[#09090B80] font-[600]">
            {percentage}%
          </p>
          <div className="w-full bg-[#7777772E] rounded-full h-2.5 ">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <p className="text-sm md:text-base text-[#71717A] text-center">
          {message}
        </p>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default IncompleteProfileMessage;
