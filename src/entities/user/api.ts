import { API_ROUTES, ApiService } from "shared/api";
import { IRegisterUser, IUser } from "./model";
import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";

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
  static async signUp(userData: IUser): Promise<AuthResponse> {
    return ApiService.post<AuthResponse>(API_ROUTES.USER.SIGNUP, userData);
  }

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

  static async registerUser(
    userInfo: IRegisterUser
  ): Promise<{ success: boolean }> {
    return ApiService.post<{ success: boolean }>(
      API_ROUTES.USER.SIGNUP,
      userInfo
    );
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
    token: string | null
  ): Promise<{ message: string }> {
    const formData = new FormData();

    formData.append("onboarding_data", JSON.stringify({ data }));

    const response = await ApiService.post<string>(
      API_ROUTES.USER.ONBOARD_USER,
      formData,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return { message: response };
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
}
