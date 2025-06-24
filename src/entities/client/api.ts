import { API_ROUTES, ApiService } from "shared/api";
import {
  ClientInvitationInfo,
  AcceptInvitePayload,
  AcceptInviteResponse,
} from "./model";

export class ClientService {
  static async getInvitationDetails(
    token: string
  ): Promise<ClientInvitationInfo> {
    const endpoint = API_ROUTES.CLIENT.GET_INVITATION_DETAILS.replace(
      "{token}",
      token
    );
    return ApiService.get<ClientInvitationInfo>(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async acceptCoachInvite(
    payload: AcceptInvitePayload
  ): Promise<AcceptInviteResponse> {
    return ApiService.post<AcceptInviteResponse>(
      API_ROUTES.CLIENT.ACCEPT_COACH_INVITE,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  static async getSharedContentById(contentId: string): Promise<any> {
    const endpoint = API_ROUTES.CLIENT.GET_SHARED_CONTENT_BY_ID.replace(
      "{content_id}",
      contentId
    );
    return ApiService.get<any>(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
