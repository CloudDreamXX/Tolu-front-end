import {
  useAcceptCoachInviteMutation,
  useGetInvitationDetailsQuery,
} from "entities/client";
import {
  logout,
  setCredentials,
  setRoleID,
  useAccessCodeRequestMutation,
  useLazyGetReferralInvitationQuery,
  useRegisterUserMutation,
} from "entities/user";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "shared/lib/hooks/use-toast";
import { OtpScreen, SelectType, SignUp } from "./components";

const isAlreadyAccepted = (err: any) => {
  const status = Number(
    err?.response?.status ?? err?.status ?? err?.statusCode
  );
  const msg = String(
    err?.response?.data?.detail ??
    err?.response?.data?.message ??
    err?.message ??
    ""
  ).toLowerCase();
  const email = String(
    err?.response?.data?.detail?.email ?? err?.response?.data?.email ?? ""
  );
  return status === 400 || msg.includes("already accepted") || email.trim();
};

const isAuthRevoked = (err: any) => {
  const status = Number(
    err?.response?.status ?? err?.status ?? err?.statusCode
  );
  const msg = String(
    err?.response?.data?.detail ??
    err?.response?.data?.message ??
    err?.message ??
    ""
  ).toLowerCase();
  return (
    status === 403 ||
    status === 401 ||
    msg.includes("session_revoked") ||
    msg.includes("invalid token") ||
    msg.includes("expired token") ||
    msg.includes("expired invitation token") ||
    msg.toLowerCase().includes("session") ||
    msg.toLowerCase().includes("expired")
  );
};

const isNotFound = (err: any) => {
  const status = err?.response?.status ?? err?.status ?? err?.statusCode;
  return Number(status) === 404;
};

const isAlreadyRegistered = (err: any) => {
  const status = Number(
    err?.response?.status ?? err?.status ?? err?.statusCode
  );
  const msg = String(
    err?.response?.data?.detail ??
    err?.response?.data?.message ??
    err?.message ??
    ""
  ).toLowerCase();

  return status === 409 || msg.includes("already exists");
};

