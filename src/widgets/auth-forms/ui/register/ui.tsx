import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SelectType, SignUp } from "./components";
import { UserService, logout, setCredentials, setRoleID } from "entities/user";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "shared/lib/hooks/use-toast";
import { ClientService } from "entities/client";
import { useDispatch } from "react-redux";

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
    msg.includes("expired token")
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    accountType: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
  });

  const [inviteSource, setInviteSource] = useState<
    "client" | "referral" | null
  >(null);

  const { token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

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

    const fetchInviteDetails = async () => {
      try {
        const data = await ClientService.getInvitationDetails(token);
        if (cancelled) return;
        setFormData((prev) => ({
          ...prev,
          name: data?.client?.full_name ?? "",
          email: data?.client?.email ?? "",
          phone: data?.client?.phone_number ?? "",
          accountType: "client",
        }));
        setInviteSource("client");
        return;
      } catch (err) {
        if (isAuthRevoked(err)) {
          dispatch(logout());
          navigate("/auth", { replace: true });
          return;
        }
        if (cancelled) return;

        if (isAlreadyRegistered(err)) {
          await ClientService.acceptCoachInvite({ token });
          navigate("/library");
          return;
        }

        if (!isNotFound(err)) {
          console.error("Failed to fetch invitation details", err);
          toast({
            title: "Unable to load invitation",
            description: "Please try again or request a new link.",
            variant: "destructive",
          });
          return;
        }
      }

      try {
        const data = await UserService.getReferralInvitation(token);
        if (cancelled) return;
        setFormData((prev) => ({
          ...prev,
          name: data?.referral?.friend_name ?? "",
          email: data?.referral?.friend_email ?? "",
          phone: data?.referral?.friend_phone ?? "",
          accountType: "client",
        }));
        setInviteSource("referral");
        return;
      } catch (err) {
        if (isAuthRevoked(err)) {
          dispatch(logout());
          navigate("/auth", { replace: true });
          return;
        }
        if (cancelled) return;

        if (isAlreadyRegistered(err)) {
          toast({
            title: "Invitation accepted",
          });
          navigate("/library");
          return;
        }

        console.error("Failed to fetch referral invitation", err);

        if (isNotFound(err)) {
          toast({
            title: "Invalid or expired invitation",
            description:
              "This link has expired. Please request a new login link.",
            variant: "destructive",
          });
          navigate("/auth", { state: { isInvitedClient: true } });
        } else {
          toast({
            title: "Unable to load invitation",
            description: "Please try again or request a new link.",
            variant: "destructive",
          });
        }
      }
    };

    fetchInviteDetails();
    return () => {
      cancelled = true;
    };
  }, [token, navigate, toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataBE = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      password: formData.password,
      dob: "2025-05-13",
      roleID: formData.accountType === "client" ? 3 : 2,
      email_verification_skipped: inviteSource === "referral" ? true : false,
    };

    dispatch(setRoleID({ roleID: dataBE.roleID }));

    try {
      const res = await UserService.registerUser(dataBE);

      if (res.user && res.accessToken) {
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
          navigate("/welcome/practitioner");
        }
        return;
      }

      if (!res.accessToken) {
        toast({ title: "Register successful", description: "Welcome!" });
        navigate("/verify-email");
      }
    } catch (error) {
      if (isAuthRevoked(error)) {
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

  const handleCardClick = (user: string) => {
    setFormData((prev) => ({ ...prev, accountType: user }));
    setInviteSource(null);
  };

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col w-full h-screen xl:flex-row">
      <div className="w-full xl:max-w-[550px] 2xl:max-w-[665px] h-[150px] xl:h-full bg-[#1C63DB] flex justify-center items-center xl:px-6 xl:px-[76.5px]">
        <aside className="py-[10px] px-[95px] xl:p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white  text-center text-[44.444px] xl:text-[96px] font-bold">
            Tolu AI
          </h1>
          <h3 className="capitalize  text-white text-center text-[14px] md:text-[15px] xl:text-[32px] font-semibold xl:font-medium">
            Knowledge Before Care
          </h3>
        </aside>
      </div>
      <div className="w-full px-[16px] py-[24px] mt-[40px] md:p-0 md:mt-[63px] flex justify-center items-center self-stretch flex-1 bg-[linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #FFF]">
        {formData.accountType.length > 1 ? (
          <SignUp
            formData={formData}
            handleSubmit={handleSubmit}
            formDataChangeHandler={formDataChangeHandler}
          />
        ) : (
          <SelectType formData={formData} handleCardClick={handleCardClick} />
        )}
      </div>
    </div>
  );
};
