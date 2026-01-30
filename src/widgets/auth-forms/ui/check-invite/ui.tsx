import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "shared/lib/hooks/use-toast";
import { z } from "zod";
import { Button, Input } from "shared/ui";
import { useLazyCheckPendingInviteQuery } from "entities/user/api";
import { useNavigate } from "react-router-dom";

export const CheckInvite = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hasPendingInvite, setHasPendingInvite] = useState<boolean | null>(
    null
  );
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [triggerCheckInvite, { isLoading: isSubmitting }] = useLazyCheckPendingInviteQuery();

  const emailSchema = z.object({
    email: z.string().email("The email format is incorrect."),
  });
  const nav = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailError("");
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsedData = emailSchema.safeParse({ email });

    if (!parsedData.success) {
      setEmailError(
        parsedData.error.errors.find((e) => e.path[0] === "email")?.message ??
          ""
      );
      return;
    }

    try {
      const { data, error } = await triggerCheckInvite(email);

      if (error) {
        throw error;
      }

      if (data?.has_pending_invite) {
        if (data.token) {
          nav(`/accept-invite/${data.token}`);
        }
      } else {
        setHasPendingInvite(false);
        setResponseMessage(
          "Sorry, but there are no pending invites to this email."
        );
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message || "Failed to check pending invite.",
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-screen xl:flex-row">
      <div className="w-full xl:max-w-[665px] h-[150px] xl:h-full bg-[#1C63DB] flex justify-center items-center xl:px-6 xl:px-[76.5px]">
        <aside className="py-[10px] px-[95px] xl:p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white text-center text-[44.444px] xl:text-[96px] font-bold">
            Tolu AI
          </h1>
          <h3 className="capitalize text-white text-center text-[14px] md:text-[15px] xl:text-[32px] font-semibold xl:font-medium">
            Knowledge Before Care
          </h3>
        </aside>
      </div>

      <div className="flex justify-center flex-1 w-full h-full bg-white xl:items-center">
        <form
          className={`w-full md:w-[550px] flex flex-col mt-[44px] md:mt-[121px] xl:mt-0 py-[24px] px-[16px] md:p-0 xl:items-center gap-[40px] ${hasPendingInvite !== null ? "xl:gap-[16px]" : "xl:gap-[60px]"}`}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center gap-[14px]">
            <img src="/logo.png" className="w-[60px] h-[60px]" />
            <h3 className="text-black text-center font-semibold text-[28px] md:text-[40px]">
              {hasPendingInvite !== null
                ? hasPendingInvite
                  ? "Check your inbox"
                  : ""
                : "Check invite"}
            </h3>
          </div>

          {hasPendingInvite === null && (
            <main className="flex flex-col gap-[24px] items-start self-stretch">
              <div className="flex flex-col items-start gap-[4px] w-full">
                <label className="text-[#5f5f65] text-[16px] font-semibold ">
                  Email
                </label>
                <Input
                  type="text"
                  placeholder="Enter Email"
                  name="email"
                  onChange={handleEmailChange}
                  className={`px-[16px] py-[11px] h-[44px] rounded-[8px] bg-white outline-none focus-visible:outline-none w-full ${
                    emailError
                      ? "border border-[#FF1F0F]"
                      : "border border-[#DFDFDF] focus:border-[#1C63DB]"
                  }`}
                />
                {emailError && (
                  <p className="text-[#FF1F0F] text-[14px] font-medium px-[4px] pt-[4px]">
                    {emailError}
                  </p>
                )}
              </div>
            </main>
          )}

          {hasPendingInvite !== null && (
            <h3 className="text-center self-stretch text-black  text-[16px] md:text-[24px] font-normal">
              {responseMessage}
            </h3>
          )}

          {hasPendingInvite !== null && !hasPendingInvite && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              type="button"
              className={`w-full md:w-[250px] h-[44px] p-[16px] rounded-full flex items-center justify-center text-[16px] font-semibold bg-[#1C63DB] text-white`}
              onClick={() => nav("/register")}
            >
              Sign up
            </Button>
          )}

          {hasPendingInvite === null && (
            <div className="flex flex-col gap-[8px]">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-[250px] h-[44px] p-[16px] rounded-full flex items-center justify-center text-[16px] font-semibold ${
                  email && !emailError && !isSubmitting
                    ? "bg-[#1C63DB] text-white"
                    : "bg-[#D5DAE2] text-[#5F5F65]"
                }`}
              >
                {isSubmitting ? "Checking..." : "Check Invite"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