export const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    accountType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
    country: "",
    state: undefined,
  });

  const [inviteSource, setInviteSource] = useState<
    "client" | "referral" | null
  >(null);

  const [otpCode, setOtpCode] = useState("");

  const { token } = useParams();
  const dispatch = useDispatch();
  const {
    data,
    error: detailsError,
    isError: isClientInviteError,
    isSuccess: isClientInviteSuccess,
    isFetching: isClientInviteLoading,
  } = useGetInvitationDetailsQuery(token ?? "", { skip: !token });
  const [acceptCoachInvite] = useAcceptCoachInviteMutation();
  const [getReferralInvitation] = useLazyGetReferralInvitationQuery();
  const [accessCodeRequest] = useAccessCodeRequestMutation();

  const [stage, setStage] = useState<"otp" | "select" | "form">("otp");

  const [registerUser] = useRegisterUserMutation();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const handleClientInvite = async () => {
      if (isClientInviteLoading) return;

      if (isClientInviteSuccess && data && !cancelled) {
        setFormData((prev) => ({
          ...prev,
          firstName: data?.client?.first_name ?? "",
          lastName: data?.client?.last_name ?? "",
          name: data?.client?.full_name ?? "",
          email: data?.client?.email ?? "",
          phone: data?.client?.phone_number ?? "",
          accountType: "client",
        }));
        setInviteSource("client");
        return;
      }

      if (isClientInviteError && detailsError && !cancelled) {
        if (isAlreadyAccepted(detailsError)) {
          dispatch(logout());
          navigate("/auth", {
            state: { email: (detailsError as any)?.data?.detail?.email },
            replace: true,
          });
          return;
        }

        if (isAuthRevoked(detailsError)) {
          toast({
            variant: "destructive",
            title: "Session expired",
            description: "Please sign in again to continue.",
          });
          dispatch(logout());
          navigate("/auth", {
            replace: true,
          });
          return;
        }

        if (isAlreadyRegistered(detailsError)) {
          try {
            await acceptCoachInvite({ token }).unwrap();
            navigate("/library");
          } catch (acceptErr) {
            if (isAuthRevoked(acceptErr)) {
              toast({
                variant: "destructive",
                title: "Session expired",
                description: "Please sign in again to continue.",
              });
              dispatch(logout());
              navigate("/auth", {
                replace: true,
                state: { coachInviteToken: token },
              });
              return;
            }
            toast({
              title: "Unable to accept invite",
              description: "Please try again or request a new link.",
              variant: "destructive",
            });
          }
          return;
        }

        if (isNotFound(detailsError)) {
          console.error("Client invite not found", detailsError);
        }
      }

      if (!isClientInviteSuccess && !isClientInviteLoading && !cancelled) {
        try {
          const referralData = await getReferralInvitation(token).unwrap();
          if (cancelled) return;
          setFormData((prev) => ({
            ...prev,
            lastName: referralData?.referral?.friend_last_name ?? "",
            firstName: referralData?.referral?.friend_first_name ?? "",
            name: referralData?.referral?.friend_name ?? "",
            email: referralData?.referral?.friend_email ?? "",
            phone:
              referralData?.referral?.friend_phone?.replace(/\D/g, "") ?? "",
            accountType: "client",
          }));
          setInviteSource("referral");
        } catch (err) {
          if (isAlreadyAccepted(err)) {
            dispatch(logout());
            navigate("/auth", { replace: true });
            return;
          }
          if (isAuthRevoked(err)) {
            toast({
              variant: "destructive",
              title: "Session expired",
              description: "Please sign in again to continue.",
            });
            dispatch(logout());
            navigate("/auth", { replace: true });
            return;
          }
          if (isAlreadyRegistered(err)) {
            toast({ title: "Invitation accepted" });
            navigate("/library");
            return;
          }
          if (isNotFound(err)) {
            toast({
              title: "Invalid or expired invitation",
              description:
                "This link has expired. Please request a new login link.",
              variant: "destructive",
            });
            navigate("/auth", { state: { isInvitedClient: true } });
          }
          toast({
            title: "Unable to load invitation",
            description: "Please try again or request a new link.",
            variant: "destructive",
          });
        }
      }
    };

    handleClientInvite();
    return () => {
      cancelled = true;
    };
  }, [
    token,
    data,
    isClientInviteError,
    isClientInviteSuccess,
    isClientInviteLoading,
    detailsError,
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataBE = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phone,
      password: formData.password,
      roleID: formData.accountType === "client" ? 3 : 2,
      country: formData.country,
      state: formData.state,
      email_verification_skipped: inviteSource === "referral" ? true : false,
    };

    dispatch(setRoleID({ roleID: dataBE.roleID }));
    dispatch(setRoleID({ roleID: dataBE.roleID }));

    try {
      const res = await registerUser({
        user: dataBE,
        access_code: otpCode,
      }).unwrap();

      if (res?.user && res.accessToken) {
        dispatch(
          setCredentials({ user: res.user, accessToken: res.accessToken })
        );

        if (res.user.roleID === 3) {
          navigate("/welcome/client", {
            state: {
              inviteSource: inviteSource,
            },
          });
        } else {
          navigate("/select-type");
        }
        return;
      }

      if (!res.accessToken) {
        toast({ title: "Register successful", description: "Welcome!" });
        navigate("/verify-email");
      }
    } catch (error) {
      if (isAuthRevoked(error)) {
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please sign in again to continue.",
        });
        dispatch(logout());
        navigate("/auth", { replace: true });
        return;
      }
      if (isAuthRevoked(error)) {
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please sign in again to continue.",
        });
        dispatch(logout());
        navigate("/auth", { replace: true });
        return;
      }
      console.error("Error registering user:", error);
      toast({
        title: "Email already exists",
        description:
          "Your email address is already verified. Welcome back to Tolu AI.",
        variant: "destructive",
      });
    }
  };

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCodeSend = async () => {
    try {
      const res = await accessCodeRequest({ access_code: otpCode }).unwrap();

      if (res.success) {
        setFormData({
          ...formData,
          email: res.email,
          firstName: res.first_name,
          lastName: res.last_name,
          accountType:
            res.account_type === "Individual/Women" ? "client" : "coach",
          phone: res.phone_number,
        });
        setStage("form");
      } else {
        toast({
          title: "Invalid access code",
          description: "Please check your code or send a request again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error sending access code:", err);
      toast({
        title: "Invalid access code",
        description: "Please check your code or send a request again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen xl:flex-row">
      <div className="w-full xl:max-w-[550px] 2xl:max-w-[665px] h-[150px] xl:h-auto bg-[#1C63DB] flex justify-center items-center xl:px-6 xl:px-[76.5px]">
        <aside className="py-[10px] px-[95px] xl:p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white  text-center text-[44.444px] xl:text-[96px] font-bold">
            Tolu AI
          </h1>
          <h3 className="capitalize  text-white text-center text-[14px] md:text-[15px] xl:text-[32px] font-semibold xl:font-medium">
            Knowledge Before Care
          </h3>
        </aside>
      </div>
      <div className="w-full px-[16px] py-[24px] mt-[40px] md:p-0 md:pb-[24px] md:pt-[63px] md:mt-0 flex justify-center items-center self-stretch flex-1 bg-[linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #FFF]">
        {stage === "otp" && (
          <OtpScreen
            handleCodeSend={handleCodeSend}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
          />
        )}

        {stage === "select" && (
          <SelectType
            formData={formData}
            handleCardClick={(type) => {
              setFormData({ ...formData, accountType: type });
              setStage("form");
            }}
          />
        )}

        {stage === "form" && (
          <SignUp
            formData={formData}
            handleSubmit={handleSubmit}
            formDataChangeHandler={formDataChangeHandler}
          />
        )}
      </div>
    </div>
  );
};
