import EmptyChat from "shared/assets/images/EmptyChat.png";

export const EmptyCoachChat = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <img
      src={EmptyChat}
      alt=""
      className="mb-[16px] w-[122px] md:w-[135px] xl:w-[163px]"
    />
    <div className="text-center flex flex-col items-center justify-center gap-[8px]">
      <p className="text-[18px] md:text-[28px] xl:text-[32px] font-[700] text-[#1D1D1F]">
        There are no messages ...
      </p>
      <p className="text-[16px] md:text-[20px] font-[500] text-[#5F5F65] max-w-[450px]">
        Start a conversation with a customer to provide support or answer a
        query.
      </p>
    </div>
  </div>
);
