import { API_ROUTES, ApiService } from "shared/api";
import { IUser } from "./model";

interface LoginCredentials {
  email: string;
  password: string;
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
