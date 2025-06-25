import { API_ROUTES, ApiService } from "shared/api";
import { UsersResponse } from "./model";

export class AdminService {
    static async getAllUsers(): Promise<UsersResponse> {
        return ApiService.get<UsersResponse>(API_ROUTES.ADMIN.GET_ALL_USERS);
    }
}
