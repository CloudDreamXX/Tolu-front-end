import { InputOTP, InputOTPGroup, InputOTPSlot } from "shared/ui/input-otp";

type Props = {
  otpCode: string;
  setOtpCode: React.Dispatch<React.SetStateAction<string>>;
  handleCodeSend: () => Promise<void>;
};

export const OtpScreen: React.FC<Props> = ({
  otpCode,
  setOtpCode,
  handleCodeSend,
}) => {
  return (
    <div className="flex flex-col w-full md:w-[450px] gap-[32px] mt-[80px]">
      <div className="flex flex-col items-center gap-3">
        <img src="/logo.png" className="w-[60px] h-[60px]" />
        <h2 className="text-[24px] font-semibold text-black">
          Enter your access code below
        </h2>
      </div>

      <div className="flex flex-col items-center gap-[55px] mt-4">
        <InputOTP
          maxLength={6}
          value={otpCode}
          onChange={(v) => setOtpCode(v.toUpperCase())}
        >
          <InputOTPGroup className="gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-[44px] h-[56px] text-[24px] font-semibold border rounded-[8px]"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <button
          onClick={handleCodeSend}
          className={`flex w-full md:w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full text-[16px] font-semibold ${otpCode.length === 6
              ? "bg-[#1C63DB] text-white"
              : "bg-[#D5DAE2] text-[#5F5F65]"
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
