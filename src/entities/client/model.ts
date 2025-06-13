export interface ClientInvitationInfo {
  client: ClientDetailsForInvite;
  invitation: InvitationMetadata;
}

export interface ClientDetailsForInvite {
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  primary_health_challenge: string;
  focus_areas: string[];
}

export interface InvitationMetadata {
  permission_type: "independent" | "with_help";
  expires_at: string;
  practitioner_name: string;
}

export interface AcceptInvitePayload {
  token: string;
}

export interface AcceptInviteResponse {
  success: boolean;
  message: string;
}
