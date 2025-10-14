import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
import {
  ChangePasswordRequest,
  CheckInviteResponse,
  ClientOnboardingResponse,
  IRegisterUser,
  IUser,
  MenopauseSubmissionRequest,
  OnboardingStatus,
  VerifyPasswordlessLogin,
  RecommendationsResponse,
  ReferFriendRequest,
  SymptomsResponse,
  UserOnboardingInfo,
  PasswordlessLoginRequest,
} from "./model";
import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";
import { FormState } from "entities/store/clientOnboardingSlice";
import { RootState } from "entities/store";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Onboarding", "Menopause"],

  endpoints: (builder) => ({
    login: builder.mutation<
      { user: IUser; accessToken: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: API_ROUTES.USER.LOGIN,
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation<
      { success: boolean; message: string; email: string },
      string
    >({
      query: (email) => ({
        url: API_ROUTES.USER.FORGOT_PASSWORD,
        method: "POST",
        body: { email },
      }),
    }),

    setNewPassword: builder.mutation<
      { message: string },
      { email: string; token: string; new_password: string }
    >({
      query: (body) => ({
        url: API_ROUTES.USER.SET_NEW_PASSWORD,
        method: "POST",
        body,
      }),
    }),

    registerUser: builder.mutation<any, IRegisterUser>({
      query: (userInfo) => ({
        url: API_ROUTES.USER.SIGNUP,
        method: "POST",
        body: userInfo,
      }),
    }),

    verifyEmail: builder.mutation<
      { user: IUser; accessToken: string },
      { email: string; token: string }
    >({
      query: (body) => ({
        url: API_ROUTES.USER.COMPLETE_SIGNUP,
        method: "POST",
        body,
      }),
    }),

    verifyEmailPass: builder.mutation<
      { user: IUser; accessToken: string },
      { email: string; token: string }
    >({
      query: (body) => ({
        url: API_ROUTES.USER.VERIFY_RESET_TOKEN,
        method: "POST",
        body,
      }),
    }),

    onboardUser: builder.mutation<
      any,
      { data: CoachOnboardingState; photo?: File; licenseFiles?: File[] }
    >({
      query: ({ data, photo, licenseFiles = [] }) => {
        const formData = new FormData();
        formData.append("onboarding_data", JSON.stringify(data));
        if (photo) formData.append("headshot", photo);
        licenseFiles.forEach(
          (file) => file && formData.append("license_files", file)
        );
        return {
          url: API_ROUTES.USER.ONBOARD_USER,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Onboarding"],
    }),

    updateUser: builder.mutation<
      any,
      { data: CoachOnboardingState; photo?: File; licenseFiles?: File[] }
    >({
      query: ({ data, photo, licenseFiles = [] }) => {
        const formData = new FormData();
        formData.append("onboarding_data", JSON.stringify(data));
        if (photo) formData.append("headshot", photo);
        licenseFiles.forEach(
          (file) => file && formData.append("license_files", file)
        );
        return {
          url: API_ROUTES.USER.ONBOARD_USER,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Onboarding"],
    }),

    getOnboardingUser: builder.query<UserOnboardingInfo, void>({
      query: () => API_ROUTES.USER.ONBOARD_USER,
      providesTags: ["Onboarding"],
    }),

    onboardClient: builder.mutation<
      { message: string },
      { data: FormState; token?: string }
    >({
      query: ({ data, token }) => {
        const formData = new FormData();
        formData.append("onboarding_data", JSON.stringify(data));
        return {
          url: API_ROUTES.USER.ONBOARD_CLIENT,
          method: "POST",
          body: formData,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        };
      },
      invalidatesTags: ["Onboarding"],
    }),

    getOnboardClient: builder.query<ClientOnboardingResponse, void>({
      query: () => API_ROUTES.USER.ONBOARD_CLIENT,
      providesTags: ["Onboarding"],
    }),

    getUserProfile: builder.query<IUser, void>({
      query: () => API_ROUTES.USER.PROFILE,
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<IUser, Partial<IUser>>({
      query: (body) => ({
        url: API_ROUTES.USER.PROFILE,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    deleteAccount: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: API_ROUTES.USER.DELETE_ACCOUNT,
        method: "DELETE",
      }),
    }),

    changePassword: builder.mutation<any, ChangePasswordRequest>({
      query: (body) => ({
        url: API_ROUTES.USER.CHANGE_PASSWORD,
        method: "POST",
        body,
      }),
    }),

    signOut: builder.mutation<{ success: boolean }, string | null>({
      query: (token) => ({
        url: API_ROUTES.USER.SIGNOUT,
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    }),

    checkUserExistence: builder.query<{ exists: boolean }, string>({
      query: (email) => API_ROUTES.USER.EXIST.replace("{email}", email),
    }),

    getMenopauseSymptoms: builder.query<SymptomsResponse, void>({
      query: () => API_ROUTES.MENOPAUSE.GET_SYMPTOMS,
      providesTags: ["Menopause"],
    }),

    submitMenopauseResults: builder.mutation<
      { success: boolean },
      MenopauseSubmissionRequest
    >({
      query: (body) => ({
        url: API_ROUTES.MENOPAUSE.POST_SYMPTOMS,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Menopause"],
    }),

    getMenopauseRecommendations: builder.query<RecommendationsResponse, void>({
      query: () => API_ROUTES.MENOPAUSE.GET_RECOMMENDATIONS,
      providesTags: ["Menopause"],
    }),

    referAFriend: builder.mutation<any, ReferFriendRequest>({
      query: (body) => ({
        url: API_ROUTES.USER.REFER_FRIEND,
        method: "POST",
        body,
      }),
    }),

    getReferralInvitation: builder.query<any, string>({
      query: (token) =>
        API_ROUTES.USER.GET_REFERRAL_INVITATION.replace("{token}", token),
    }),

    getOnboardingStatus: builder.query<OnboardingStatus, void>({
      query: () => API_ROUTES.USER.GET_ONBOARDING_STATUS,
    }),

    checkPendingInvite: builder.query<CheckInviteResponse, string>({
      query: (email) =>
        `${API_ROUTES.USER.CHECK_PENDING_INVITE}?email=${encodeURIComponent(email)}`,
    }),

    downloadProfilePhoto: builder.query<Blob, string>({
      async queryFn(filename) {
        try {
          const endpoint = API_ROUTES.USER.DOWNLOAD_PHOTO.replace(
            "{filename}",
            encodeURIComponent(filename)
          );

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}${endpoint}`,
            {
              headers: { Accept: "image/*" },
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }

          const blob = await response.blob();
          return { data: blob };
        } catch (error: any) {
          return { error };
        }
      },
    }),

    requestPasswordlessLogin: builder.mutation<any, PasswordlessLoginRequest>({
      query: (data) => ({
        url: API_ROUTES.USER.REQUEST_PASSWORDLESS_LOGIN,
        method: "POST",
        body: data,
      }),
    }),

    verifyPasswordlessLogin: builder.mutation<any, VerifyPasswordlessLogin>({
      query: (data) => ({
        url: API_ROUTES.USER.VERIFY_PASSWORDLESS_LOGIN,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useSetNewPasswordMutation,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useVerifyEmailPassMutation,
  useOnboardUserMutation,
  useUpdateUserMutation,
  useGetOnboardingUserQuery,
  useLazyGetOnboardingUserQuery,
  useOnboardClientMutation,
  useLazyGetOnboardClientQuery,
  useGetOnboardClientQuery,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
  useChangePasswordMutation,
  useSignOutMutation,
  useCheckUserExistenceQuery,
  useGetMenopauseSymptomsQuery,
  useSubmitMenopauseResultsMutation,
  useGetMenopauseRecommendationsQuery,
  useReferAFriendMutation,
  useGetReferralInvitationQuery,
  useGetOnboardingStatusQuery,
  useLazyGetOnboardingStatusQuery,
  useCheckPendingInviteQuery,
  useLazyCheckPendingInviteQuery,
  useDownloadProfilePhotoQuery,
  useLazyDownloadProfilePhotoQuery,
  useRequestPasswordlessLoginMutation,
  useVerifyPasswordlessLoginMutation,
} = userApi;
