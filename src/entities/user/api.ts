import { API_ROUTES, ApiService } from "shared/api";
import {
  ChangePasswordRequest,
  ClientOnboardingResponse,
  IRegisterUser,
  IUser,
  MenopauseSubmissionRequest,
  OnboardingStatus,
  RecommendationsResponse,
  ReferFriendRequest,
  SymptomsResponse,
  UserOnboardingInfo,
} from "./model";
import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";
import { FormState } from "entities/store/clientOnboardingSlice";

interface LoginCredentials {
  email: string;
  password: string;
}

interface IVerify {
  email: string;
  token: string;
}

interface AuthResponse {
  user: IUser;
  accessToken: string;
}

interface UserExistenceResponse {
  exists: boolean;
}

export class UserService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return ApiService.post<AuthResponse>(API_ROUTES.USER.LOGIN, credentials);
  }

  static async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string; email: string }> {
    return ApiService.post<{
      success: boolean;
      message: string;
      email: string;
    }>(API_ROUTES.USER.FORGOT_PASSWORD, { email });
  }

  static async setNewPassword(
    email: string,
    token: string,
    new_password: string
  ): Promise<{ message: string }> {
    return ApiService.post<{ message: string }>(
      API_ROUTES.USER.SET_NEW_PASSWORD,
      { email, token, new_password }
    );
  }

  static async registerUser(userInfo: IRegisterUser): Promise<any> {
    return ApiService.post<any>(API_ROUTES.USER.SIGNUP, userInfo);
  }

  static async verifyEmail({ email, token }: IVerify): Promise<AuthResponse> {
    return ApiService.post<AuthResponse>(API_ROUTES.USER.COMPLETE_SIGNUP, {
      email,
      token,
    });
  }

  static async verifyEmailPass({
    email,
    token,
  }: IVerify): Promise<AuthResponse> {
    return ApiService.post<AuthResponse>(API_ROUTES.USER.VERIFY_RESET_TOKEN, {
      email,
      token,
    });
  }

  static async onboardUser(
    data: CoachOnboardingState,
    photo?: File,
    licenseFiles: File[] = []
  ): Promise<any> {
    const formData = new FormData();

    formData.append("onboarding_data", JSON.stringify(data));

    if (photo) {
      formData.append("headshot", photo);
    }

    for (const file of licenseFiles) {
      if (file) {
        formData.append("license_files", file);
      }
    }

    const response = await ApiService.post<any>(
      API_ROUTES.USER.ONBOARD_USER,
      formData
    );

    return response;
  }

  static async updateUser(
    data: CoachOnboardingState,
    photo?: File,
    licenseFiles: File[] = []
  ): Promise<any> {
    const formData = new FormData();

    formData.append("onboarding_data", JSON.stringify(data));

    if (photo) {
      formData.append("headshot", photo);
    }

    for (const file of licenseFiles) {
      if (file) {
        formData.append("license_files", file);
      }
    }

    const response = await ApiService.put<any>(
      API_ROUTES.USER.ONBOARD_USER,
      formData
    );

    return response;
  }

  static async getOnboardingUser(): Promise<UserOnboardingInfo> {
    const response = await ApiService.get<UserOnboardingInfo>(
      API_ROUTES.USER.ONBOARD_USER
    );

    return response;
  }

  static async onboardClient(
    data: FormState,
    token: string | null
  ): Promise<{ message: string }> {
    const formData = new FormData();

    formData.append("onboarding_data", JSON.stringify(data));

    const response = await ApiService.post<string>(
      API_ROUTES.USER.ONBOARD_CLIENT,
      formData,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { message: response };
  }

  static async getOnboardClient(): Promise<ClientOnboardingResponse> {
    const response = await ApiService.get<ClientOnboardingResponse>(
      API_ROUTES.USER.ONBOARD_CLIENT
    );

    return response;
  }

  static async checkUserExistence(
    email: string
  ): Promise<UserExistenceResponse> {
    const endpoint = API_ROUTES.USER.EXIST.replace("{email}", email);
    return ApiService.get<UserExistenceResponse>(endpoint);
  }

  static async getUserProfile(): Promise<IUser> {
    return ApiService.get<IUser>(API_ROUTES.USER.PROFILE);
  }

  static async deleteAccount(): Promise<{ success: boolean }> {
    return ApiService.delete<{ success: boolean }>(
      API_ROUTES.USER.DELETE_ACCOUNT
    );
  }

  static async updateProfile(userData: Partial<IUser>): Promise<IUser> {
    return ApiService.put<IUser>(API_ROUTES.USER.PROFILE, userData);
  }

  static async signOut(token: string | null): Promise<{ success: boolean }> {
    return ApiService.post<{ success: boolean }>(
      API_ROUTES.USER.SIGNOUT,
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
  }

  static async getMenopauseSymptoms(): Promise<SymptomsResponse> {
    return ApiService.get<SymptomsResponse>(API_ROUTES.MENOPAUSE.GET_SYMPTOMS);
  }

  static async submitMenopauseResults(
    data: MenopauseSubmissionRequest
  ): Promise<{ success: boolean }> {
    return ApiService.post<{ success: boolean }>(
      API_ROUTES.MENOPAUSE.POST_SYMPTOMS,
      data
    );
  }

  static async getMenopauseRecommendations(): Promise<RecommendationsResponse> {
    return ApiService.get<RecommendationsResponse>(
      API_ROUTES.MENOPAUSE.GET_RECOMMENDATIONS
    );
  }

  static async changePassword(
    requestData: ChangePasswordRequest
  ): Promise<any> {
    return ApiService.post<any>(API_ROUTES.USER.CHANGE_PASSWORD, requestData);
  }

  static async downloadProfilePhoto(filename: string): Promise<Blob> {
    const endpoint = API_ROUTES.USER.DOWNLOAD_PHOTO.replace(
      "{filename}",
      encodeURIComponent(filename)
    );

    const res = await ApiService.get<Blob>(endpoint, {
      responseType: "blob" as const,
      headers: { Accept: "image/*" },
    });
    return (res as any).data ?? res;
  }

  static async referAFriend(data: ReferFriendRequest): Promise<any> {
    return ApiService.post<any>(API_ROUTES.USER.REFER_FRIEND, data);
  }

  static async getReferralInvitation(token: string): Promise<any> {
    const endpoint = API_ROUTES.USER.GET_REFERRAL_INVITATION.replace(
      "{token}",
      token
    );
    return ApiService.get<any>(endpoint);
  }

  static async getOnboardingStatus(): Promise<OnboardingStatus> {
    return ApiService.get<OnboardingStatus>(
      API_ROUTES.USER.GET_ONBOARDING_STATUS
    );
  }
}
