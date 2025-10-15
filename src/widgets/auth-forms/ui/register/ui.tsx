import {
  useAcceptCoachInviteMutation,
  useGetInvitationDetailsQuery,
} from "entities/client";
import {
  logout,
  setCredentials,
  setRoleID,
  useLazyGetReferralInvitationQuery,
  useRegisterUserMutation,
} from "entities/user";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "shared/lib/hooks/use-toast";
import { SelectType, SignUp } from "./components";

const isAlreadyAccepted = (err: any) => {
  // const status = Number(
  //   err?.response?.status ?? err?.status ?? err?.statusCode
  // );
  const msg = String(
    err?.response?.data?.detail ??
      err?.response?.data?.message ??
      err?.message ??
      ""
  ).toLowerCase();
  return (
    // status === 404 ||
    msg.includes("already accepted")
  );
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
    msg.includes("expired invitation token")
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
    country: "",
    state: undefined,
  });

  const [inviteSource, setInviteSource] = useState<
    "client" | "referral" | null
  >(null);

  const { token } = useParams();
  const dispatch = useDispatch();
  const { data, error: detailsError } = useGetInvitationDetailsQuery(
    token ?? "",
    { skip: !token }
  );
  const [acceptCoachInvite] = useAcceptCoachInviteMutation();
  const [getReferralInvitation] = useLazyGetReferralInvitationQuery();

  const [registerUser] = useRegisterUserMutation();

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
      if (data) {
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
      }

      if (detailsError) {
        if (isAlreadyAccepted(detailsError)) {
          dispatch(logout());
          navigate("/auth", {
            //  state: { email: data?.email },
            replace: true,
          });
          return;
        }

        if (isAuthRevoked(detailsError)) {
          dispatch(logout());
          navigate("/auth", {
            state: { isInvitedClient: true },
            replace: true,
          });
          return;
        }
        if (cancelled) return;

        if (isAlreadyRegistered(detailsError)) {
          try {
            await acceptCoachInvite({ token }).unwrap();
            navigate("/library");
          } catch (acceptErr) {
            if (isAuthRevoked(acceptErr)) {
              dispatch(logout());
              navigate("/auth", {
                replace: true,
                state: { coachInviteToken: token },
              });
              return;
            }
            console.error("Failed to accept coach invite", acceptErr);
            toast({
              title: "Unable to accept invite",
              description: "Please try again or request a new link.",
              variant: "destructive",
            });
          }
          return;
        }

        if (isNotFound(detailsError)) {
          console.error("Failed to fetch invitation details", detailsError);
          return;
        }
      }

      try {
        const data = await getReferralInvitation(token).unwrap();
        if (cancelled) return;
        setFormData((prev) => ({
          ...prev,
          name: data?.referral?.friend_name ?? "",
          email: data?.referral?.friend_email ?? "",
          phone: data?.referral?.friend_phone.replace(/\D/g, "") ?? "",
          accountType: "client",
        }));
        setInviteSource("referral");
        return;
      } catch (err) {
        if (isAlreadyAccepted(err)) {
          dispatch(logout());
          navigate("/auth", { replace: true });
          return;
        }
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
          console.error(err);
          navigate("/auth");
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
  }, [token, navigate, toast, data, detailsError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataBE = {
      name: formData.name,
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
      const res = await registerUser(dataBE).unwrap();

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
        dispatch(logout());
        navigate("/auth", { replace: true });
        return;
      }
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
