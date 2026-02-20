# Tolu Health Frontend – Data & Architecture Documentation

## Purpose & Goals

Tolu Health Frontend is the client-facing application of the Tolu Health platform.  
Its purpose is to provide a seamless, secure, and responsive interface for:

- Clients tracking health, symptoms, and progress.
- Coaches managing clients, onboarding, and content.
- Admins monitoring users, feedback, and content moderation.

### Key Goals

- Enable **data-driven health coaching** through AI insights and user tracking.
- Maintain **high security and privacy standards** (HIPAA / SSL).
- Ensure **modular, scalable frontend architecture** using FSD.
- Support **multi-role access** (client, coach, admin) with shared components.

## Overview

This document provides a **complete overview of data flow, architecture, and API integration** between the Tolu Health frontend and backend services.

It explains how user data moves through the system, including:

- Authentication and onboarding
- API communication patterns (RTK Query)
- File uploads and streaming data
- AI and content modules
- Admin and notification management

The goal is to ensure **consistency, traceability, and compliance** across all layers of the platform.

## Architecture Overview

- React Components handle forms and trigger API mutations/queries.
- RTK Query manages data fetching, caching, and normalization.
- Backend API handles validation, authentication, and persistence.

## API Configuration

All network requests are handled through RTK Query’s fetchBaseQuery, configured in src/entities

- All requests use HTTPS (enforced via backend configuration).
- Authorization is automatically handled through prepareHeaders.
- Tokens are stored securely in Redux state and localStorage.

### Standard Response Models

All API responses follow standardized TypeScript interfaces for consistency:

**BaseResponse<T>** - Standard response wrapper for most endpoints:

```typescript
export interface BaseResponse<T> {
  status: string; // "success" | "error"
  message: string; // Human-readable status message
  data: T; // Actual response payload
  meta?: any; // Optional metadata
  timestamp?: string; // ISO 8601 timestamp
}
```

**PaginatedResponse<T>** - Used for paginated list endpoints:

```typescript
export interface PaginationMeta {
  total: number; // Total number of items
  limit: number; // Items per page
  offset: number; // Current offset
}

export interface PaginatedResponse<T> {
  message: string;
  data: T; // Array of items
  pagination: PaginationMeta;
}
```

**Example BaseResponse:**

```json
{
  "status": "success",
  "message": "User profile retrieved successfully",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "timestamp": "2026-02-12T10:30:00Z"
}
```

**Example PaginatedResponse:**

```json
{
  "message": "Clients retrieved successfully",
  "data": [
    { "id": "1", "name": "Client A" },
    { "id": "2", "name": "Client B" }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0
  }
}
```

**Important Notes on Response Formats:**

While most endpoints follow the `BaseResponse<T>` or `PaginatedResponse<T>` pattern, some endpoints have variations:

1. **Chat Messages** (`fetchChatMessages`): Returns `BaseResponse<FetchChatMessagesResponse>` where the data contains pagination fields

   ```json
   {
     "status": "success",
     "message": "Messages retrieved successfully",
     "data": {
       "messages": [...],
       "total": 100,
       "page": 1,
       "limit": 50,
       "has_next": true,
       "has_prev": false
     }
   }
   ```

2. **File Downloads**: Blob endpoints return binary data directly (Blob), not JSON responses

3. **Streaming Endpoints**: AI endpoints like `/ai-personalized-search/` and `/ai-coach-research/` return Server-Sent Events (SSE), not JSON

4. **Legacy Endpoints**: Some older endpoints may return direct arrays or objects without wrappers

5. **FormData Uploads**: Endpoints accepting `multipart/form-data` serialize JSON fields as strings within FormData

## Architecture Overview

User Interface (React Components)
↓
Redux Toolkit Slices / RTK Query Endpoints
↓
API Middleware (fetchBaseQuery)
↓
Backend REST API
↓
Database

## Project Configuration

| Environment | API Base URL              | Notes            |
| ----------- | ------------------------- | ---------------- |
| Staging     | https://vvitai.vercel.app | QA environment   |
| Production  | https://app.tolu.health/  | Live environment |

Environment variables are managed via `.env`:

### Tooling Overview

| Tool              | Scope                             | Notes                              |
| ----------------- | --------------------------------- | ---------------------------------- |
| React + Vite      | Frontend framework and build tool | Used for all UI rendering          |
| Redux Toolkit     | Global state management           | Centralized user/session data      |
| RTK Query         | API communication layer           | Handles all backend integration    |
| TailwindCSS       | UI design system                  | Shared theme and responsive layout |
| React Hook Form   | Form handling                     | Validation integrated with Zod     |
| Axios             | REST API requests                 | Used inside RTK Query baseQuery    |
| ESLint + Prettier | Code quality                      | Enforced via CI/CD pipeline        |

## Data Flow Documentation

## **Overview**

This document describes how **personal and sensitive user data** flows between the **Tolu Health frontend** and **backend API**.  
It focuses on authentication, onboarding, and health-related data, all managed through **RTK Query** with secure REST API calls.

All data interactions occur via the `userApi` slice src/entities/user/lib.ts.

Each request uses `fetchBaseQuery` with a dynamic `Authorization` header, automatically attaching the user’s JWT token stored in the Redux state (`RootState.user.token`).

## **Authentication & Token Handling**

### **Login**

User has two options:

### Login via email (Passwordless Flow):

- **Endpoint:** `POST /user/email-login`
- **Hook:** `useRequestPasswordlessLoginMutation`

**Request:**

```json
{
  "email": "user@example.com"
}
```

User receives verification code on his email and should type it on the page:

- **Endpoint:** `POST /user/verify-login`
- **Hook:** `useVerifyPasswordlessLoginMutation`

**Request:**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

And then he receives access token to log into his account

### Login with email and password:

- **Endpoint:** `POST /user/login`
- **Hook:** `useLoginMutation`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123",
      "first_name": "Jane",
      "last_name": "Doe",
      "name": "Jane Doe",
      "email": "user@example.com",
      "role": "coach"
    },
    "accessToken": "jwt_token_here"
  },
  "timestamp": "2026-02-12T10:30:00Z"
}
```

Frontend Action:
The setCredentials reducer stores both the user object and accessToken.
Future API calls automatically attach Authorization: Bearer <token>.

> **Note:** All authentication endpoints return responses wrapped in the `BaseResponse<T>` format, where `T` is the specific data type for that endpoint (e.g., login returns user + token, verification returns status confirmation).

## **Registration Flow**

### registerUser:

Firstly, user needs to fill the form on https://tolu.health/.

Endpoint: POST /access-request

Payload:

```json
{
  "first_name": "Jane Doe",
  "last_name": "Jane Doe",
  "email": "jane@example.com",
  "phone_number": "+123456789",
  "account_type": "Individual/Women"
}
```

Super admin can either deny it or approve.

Endpoint: PUT /admin/access-requests/{request_id}/approve
Hook: useApproveRequestMutation

Endpoint: PUT /admin/access-requests/{request_id}/deny
Hook: useDenyRequestMutation

After approve user receives OTP code which he need to pass on the /register page to be able to fill registration form.

Endpoint: POST /access-request/code-exist
Hook: useAccessCodeRequestMutation

```json
{
  "access_code": "123456"
}
```

Endpoint: POST /user/signup
Hook: useRegisterUserMutation

Payload:

```json
{
  "user": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "StrongPass123!",
    "phone_number": "+123456789",
    "roleID": 2,
    "country": "USA",
    "state": "CA"
  },
  "access_code": "123456"
}
```

User receives verification letter on his email with instructions and link.

### verifyEmail:

Endpoint: POST /user/complete-signup
Hook: useVerifyEmailMutation

Payload:

```json
{
  "email": "jane@example.com",
  "token": "verification_token_here"
}
```

## **Coach Onboarding:**

### onboardUser

User goes to the onboarding flow after registration and verification of the email.
Uploads both structured JSON and media files using FormData.

Endpoint: POST /coach/onboarding
Hook: useOnboardUserMutation

Payload type: CoachOnboardingState + optional files (photo, licenseFiles[])

Flow:

The onboarding_data JSON is serialized and appended to a FormData object.

headshot and license_files are appended as binary.

The JWT token is attached via prepareHeaders.

Backend validates and stores all data securely.

Payload:
multipart/form-data

```json
{
  "onboarding_data": {
    "agreements": { "terms_of_use": true, "confidentiality": true },
    "practitioner_info": { "school": "Stanford", "types": ["nutritionist"] },
    "business_setup": { "practice_software": "Notion" }
  },
  "headshot": (binary file),
  "license_files": (binary files)
}
```

## **Client Onboarding**

### onboardClient

User goes to the onboarding flow after registration and verification of the email.
Uploads both structured JSON and media files using FormData.

Endpoint: POST /client/onboarding
Hook: useOnboardClientMutation

Payload:

```json
{
  "onboarding_data": {
    "basic_info": {
      "menopause_status": "postmenopausal",
      "date_of_birth": "1975-03-12"
    },
    "health_lifestyle": {
      "health_conditions": ["hypertension"],
      "stress_levels": "moderate",
      "physical_activity": "3x/week"
    },
    "goals_values": {
      "main_goal": "reduce stress",
      "symptoms_severity": { "hot_flashes": 3 }
    }
  }
}
```

We use that onboarding info to show in coach and client profiles and client's health history. No payload needed, only token.

## **Forgot password flow:**

### forgotPassword

To change password user clicks 'Forgot password' button, sends his email and receives a link.

Endpoint: POST /user/forgot-password
Hook: useForgotPasswordMutation

Then sets a new password

Payload:

```json
{
  "email": "jane@example.com",
  "token": "verification_token_here",
  "new_password": "newPassword12345"
}
```

## **Sign out flow:**

### signout

Endpoint: POST /user/signout
Hook: useSignOutMutation

## **User profile management:**

We request onboarding and profile info to show in coach and client profiles

### **Coach Profile Data**

#### **Get Onboarding User**

- **Endpoint:** `GET /coach/onboarding`
- **Hook:** `useGetOnboardingUserQuery`
- **Returns:** `UserOnboardingInfo`

**Purpose:**  
Fetches the coach’s full onboarding progress and professional profile information, including agreements, credentials, business setup, and tools used in practice.

**Response Example:**

```json
{
  "onboarding": {
    "id": "onb_001",
    "agreements": {
      "coach_admin_privacy": true,
      "independent_contractor": true,
      "content_licensing": false,
      "affiliate_terms": true,
      "confidentiality": true,
      "terms_of_use": true,
      "media_release": true
    },
    "practitioner_info": {
      "types": ["nutritionist"],
      "niches": ["weight management"],
      "school": "Stanford University",
      "license_files": ["license_123.pdf"],
      "recent_clients": "Corporate wellness clients",
      "target_clients": "Women over 40",
      "uses_labs_supplements": true
    },
    "business_setup": {
      "challenges": ["client retention"],
      "uses_ai": "yes",
      "practice_software": "Notion",
      "supplement_method": "Direct order"
    },
    "client_tools": {
      "biometrics": true,
      "lab_ordering": false,
      "supplement_ordering": true
    }
  },
  "profile": {
    "basic_info": {
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane@example.com",
      "dob": "1985-05-16",
      "location": "New York",
      "timezone": "America/New_York",
      "roleID": 2,
      "roleName": "Coach",
      "gender": "Female"
    },
    "expertise": ["Nutrition", "Stress Management"],
    "credentials": {
      "verified": ["CNS", "MS Nutrition"],
      "years_experience": 10,
      "certifications": ["Functional Medicine Certification"]
    },
    "story": "Helping women improve their health through personalized nutrition.",
    "content_topics": ["Nutrition", "Hormonal Health"]
  },
  "onboarding_completed": true
}
```

### **Client Profile Data**

#### **Get Client Profile**

- **Endpoint:** `GET /client/profile`
- **Hook:** `useGetClientProfileQuery`
- **Returns:** `Client`

**Purpose:**  
Retrieves the client’s personal and account information to display on their profile and for use in connected dashboards.

**Response Example:**

```json
{
  "id": "client_001",
  "first_name": "Anna",
  "last_name": "Smith",
  "name": "Anna Smith",
  "email": "anna@example.com",
  "phone": "+1234567890",
  "dob": "1988-04-12",
  "photo_url": "https://cdn.toluhealth.com/photos/client_001.jpg",
  "timezone": "Europe/London",
  "gender": "Female",
  "roleID": 3,
  "roleName": "Client",
  "created_at": "2024-01-15T10:22:00Z",
  "updated_at": "2025-01-03T09:10:00Z",
  "last_symptoms_date": "2025-01-01T00:00:00Z",
  "calculated_age": 37
}
```

#### **Get Comprehensive Client**

- **Endpoint:** `GET /coach/clients/{id}/comprehensive`
- **Hook:** `useGetComprehensiveClientQuery`

**Purpose:**  
Retrieves the complete health, goal, and history profile of a client. This view consolidates all relevant records into a single structured dataset.

**Response Example:**

```json
{
  "client_id": "client_123",
  "profile_summary": {
    "health_goals": ["Reduce stress", "Improve sleep"],
    "symptom_trends": ["Fatigue", "Anxiety"],
    "tracker_overview": { "sleep_hours_avg": 7.5, "energy_avg": "medium" }
  },
  "recommendations": ["Continue mindfulness exercises", "Increase hydration"]
}
```

#### **Get Onboarding Client**

- **Endpoint:** `GET /client/onboarding`
- **Hook:** `useGetOnboardClientQuery`
- **Returns:** `ClientOnboardingResponse`

**Purpose:**  
Provides structured onboarding information for the client, used to build health profiles and visualize trends over time.

**Response Example:**

```json
{
  "profile": {
    "basic_info": {
      "menopause_status": "postmenopausal",
      "date_of_birth": "1975-03-12"
    },
    "health_lifestyle": {
      "health_conditions": ["hypertension"],
      "stress_levels": "moderate",
      "weekly_meal_choice": "balanced",
      "support_network": ["family", "friends"],
      "physical_activity": "3x/week",
      "sleep_quality": "good",
      "hydration_levels": "adequate"
    },
    "goals_values": {
      "main_goal": "reduce stress",
      "symptoms_severity": {
        "hot_flashes": 3,
        "fatigue": 2
      }
    }
  }
}
```

### **Update profile:**

**Endpoint:** `PUT /client/profile`  
**Hook:** `useUpdateUserProfileMutation`  
**Payload Type:** `UserProfileUpdate` + optional photo (`File | null`)

**Purpose:**  
Allows clients to update their personal information (name, email, phone, DOB, timezone, gender) and optionally upload or change a profile photo.

**Implementation Overview:**

1. The mutation constructs a `FormData` object.
2. Profile fields are serialized into JSON and appended as `profile_data`.
3. If a photo is provided, it’s added as binary under the `photo` field.
4. The request is sent as `multipart/form-data` for secure file and data upload.
5. The backend validates, updates, and returns the latest profile info.

**Request Example:**
multipart/form-data

```json
{
  "profile_data": {
    "first_name": "Anna",
    "last_name": "Smith",
    "email": "anna.smith@example.com",
    "phone": "+1234567890",
    "dob": "1988-04-12",
    "timezone": "Europe/London",
    "gender": "female"
  },
  "photo": (binary file)
}
```

### **Update Coach Profile**

**Endpoint:** `PUT /coach/onboarding`  
**Hook:** `useUpdateUserMutation`  
**Payload Type:** `CoachOnboardingState` + optional `photo`, `licenseFiles[]`

**Purpose:**  
Allows a coach to update their **personal profile**, **professional details**, and **certification documents**.  
The endpoint supports both structured profile updates and file uploads in a single secure request.

**Implementation Overview**

1. The mutation creates a `FormData` object.
2. The `onboarding_data` JSON payload is appended as a string.
3. The profile photo (`headshot`) and license files (`license_files`) are appended as binary.
4. The request is sent as `multipart/form-data` via HTTPS.
5. The backend validates and saves the updated onboarding information.

**Request Example:**
multipart/form-data

```json
{
"onboarding_data": {
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane.doe@example.com",
    "gender": "female",
    "school": "Stanford University",
    "years_experience": 8,
    "certifications": ["CNS", "Functional Medicine Certification"],
    "expertise_areas": ["Nutrition", "Hormonal Health"],
    "languages": ["English", "Spanish"],
    "bio": "Helping women achieve balanced health through holistic nutrition.",
    "terms_of_use_accepted": true,
    "confidentiality_accepted": true
  },
  "headshot": (binary file),
  "license_files": (binary file array),
  "photo": (binary file)
}
```

### **Get User Profile (Generic)**

**Endpoint:** `GET /user/profile`  
**Hook:** `useGetUserProfileQuery`

**Purpose:**  
Retrieves the current authenticated user's profile information (works for all roles).

**Response:**

```json
{
  "status": "success",
  "message": "User profile retrieved successfully",
  "data": {
    "id": "user_123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "client",
    "created_at": "2026-01-01T10:00:00Z"
  }
}
```

### **Update Profile (Generic)**

**Endpoint:** `PUT /user/profile`  
**Hook:** `useUpdateProfileMutation`

**Purpose:**  
Updates user profile information for any authenticated user.

**Request Example:**
multipart/form-data with profile_data JSON and optional photo

### **Change Password (User)**

**Endpoint:** `POST /user/change-password`  
**Hook:** `useChangePasswordMutation`

**Purpose:**  
Allows any authenticated user to change their password.

**Request Example:**

```json
{
  "old_password": "OldPass123!",
  "new_password": "NewPass123!"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

### **Delete Account**

**Endpoint:** `DELETE /user/account`  
**Hook:** `useDeleteAccountMutation`

**Purpose:**  
Allows a user to permanently delete their own account.

**Request:** Empty body or user confirmation token

**Response:**

```json
{
  "status": "success",
  "message": "Account deleted successfully"
}
```

### **Check User Existence**

**Endpoint:** `GET /user/check-existence?email={email}`  
**Hook:** `useCheckUserExistenceQuery`

**Purpose:**  
Checks if a user with the given email already exists in the system.

**Response:**

```json
{
  "success": true,
  "exists": true
}
```

### **Download Profile Photo**

**Endpoint:** `GET /uploads/{user_id}/profile_photo.{ext}`  
**Hook:** `useDownloadProfilePhotoQuery`

**Purpose:**  
Downloads a user's profile photo.

**Returns:** Binary image data (Blob)

### **Super Admin Profile Data**

Super admin has abillity to change his password on the profile page.

#### **Change password**

- **Endpoint:** `POST /admin/change-own-password`
- **Hook:** `useChangeOwnPasswordMutation`

**Request Example:**

```json
{
  "old_password": "Qasdf12345678!",
  "new_password": "Aasdf12345678!"
}
```

## **Invitation Requests Overview:**

These flows are part of the user onboarding process and allow clients to join Tolu Health through coach invitations or referral links.
They are all managed via RTK Query endpoints defined under userApi and clientApi.

### **Check Pending Invite**

**Endpoint:** `GET /client/check-pending-invite`  
**Hook:** `useCheckPendingInviteQuery`  
**Payload Type:** `CheckInviteResponse`

**Purpose:**  
Determines if a user has a pending invitation before registration.

**Response Example:**

```json
{
  "has_pending_invite": true,
  "email": "user@example.com",
  "user_exists": false,
  "token": "invite_token_here"
}
```

### **Get Referral Invitation**

**Endpoint:** `GET /referral/invitation-details/{token}`  
**Hook:** `useLazyGetReferralInvitationQuery`

**Purpose:**  
Retrieves details of a referral invitation sent to a potential client.

### **Get Client Invitation Details**

**Endpoint:** `GET /client/invitation-details/{token}`  
**Hook:** `useGetInvitationDetailsQuery`  
**Payload Type:** `ClientInvitationInfo`

**Purpose:**  
Fetches client invitation metadata, including practitioner information and invitation expiration.

**Response Example:**

```json
{
  "client": {
    "full_name": "Anna Smith",
    "email": "anna@example.com",
    "phone_number": "+123456789",
    "date_of_birth": "1990-04-12",
    "primary_health_challenge": "Stress",
    "focus_areas": ["Nutrition", "Hormone Balance"]
  },
  "invitation": {
    "permission_type": "shared_profile",
    "expires_at": "2025-06-01T12:00:00Z",
    "practitioner_name": "Dr. Jane Doe"
  }
}
```

### **Accept Coach Invite**

**Endpoint:** `POST /client/accept-coach-invite`  
**Hook:** `useAcceptCoachInviteMutation`  
**Request Type:** `AcceptInvitePayload`

**Purpose:**  
Completes the invitation process for a client and establishes a connection with the inviting coach.

**Request Example:**

```json
{
  "token": "invite_token_here"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Invitation accepted successfully"
}
```

The Register component dynamically handles invitations during user registration based on the presence of a token in the URL.

**Logic Summary**

1. Detect token in URL params (/register/:token).
2. Attempt to fetch client invitation details via useGetInvitationDetailsQuery.
3. If client invite not found, attempt referral invitation via useLazyGetReferralInvitationQuery.
4. Depending on success:

- Pre-fill registration form with invitation data.
- Automatically accept invite if already registered.
- Redirect to login or dashboard if invite already accepted.

5. If no token, standard registration flow applies.

### **Request New Invite**

**Endpoint:** `POST /client/request-invite`  
**Hook:** `useRequestNewInviteMutation`

**Purpose:**  
Allows a prospective client to request a new invite from a coach or the Tolu Health admin team.

**Request Example:**

```json
{
  "email": "anna@example.com",
  "coach_name": "Jane Doe",
  "message": "I would like to start working with Coach Jane on nutrition goals."
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Invite request submitted successfully."
}
```

### **Decline Coach Invite**

**Endpoint:** `POST /client/decline-coach-invite`  
**Hook:** `useDeclineCoachInviteMutation`

**Purpose:**  
Allows a client to decline a coach invitation.

**Request Example:**

```json
{
  "invitation_token": "inv_token_123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Invitation declined successfully",
  "data": {
    "invitation_id": "inv_001",
    "status": "declined"
  }
}
```

### **Get Shared Content by ID**

**Endpoint:** `GET /client/shared-content/{content_id}`  
**Hook:** `useGetSharedContentByIdQuery`

**Purpose:**  
Retrieves shared content that a coach has shared with the client.

**Response:**

```json
{
  "status": "success",
  "message": "Shared content retrieved successfully",
  "data": {
    "content_id": "content_001",
    "title": "Nutrition Guide",
    "shared_by": "coach_001",
    "shared_at": "2026-01-15T10:00:00Z"
  }
}
```

### **Get Library Content**

**Endpoint:** `GET /client/library`  
**Hook:** `useGetLibraryContentQuery`

**Purpose:**  
Retrieves all content available in the client's personal library.

**Response:**

```json
{
  "status": "success",
  "message": "Library content retrieved successfully",
  "data": [
    {
      "id": "content_001",
      "title": "Stress Management Tips",
      "type": "article",
      "added_at": "2026-01-10T10:00:00Z"
    }
  ]
}
```

### **Get Client Profile (Client View)**

**Endpoint:** `GET /client/profile`  
**Hook:** `useGetClientProfileQuery`

**Purpose:**  
Retrieves the current client's own profile information.

**Response:**

```json
{
  "status": "success",
  "message": "Client profile retrieved successfully",
  "data": {
    "id": "client_123",
    "first_name": "Anna",
    "last_name": "Smith",
    "email": "anna@example.com"
  }
}
```

### **Get Coaches**

**Endpoint:** `GET /client/coaches`  
**Hook:** `useGetCoachesQuery`

**Purpose:**  
Retrieves all coaches currently working with the client.

**Response:**

```json
{
  "status": "success",
  "message": "Coaches retrieved successfully",
  "data": [
    {
      "id": "coach_001",
      "name": "Dr. Jane Smith",
      "email": "jane@example.com",
      "specialty": "Nutritionist"
    }
  ]
}
```

### **Get Coach Profile (Client View)**

**Endpoint:** `GET /client/coach/{coach_id}/profile`  
**Hook:** `useGetCoachProfileQuery`

**Purpose:**  
Retrieves a specific coach's profile from the client's perspective.

**Response:**

```json
{
  "status": "success",
  "message": "Coach profile retrieved successfully",
  "data": {
    "id": "coach_001",
    "name": "Dr. Jane Smith",
    "specialty": "Nutritionist",
    "bio": "15 years experience in holistic health"
  }
}
```

### **Download Coach Photo**

**Endpoint:** `GET /client/coach/{coach_id}/photo/{filename}`  
**Hook:** `useDownloadCoachPhotoQuery`

**Purpose:**  
Downloads a coach's profile photo.

**Returns:** Binary image data (Blob)

### **Get Pending Invitations**

**Endpoint:** `GET /client/pending-invitations`  
**Hook:** `useGetPendingInvitationsQuery`

**Purpose:**  
Retrieves all pending coach invitations for the client.

**Response:**

```json
{
  "status": "success",
  "message": "Pending invitations retrieved successfully",
  "data": [
    {
      "invitation_id": "inv_001",
      "coach_name": "Dr. Jane Smith",
      "invited_at": "2026-01-10T10:00:00Z",
      "status": "pending"
    }
  ]
}
```

### **Update User Profile (Client)**

**Endpoint:** `PUT /client/profile`  
**Hook:** `useUpdateUserProfileMutation`

**Purpose:**  
Updates the client's profile information including photo upload.

**Request Example:**
multipart/form-data with profile_data JSON and optional profile_photo file

**Response:**

```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "updated_at": "2026-02-12T10:30:00Z"
  }
}
```

## **AI-Powered Content and Search Flows:**

This section describes how the AI content creation and search functionality works within the Tolu Health Frontend.
All AI-related requests send FormData payloads with optional files (images, PDFs, audio) and stream back Server-Sent Events (SSE) in real time.

### **Client AI Content Generation**

**Endpoint:** `POST /ai-personalized-search/`  
**Class / Method:** `ClientService.aiPersonalizedSearch(chatMessage, referenceContentId, images?, pdf?)`

**Purpose:**  
Allows clients to generate AI-personalized responses or insights based on a message and reference content.
Supports attaching multiple images and a single PDF.

**Request Example:**
multipart/form-data

```json
{
  "chat_message": "How can I improve my sleep based on this report?",
  "reference_content_id": "content_123",
  "images": [ (binary files) ],
  "pdf": (binary file)
}
```

**Response Handling:**

1. If the backend returns standard JSON, the client calls onComplete(result).
2. If the backend streams Server-Sent Events (SSE), the frontend decodes each JSON data: chunk in real time, invoking:

- onChunk(data) for incremental updates,
- onComplete({ folderId, documentId, chatId }) after the stream ends.

### **Coach AI Learning & Knowledge Search**

**Endpoints:** `POST /coach/ai-learning-search`, `POST /coach/ai-learning-card-search`  
**Class / Method:** `CoachService.aiLearningSearch()`, `CoachService.aiLearningCardSearch()`

**Purpose:**  
Used by coaches to generate AI learning materials or knowledge cards.
Supports uploading images, PDFs, or library references, and can optionally target a specific client.

**Request Example:**
multipart/form-data

```json
{
  "chat_message": {
    "user_prompt": "Create a summary for menopause nutrition best practices",
    "is_new": true,
    "chat_title": "Nutrition Tips",
    "instructions": "Keep it professional"
  },
  "folder_id": "fld_001",
  "client_id": "client_123",
  "library_files": ["lib_doc_001", "lib_doc_002"],
  "files": [ (binary images or PDFs) ]
}
```

### **Coach AI Search and Research**

**Endpoints:** `POST /ai-search/`, `POST /ai-content-search/`, `POST /ai-coach-research/`, `POST /ai-coach-assistant`  
**Class / Method:** `SearchService.aiSearchStream()`, `SearchService.aiCoachResearchStream()`

**Purpose:**  
Handles streaming AI searches and research generation.
Used both by clients (for AI insights) and coaches (for structured research across client data or library files).

**Request Example:**
multipart/form-data

```json
{
  "chat_message": "Summarize this client’s stress management progress.",
  "client_id": "client_001",
  "content_id": "content_456",
  "files": [ (binary images / PDF / audio) ],
  "library_files": ["lib_001", "lib_002"]
}

```

**File Validation and Limits:**
Before upload, files are validated via SearchService.prepareFilesForSearch():

- Allowed types: jpeg, png, webp, gif, pdf, doc, docx, txt
- Max file size: 30 MB
- Max image count: 10
- Unsupported or oversize files are skipped with descriptive error messages.

### **Get Search History**

**Endpoint:** `GET /searched-result/history`  
**Hook:** `useGetSearchHistoryQuery`

**Purpose:**  
Retrieves the user's search history with optional filtering by client or managed client.

**Request Example:**

```json
{
  "client_id": "client_123",
  "managed_client_id": "client_456"
}
```

**Response Example:**

```json
{
  "status": "success",
  "message": "Search history retrieved successfully",
  "data": [
    {
      "id": "search_001",
      "query": "stress management techniques",
      "timestamp": "2026-02-12T10:00:00Z",
      "results_count": 15
    }
  ]
}
```

### **Get Session Details**

**Endpoint:** `GET /session/{chat_id}`  
**Hook:** `useGetSessionQuery`

**Purpose:**  
Retrieves detailed information about an AI search or coaching session, including search results and conversation history.

**Response Example:**

```json
{
  "status": "success",
  "message": "Session retrieved successfully",
  "data": {
    "session_id": "session_001",
    "chat_id": "chat_001",
    "search_results": [
      {
        "title": "Stress Management Guide",
        "snippet": "Effective techniques for managing stress...",
        "url": "https://example.com/stress-guide"
      }
    ],
    "created_at": "2026-02-10T09:00:00Z"
  }
}
```

### **AI Coach Assistant (Streaming)**

**Endpoint:** `POST /ai-coach-assistant/`  
**Purpose:**  
Streaming AI assistant for coaches with enhanced context and capabilities.

**Request Example:**
multipart/form-data with chat_message, optional files

**Response:**  
Server-Sent Events (SSE) stream with incremental AI-generated content.

## **Content and Document Management Flows:**

This section explains how content (articles, posts, quizzes, and learning materials) and documents are retrieved, duplicated, updated, and shared between the Tolu Health frontend and backend API.

### **Get Content**

**Endpoint:** `GET /content/{id}`  
**Hook:** `useGetContentQuery`

**Purpose:**  
Retrieve full details of a content item.

**Request Example:**

```json
{
  "id": "content_001"
}
```

### **Duplicate Content**

**Endpoint:** `POST /content/duplicate/{contentId}`  
**Hook:** `useDuplicateContentByIdMutation`

**Purpose:**  
Create a copy of an existing content item.

**Request Example:**

```json
{
  "contentId": "content_001"
}
```

### **Edit Content**

**Endpoint:** `PUT /content/edit`  
**Hook:** `useEditContentMutation`

**Purpose:**  
Update the content’s title or text body.

**Request Example:**

```json
{
  "content_id": "content_001",
  "new_title": "Updated Nutrition Guide",
  "new_content": "Revised content body here...",
  "new_query": "nutrition sleep health"
}
```

### **Update Content Status**

**Endpoint:** `POST /content/{content_id}/status`  
**Hook:** `useUpdateStatusMutation`

**Purpose:**  
Mark content as read, archived, or update reading progress.

**Request Example:**

```json
{
  "content_id": "content_001",
  "status_data": {
    "status": "currently_reading",
    "current_card_number": "3"
  }
}
```

### **Get Quiz Score**

**Endpoint:** `GET /content/{content_id}/quiz-score`  
**Hook:** `useGetQuizScoreQuery`

**Purpose:**  
Retrieve a user’s quiz performance for a content item.

**Request Example:**

```json
{
  "content_id": "content_001"
}
```

### **Add Content Feedback**

**Endpoint:** `POST /content/feedback`  
**Hook:** `useAddContentFeedbackMutation`

**Purpose:**  
Submit satisfaction, comments, and preferences for a content item.

**Request Example:**

```json
{
  "source_id": "content_001",
  "satisfaction_score": "5",
  "comments": "Extremely helpful!",
  "content_preference": "video",
  "location": "New York",
  "feedback_type": "engagement",
  "membership_type": "premium",
  "severity": "low",
  "device": "desktop"
}
```

### **Add Hashtags**

**Endpoint:** `POST /content/hashtags`  
**Hook:** `useAddHashtagsMutation`

**Purpose:**  
Add new hashtags to a content item.

**Request Example:**

```json
{
  "content_id": "content_001",
  "hashtags": ["wellness", "nutrition"]
}
```

### **Delete Hashtags**

**Endpoint:** `DELETE /content/hashtags`  
**Hook:** `useDeleteHashtagsMutation`

**Purpose:**  
Remove hashtags associated with a content item.

**Request Example:**

```json
{
  "content_id": "content_001",
  "hashtags": ["wellness", "nutrition"]
}
```

### **Get Content Hashtags**

**Endpoint:** `GET /content/{content_id}/hashtags`  
**Hook:** `useGetContentHashtagsQuery`

**Purpose:**  
Retrieve all hashtags associated with a given content item.

**Request Example:**

```json
{
  "content_id": "content_001"
}
```

### **Get Content with Similar Tags**

**Endpoint:** `POST /content/similar`  
**Hook:** `useGetContentWithSimilarTagsMutation`

**Purpose:**  
Fetch related content items with overlapping hashtags.

**Request Example:**

```json
{
  "content_id": "content_001"
}
```

### **Get All Hashtags**

**Endpoint:** `GET /content/all-hashtags`  
**Hook:** `useGetAllHashtagsQuery`

**Purpose:**  
Retrieve all available hashtags in the platform.

### **Get Creator Profile**

**Endpoint:** `GET /content/creator/{creator_id}`  
**Hook:** `useGetCreatorProfileQuery`

**Purpose:**  
Retrieve detailed information about a content creator.

**Request Example:**

```json
{
  "creator_id": "coach_123"
}
```

### **Get Creator Photo**

**Endpoint:** `GET /content/creator/{creator_id}/photo/{filename}`  
**Hook:** `useGetCreatorPhotoQuery`

**Purpose:**  
Download a creator’s profile photo as a Blob.

**Request Example:**

```json
{
  "id": "coach_123",
  "filename": "profile_pic.jpg"
}
```

### **Share Content via Email**

**Endpoint:** `POST /content/share/email`  
**Hook:** `useShareEmailMutation`

**Purpose:**  
Send a content item to an external recipient by email.

**Request Example:**

```json
{
  "content_id": "content_001",
  "recipient_email": "client@example.com",
  "personal_message": "Thought you might find this useful!"
}
```

### **Share Content with Coach**

**Endpoint:** `POST /content/share/coach`  
**Hook:** `useShareCoachMutation`

**Purpose:**  
Share a content item between client and coach within the platform.

**Request Example:**

```json
{
  "content_id": "content_001",
  "coach_id": "coach_789",
  "message": "Please review this learning material."
}
```

### **Update Library Content Status**

**Endpoint:** `PUT /content/library-status`  
**Hook:** `useUpdateContentStatusMutation`

**Purpose:**  
Update moderation or review status for library-level content.

**Request Example:**

```json
{
  "id": "content_001",
  "status": "approved",
  "reviewer_comment": "Reviewed and verified."
}
```

### **Get Document by ID**

**Endpoint:** `GET /documents/{id}`  
**Hook:** `useGetDocumentByIdQuery`

**Purpose:**  
Retrieve complete document details including metadata, sharing info.

**Request Example:**

```json
{
  "id": "doc_001"
}
```

**Response example**

```json
{
  "id": "doc_001",
  "title": "Understanding Hormone Cycles",
  "query": "hormone cycles",
  "creator_name": "Dr. Jane Doe",
  "original_folder_id": "fld_05",
  "shared_with": {
    "total_shares": 3,
    "clients": [{ "name": "Anna Smith", "status": "accepted" }]
  },
  "revenue_generated": "340.00",
  "read_count": 58,
  "saved_count": 24,
  "feedback_count": "5",
  "status": "active",
  "rating": 4.8
}
```

## **Chat and Messaging Flows:**

This section explains how chat data, messages, files, and notes are managed between the Tolu Health frontend and backend API.
All interactions are handled via the chatApi slice (src/entities/chat/lib.ts), using RTK Query for secure, token-authenticated communication.

### **Fetch All Chats**

**Endpoint:** `GET /chat/all`  
**Hook:** `useFetchAllChatsQuery`

**Purpose:**  
Fetches all chat conversations (1:1 and group chats) for the logged-in user.

**Response Example:**

```json
[
  {
    "id": "chat_001",
    "name": "Wellness Coaching",
    "avatar_url": "avatar_123.jpg",
    "type": "group",
    "lastMessageAt": "2025-01-03T10:15:00Z",
    "unreadCount": 2,
    "lastMessage": {
      "id": "msg_123",
      "content": "See you tomorrow!",
      "created_at": "2025-01-03T10:14:00Z"
    },
    "participants": [
      { "id": "user_1", "name": "Jane Doe" },
      { "id": "user_2", "name": "Anna Smith" }
    ]
  }
]
```

### **Fetch Chat Details**

**Endpoint:** `GET /chat/{chat_id}`  
**Hook:** `useFetchChatDetailsByIdQuery`

**Purpose:**  
Retrieves full metadata for a chat, including participants, description, and creation info.

**Response Example:**

```json
{
  "chat_id": "chat_001",
  "name": "Wellness Coaching",
  "description": "Private chat for stress management program",
  "avatar_url": "group_123.jpg",
  "participants": [
    { "user": { "id": "user_1", "name": "Jane Doe" }, "role": "coach" },
    { "user": { "id": "user_2", "name": "Anna Smith" }, "role": "client" }
  ],
  "created_by": "user_1",
  "created_at": "2024-12-28T09:00:00Z",
  "updated_at": "2025-01-03T10:20:00Z"
}
```

### **Fetch Chat Messages**

**Endpoint:** `GET /chat/{chat_id}/messages`  
**Hook:** `useFetchChatMessagesQuery`

**Purpose:**  
Fetches paginated messages for a specific chat.

**Request Example:**

```json
{
  "chatId": "chat_001",
  "page": 1,
  "limit": 50
}
```

**Response Example:**

```json
{
  "messages": [
    {
      "id": "msg_123",
      "chat_id": "chat_001",
      "content": "Hello, how are you?",
      "created_at": "2025-01-03T09:00:00Z",
      "sender": { "id": "user_1", "name": "Jane Doe" }
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 50,
  "has_next": false
}
```

### **Send Message**

**Endpoint:** `POST /chat/send-message`  
**Hook:** `useSendMessageMutation`

**Purpose:**  
Sends a text message or reply to a specific chat or target user.

**Request Example:**

```json
{
  "chat_id": "chat_001",
  "content": "Good morning!",
  "message_type": "text"
}
```

**Response Example:**

```json
{
  "id": "msg_789",
  "chat_id": "chat_001",
  "content": "Good morning!",
  "sender": { "id": "user_1", "name": "Jane Doe" },
  "created_at": "2025-01-03T09:10:00Z"
}
```

### **Delete Message**

**Endpoint:** `DELETE /chat/{chat_id}/message/{message_id}`  
**Hook:** `useDeleteMessageMutation`

**Purpose:**  
Deletes a specific message from a chat.

### **Create Group Chat**

**Endpoint:** `POST /chat/group`  
**Hook:** `useCreateGroupChatMutation`

**Purpose:**  
Creates a new group chat with optional avatar image.

**Request Example:**
multipart/form-data

```json
{
  "request": {
    "name": "Nutrition Team Chat",
    "participant_ids": ["user_1", "user_2"],
    "description": "Team communication channel"
  },
  "avatar_image": (binary file)
}
```

### **Update Group Chat**

**Endpoint:** `PUT /chat/{chat_id}/update`  
**Hook:** `useUpdateGroupChatMutation`

**Purpose:**  
Updates group name, description, participants, or avatar.

### **Upload Chat File**

**Endpoint:** `POST /chat/{chat_id}/upload-file`  
**Hook:** `useUploadChatFileMutation`

**Purpose:**  
Uploads a file (image, PDF, or document) to a chat.

**Request Example:**
multipart/form-data

```json
{
  "file": (binary file),
  "library_files": ["lib_doc_001"]
}
```

**Response Example:**

```json
{
  "success": true,
  "file_url": "uploads/chat_001/file_123.pdf",
  "file_name": "Report.pdf",
  "file_size": 204800,
  "file_type": "application/pdf"
}
```

### **Fetch Chat Files**

**Endpoint:** `GET /chat/{chat_id}/files`  
**Hook:** `useFetchAllFilesByChatIdQuery`

**Purpose:**  
Retrieves paginated list of shared files in a chat.

### **Download Uploaded Chat File**

**Endpoint:** `GET /chat/uploaded-file/{filename}`  
**Hook:** `useGetUploadedChatFileUrlQuery`

**Purpose:**  
Downloads or previews uploaded chat file.

### **Send Chat Note**

**Endpoint:** `POST /chat/note`  
**Hook:** `useSendChatNoteMutation`

**Purpose:**  
Sends a structured note or document in chat (e.g., session summary or recommendations).

**Request Example:**
multipart/form-data

```json
{
  "note_data": {
    "chat_id": "chat_001",
    "title": "Session Summary",
    "content": "We discussed nutrition goals and next steps."
  },
  "file": (binary PDF)
}
```

### **Fetch All Chat Notes**

**Endpoint:** `GET /chat/{chat_id}/notes`  
**Hook:** `useGetAllChatNotesQuery`

**Purpose:**  
Retrieves all notes attached to a chat.

### **Update Chat Note**

**Endpoint:** `PUT /chat/note/{note_id}`  
**Hook:** `useUpdateChatNoteMutation`

**Purpose:**  
Edits an existing chat note or updates its attached file.

### **Delete Chat Note**

**Endpoint:** `DELETE /chat/note/{note_id}`  
**Hook:** `useDeleteChatNoteMutation`

**Purpose:**  
Deletes a note from a chat thread.

### **Delete Chat**

**Endpoint:** `DELETE /chat/{chat_id}`  
**Hook:** `useDeleteChatMutation`

**Purpose:**  
Removes an entire chat (group or direct).

### **Update Message**

**Endpoint:** `PUT /chats/{chat_id}/messages/{message_id}`  
**Hook:** `useUpdateMessageMutation`

**Purpose:**  
Updates the content of an existing chat message.

**Request Example:**

```json
{
  "chatId": "chat_001",
  "messageId": "msg_123",
  "content": "Updated message content"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Message updated successfully",
  "data": {
    "id": "msg_123",
    "chat_id": "chat_001",
    "content": "Updated message content",
    "updated_at": "2026-02-12T10:30:00Z"
  }
}
```

### **Add Message Reaction**

**Endpoint:** `POST /chats/{chat_id}/messages/{message_id}/reactions`  
**Hook:** `useAddMessageReactionMutation`

**Purpose:**  
Adds an emoji reaction to a chat message.

**Request Example:**

```json
{
  "chatId": "chat_001",
  "messageId": "msg_123",
  "reaction": "👍"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Reaction added successfully",
  "data": {
    "id": "reaction_001",
    "message_id": "msg_123",
    "reaction": "👍",
    "user": {
      "id": "user_001",
      "name": "John Doe"
    },
    "created_at": "2026-02-12T10:30:00Z"
  }
}
```

### **Delete Message Reaction**

**Endpoint:** `DELETE /chats/{chat_id}/messages/{message_id}/reactions`  
**Hook:** `useDeleteMessageReactionMutation`

**Purpose:**  
Removes a reaction from a chat message.

**Request Example:**

```json
{
  "chatId": "chat_001",
  "messageId": "msg_123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Reaction removed successfully"
}
```

### **Get Uploaded Chat File**

**Endpoint:** `GET /uploads/chat_files/{filename}`  
**Hook:** `useGetUploadedChatFileQuery`

**Purpose:**  
Downloads an uploaded chat file as a Blob for display or download.

**Returns:** Binary file data (Blob)

### **Get Uploaded Note File**

**Endpoint:** `GET /chat-notes/uploads/{file_uuid}`  
**Hook:** `useGetUploadedNoteFileQuery`

**Purpose:**  
Downloads a file attached to a chat note.

**Returns:** Binary file data (Blob)

### **Get Uploaded Chat Avatar**

**Endpoint:** `GET /uploads/chat_avatars/{filename}`  
**Hook:** `useGetUploadedChatAvatarUrlQuery`

**Purpose:**  
Downloads a chat/group avatar image.

**Returns:** Image URL or Blob data

## **Admin Management Flows:**

This section documents all Admin-only API endpoints that provide access to user management, feedback insights, chat moderation, folder structures, and unpublished content oversight.
All requests are made via the adminApi slice (src/entities/admin/lib.ts), using RTK Query with secure JWT-based authentication.

**Note on Admin Endpoint Paths:**  
Admin endpoints are shown with leading slashes in this documentation (e.g., `/admin/users`) for clarity, but the implementation uses relative paths without leading slashes (e.g., `admin/users`). Both formats are equivalent when combined with the API base URL. The full URL becomes `{API_BASE_URL}/admin/users`.

### **Get All Users**

**Endpoint:** `GET /admin/users`  
**Hook:** `useGetAllUsersQuery`

**Purpose:**  
Retrieves a list of all registered users (clients, coaches, and admins) for administrative review.

**Response Example:**

```json
{
  "users": [
    {
      "email": "coach@example.com",
      "name": "Jane Doe",
      "phone_number": "+1234567890",
      "role": 2,
      "signup_date": "2024-11-15T09:00:00Z"
    },
    {
      "email": "client@example.com",
      "name": "Anna Smith",
      "phone_number": "+1987654321",
      "role": 3,
      "signup_date": "2024-11-20T12:45:00Z"
    }
  ]
}
```

### **Get Feedback**

**Endpoint:** `GET /admin/feedback`  
**Hook:** `useGetFeedbackQuery`

**Purpose:**  
Retrieves all coach and client feedback, including satisfaction scores, ratings, and comments.

**Request parameters**

```json
{
  "limit": 10,
  "offset": 0,
  "start_date": "2025-01-01",
  "end_date": "2025-01-31"
}
```

**Response Example:**

```json
{
  "coach_feedback": {
    "data": [
      {
        "query": "Nutrition advice",
        "content": "Balanced diet tips",
        "coach_email": "coach@example.com",
        "rating": 4,
        "rating_comment": "Helpful",
        "rated_at": "2025-01-10T14:30:00Z"
      }
    ],
    "total": 20,
    "count": 10
  },
  "client_feedback": {
    "data": [
      {
        "client_email": "anna@example.com",
        "query": "Stress management",
        "source_id": "content_001",
        "satisfaction_score": 5,
        "comments": "Very useful!",
        "created_at": "2025-01-09T11:00:00Z"
      }
    ],
    "total": 25,
    "count": 10
  },
  "pagination": {
    "limit": 10,
    "offset": 0,
    "has_more_coach": true,
    "has_more_client": true
  },
  "summary": {
    "total_coach_feedback": 20,
    "total_client_feedback": 25,
    "combined_total": 45
  }
}
```

### **Get All Chats**

**Endpoint:** `GET /admin/chats`  
**Hook:** `useGetAllChatsQuery`

**Purpose:**  
Fetches all chat threads accessible by the admin, including their metadata and unread message counts.

**Response Example:**

```json
{
  "message": "Chats retrieved successfully",
  "data": [
    {
      "id": "chat_001",
      "name": "Client Support",
      "chat_type": "group",
      "last_message_time": "2025-01-04T09:00:00Z",
      "unread_count": 3
    },
    {
      "id": "chat_002",
      "name": "Private Message: Anna Smith",
      "chat_type": "direct",
      "last_message_time": "2025-01-05T12:15:00Z",
      "unread_count": 0
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0
  }
}
```

### **Get Messages by Chat ID**

**Endpoint:** `GET /admin/chats/{chat_id}/messages`  
**Hook:** `useGetMessagesByChatIdQuery`

**Purpose:**  
Retrieves paginated messages within a specific chat for moderation or review.

**Request Example:**

```json
{
  "chat_id": "chat_001",
  "page": 1,
  "page_size": 50
}
```

**Response Example:**

```json
[
  {
    "id": "msg_001",
    "chat_id": "chat_001",
    "content": "Hello, how can I help?",
    "sender": {
      "id": "admin_1",
      "first_name": "Support",
      "last_name": "Agent"
    },
    "created_at": "2025-01-04T09:00:00Z"
  }
]
```

### **Send Admin Message**

**Endpoint:** `POST /admin/send-message`  
**Hook:** `useSendMessageMutation`

**Purpose:**  
Allows an admin to broadcast or send a message to a specific user group (e.g., all coaches, clients, or admins).

**Request Example:**

```json
{
  "content": "Reminder: Submit feedback by Friday.",
  "message_type": "announcement",
  "target_group": "coaches"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Message sent to 12 recipients",
  "admin_chat_id": "admin_chat_005",
  "recipients_count": 12
}
```

### **Get Folders Structure**

**Endpoint:** `GET /admin/folders`  
**Hook:** `useGetFoldersStructureQuery`

**Purpose:**  
Retrieves the entire folder structure visible to the admin, optionally filtered by user or folder ID.

**Request Example:**

```json
{
  "page": 1,
  "page_size": 10,
  "user_id": "coach_123"
}
```

**Response Example:**

```json
{
  "approved": [
    { "id": "fld_01", "name": "Published Articles", "content_count": 12 }
  ],
  "in_review": [
    { "id": "fld_02", "name": "Pending Review", "content_count": 4 }
  ],
  "pagination": {
    "current_page": 1,
    "page_size": 10,
    "total_content_items": 16
  },
  "admin_access": true,
  "filtered_by_user": true,
  "target_user_id": "coach_123"
}
```

### **Get Unpublished Content**

**Endpoint:** `GET /admin/unpublished-content`  
**Hook:** `useGetUnpublishedContentQuery`

**Purpose:**  
Lists all unpublished or rejected content across the platform with optional date and author filters.

**Request Example:**

```json
{
  "page": 1,
  "limit": 10,
  "creator_id": "coach_123",
  "date_from": "2025-01-01",
  "date_to": "2025-02-01"
}
```

**Response Example:**

```json
{
  "items": [
    {
      "id": "content_001",
      "title": "Understanding Stress Hormones",
      "status": "unpublished",
      "creator_id": "coach_123",
      "unpublished_by": "admin_456",
      "date": "2025-01-20T12:00:00Z"
    }
  ],
  "total": 1
}
```

### **Manage Content**

**Endpoint:** `PUT /admin/manage-content`  
**Hook:** `useManageContentMutation`

**Purpose:**  
Allows an admin to approve, reject, or unpublish a specific content item, optionally adding a comment or reason.

**Request Example:**

```json
{
  "content_id": "content_001",
  "action": "unpublish",
  "admin_comment": "Duplicate of another post",
  "unpublish_reason": "Content duplication"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Content successfully unpublished"
}
```

### **Delete user**

**Endpoint:** `DELETE /admin/delete-user/{user_id}`  
**Hook:** `useDeleteUserMutation`

**Purpose:**  
Allows admin to delete a user.

### **Get All Access Requests**

**Endpoint:** `GET /admin/access-requests`  
**Hook:** `useGetAllAccessRequestsQuery`

**Purpose:**  
Retrieves all pending access requests for admin review.

**Response Example:**

```json
{
  "status": "success",
  "message": "Access requests retrieved successfully",
  "data": [
    {
      "request_id": "req_001",
      "email": "coach@example.com",
      "name": "Jane Doe",
      "requested_at": "2026-01-15T10:00:00Z",
      "status": "pending"
    }
  ]
}
```

### **Approve Access Request**

**Endpoint:** `POST /admin/access-requests/approve`  
**Hook:** `useApproveRequestMutation`

**Purpose:**  
Approves a pending access request.

**Request Example:**

```json
{
  "request_id": "req_001"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Access request approved successfully"
}
```

### **Deny Access Request**

**Endpoint:** `POST /admin/access-requests/deny`  
**Hook:** `useDenyRequestMutation`

**Purpose:**  
Denies a pending access request.

**Request Example:**

```json
{
  "request_id": "req_001"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Access request denied"
}
```

## **Client Health History Flows:**

This section describes how a client’s health history data is created, retrieved, and managed through the Tolu Health frontend and backend API.
All health history data is handled securely through the healthHistoryApi slice (src/entities/health-history/lib.ts) using RTK Query and FormData-based REST API calls.

### **Get User Health History**

**Endpoint:** `GET /health-history`  
**Hook:** `useGetUserHealthHistoryQuery`

**Purpose:**  
Retrieves the complete health history profile for the currently authenticated client.
Includes demographic, lifestyle, medical, and goal-related information as filled during onboarding or updates.

**Response Example:**

```json
{
  "id": "hh_001",
  "user_id": "client_123",
  "created_at": "2025-01-04T12:00:00Z",
  "updated_at": "2025-01-18T10:30:00Z",
  "age": 49,
  "gender": "female",
  "gender_identity": "cisgender woman",
  "height": "165",
  "weight": "68",
  "ethnicity": "Caucasian",
  "language": "English",
  "location": "Los Angeles, CA",
  "marital_status": "married",
  "menopause_status": "postmenopausal",
  "current_health_concerns": "stress and fatigue",
  "diagnosed_conditions": "hypertension",
  "lifestyle_information": "Regular morning walks and balanced meals",
  "exercise_habits": "3x/week yoga",
  "sleep_quality": "good",
  "stress_levels": "moderate",
  "energy_levels": "fluctuating",
  "recent_lab_tests": true,
  "lab_results_file": [
    {
      "filename": "lab_results_2025_01.pdf",
      "content_type": "application/pdf",
      "upload_timestamp": "2025-01-04T12:05:00Z"
    }
  ],
  "health_goals": "Reduce stress and improve sleep quality",
  "desired_results_timeline": "3 months",
  "privacy_consent": true,
  "follow_up_recommendation": "Schedule with nutrition coach",
  "recommendation_destination": "coach_dashboard"
}
```

### **Create or Update Health History**

**Endpoint:** `POST /health-history`  
**Hook:** `useCreateHealthHistoryMutation`

**Purpose:**  
Creates or updates the client’s health history record.
Supports uploading lab reports and linking the record to a specific client (for admin/coach use).

- The mutation constructs a FormData object.
- Health history fields are serialized into JSON and appended as health_data.
- If lab files are provided, they are appended as binary lab_file.
- An optional client_id can be attached (for coaches submitting data on behalf of clients).
- The request is securely sent as multipart/form-data via HTTPS.

**Request Example:**
multipart/form-data

```json
{
  "health_data": {
    "age": 49,
    "gender": "female",
    "location": "Los Angeles, CA",
    "ethnicity": "Caucasian",
    "current_health_concerns": "Fatigue and stress",
    "diagnosed_conditions": "Hypertension",
    "exercise_habits": "Yoga 3x/week",
    "sleep_quality": "good",
    "stress_levels": "moderate",
    "energy_levels": "low",
    "recent_lab_tests": true,
    "health_goals": "Improve sleep, lower blood pressure",
    "desired_results_timeline": "3 months",
    "privacy_consent": true
  },
  "lab_file": (binary PDF file),
  "client_id": "client_123"
}
```

### **Get Lab Report**

**Endpoint:** `GET /health-history/lab-report/{filename}`  
**Hook:** `useGetLabReportQuery`

**Purpose:**  
Downloads a specific lab report previously uploaded as part of the client’s health history.
Supports optional client_id for admin or coach access.

**Request Example:**

```json
{
  "filename": "lab_results_2025_01.pdf",
  "client_id": "client_123"
}
```

**Response:**
Returns the binary file (PDF or image) for secure download or inline preview.

### **Update Coach Client Health History**

**Endpoint:** `PUT /coach/client/{client_id}/health-history`  
**Hook:** `useUpdateCoachClientHealthHistoryMutation`

**Purpose:**  
Allows a coach to update a client's health history information.

**Request Example:**
multipart/form-data with health_data JSON and optional lab_file

**Response:**

```json
{
  "status": "success",
  "message": "Health history updated successfully",
  "data": {
    "id": "hh_001",
    "updated_at": "2026-02-12T10:30:00Z"
  }
}
```

### **Get Coach Client Health History**

**Endpoint:** `GET /coach/client/{client_id}/health-history`  
**Hook:** `useGetCoachClientHealthHistoryQuery`

**Purpose:**  
Retrieves a specific client's health history for the authenticated coach.

**Response:** Same structure as Get User Health History

## **Medication Management:**

This section describes how clients and coaches can track medications including dosage, frequency, and related files.

### **Get Medications by Chat**

**Endpoint:** `GET /medications/{chat_id}`  
**Hook:** `useGetMedicationsByChatQuery`

**Purpose:**  
Retrieves all medications associated with a specific client chat.

**Response Example:**

```json
{
  "status": "success",
  "message": "Medications retrieved successfully",
  "data": {
    "medications": [
      {
        "id": "med_001",
        "chat_id": "chat_001",
        "medication_name": "Metformin",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "start_date": "2026-01-01",
        "end_date": null,
        "notes": "Take with meals",
        "file_uuid": "file_abc123",
        "file_name": "prescription.pdf",
        "created_at": "2026-01-01T09:00:00Z"
      }
    ]
  }
}
```

### **Create Medication**

**Endpoint:** `POST /medications`  
**Hook:** `useCreateMedicationMutation`

**Purpose:**  
Creates a new medication record for a client.

**Request Example:**
multipart/form-data

```json
{
  "medication_data": {
    "chat_id": "chat_001",
    "medication_name": "Metformin",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "start_date": "2026-01-01",
    "notes": "Take with meals"
  },
  "file": (binary file - prescription image/PDF)
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Medication created successfully",
  "data": {
    "id": "med_001",
    "medication_name": "Metformin",
    "file_uuid": "file_abc123"
  }
}
```

### **Update Medication**

**Endpoint:** `PUT /medications/{medication_id}`  
**Hook:** `useUpdateMedicationMutation`

**Purpose:**  
Updates an existing medication record.

**Request Example:**
multipart/form-data with medication_data JSON and optional file

### **Delete Medication**

**Endpoint:** `DELETE /medications/{medication_id}`  
**Hook:** `useDeleteMedicationMutation`

**Purpose:**  
Deletes a medication record.

**Response:**

```json
{
  "status": "success",
  "message": "Medication deleted successfully"
}
```

### **Serve Medication File**

**Endpoint:** `GET /medications/uploads/{file_uuid}`  
**Hook:** `useServeMedicationFileQuery`

**Purpose:**  
Downloads a medication-related file (prescription, label photo, etc.).

**Returns:** Binary file data (Blob)

## **Supplement Management:**

This section describes how clients and coaches can track dietary supplements.

### **Get Supplements by Chat**

**Endpoint:** `GET /supplements/{chat_id}`  
**Hook:** `useGetSupplementsByChatQuery`

**Purpose:**  
Retrieves all supplements associated with a specific client chat.

**Response:** Similar structure to medications

### **Create Supplement**

**Endpoint:** `POST /supplements`  
**Hook:** `useCreateSupplementMutation`

**Purpose:**  
Creates a new supplement record for a client.

**Request Example:**
multipart/form-data

```json
{
  "supplement_data": {
    "chat_id": "chat_001",
    "supplement_name": "Vitamin D3",
    "dosage": "2000 IU",
    "frequency": "Once daily",
    "start_date": "2026-01-01",
    "notes": "Take in morning"
  },
  "file": (binary file - supplement label)
}
```

### **Update Supplement**

**Endpoint:** `PUT /supplements/{supplement_id}`  
**Hook:** `useUpdateSupplementMutation`

**Purpose:**  
Updates an existing supplement record.

### **Delete Supplement**

**Endpoint:** `DELETE /supplements/{supplement_id}`  
**Hook:** `useDeleteSupplementMutation`

**Purpose:**  
Deletes a supplement record.

### **Serve Supplement File**

**Endpoint:** `GET /supplements/uploads/{file_uuid}`  
**Hook:** `useServeSupplementFileQuery`

**Purpose:**  
Downloads a supplement-related file.

**Returns:** Binary file data (Blob)

## **Coach Health History Notes:**

This section describes how coaches can add contextual notes to specific sections of a client's health history.

### **Get Health History Notes**

**Endpoint:** `GET /clients/{client_id}/health-history/{health_history_id}/notes`  
**Hook:** `useGetHealthHistoryNotesQuery`

**Purpose:**  
Retrieves all coach notes for a client's health history.

**Response Example:**

```json
{
  "status": "success",
  "message": "Notes retrieved successfully",
  "data": {
    "notes": [
      {
        "id": "note_001",
        "block_name": "diagnosed_conditions",
        "note_content": "Client managing hypertension well with medication",
        "created_at": "2026-01-15T10:00:00Z",
        "updated_at": "2026-01-15T10:00:00Z"
      }
    ]
  }
}
```

### **Get Health History Note**

**Endpoint:** `GET /clients/{client_id}/health-history/{health_history_id}/notes/{note_id}`  
**Hook:** `useGetHealthHistoryNoteQuery`

**Purpose:**  
Retrieves a single coach note by ID.

### **Add Health History Note**

**Endpoint:** `POST /clients/{client_id}/health-history/{health_history_id}/notes`  
**Hook:** `useAddHealthHistoryNoteMutation`

**Purpose:**  
Creates a new coach note for a specific health history block.

**Request Example:**
multipart/form-data

```json
{
  "block_name": "diagnosed_conditions",
  "note_content": "Client managing hypertension well with medication"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Note added successfully",
  "data": {
    "id": "note_001",
    "block_name": "diagnosed_conditions",
    "note_content": "Client managing hypertension well...",
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

### **Update Health History Note**

**Endpoint:** `PUT /clients/{client_id}/health-history/{health_history_id}/notes/{note_id}`  
**Hook:** `useUpdateHealthHistoryNoteMutation`

**Purpose:**  
Updates an existing coach note.

**Request Example:**
multipart/form-data with note_content

### **Delete Health History Note**

**Endpoint:** `DELETE /clients/{client_id}/health-history/{health_history_id}/notes/{note_id}`  
**Hook:** `useDeleteHealthHistoryNoteMutation`

**Purpose:**  
Deletes a specific coach note.

### **Delete Health History Notes by Block**

**Endpoint:** `DELETE /clients/{client_id}/health-history/{health_history_id}/notes/block/{block_name}`  
**Hook:** `useDeleteHealthHistoryNoteByBlockMutation`

**Purpose:**  
Deletes all coach notes associated with a specific health history block (e.g., all notes for "diagnosed_conditions").

**Response:**

```json
{
  "status": "success",
  "message": "All notes for block deleted successfully"
}
```

## **Symptoms Tracker Flows:**

This section describes how clients can log, update, and analyze their daily symptoms in the Tolu Health platform, as well as how AI suggestions assist in symptom identification and tracking.

### **Add Symptoms Record**

**Endpoint:** `POST /symptoms-tracker`  
**Hook:** `useAddSymptomsMutation`

**Purpose:**  
Creates a new daily symptom record for the user.
Clients can attach optional photos (e.g., skin condition, meal photo) or voice notes for faster journaling.

- A FormData object is created.
- The structured symptom data is serialized as JSON and appended as symptom_data.
- Optional photo and voice_note files are attached as binary.
- The request is sent as multipart/form-data via HTTPS.

**Request Example:**
multipart/form-data

```json
{
  "symptom_data": {
    "tracking_date": "2025-01-22",
    "symptoms": ["fatigue", "hot flashes"],
    "symptom_intensities": ["moderate", "severe"],
    "duration_category": "2-4 hours",
    "suspected_triggers": ["poor sleep", "stress"],
    "sleep_quality": "Fair",
    "sleep_hours": 6,
    "sleep_minutes": 45,
    "times_woke_up": 2,
    "meal_notes": "Ate late dinner",
    "meal_details": [
      { "meal_type": "dinner", "food_items": "pasta and wine", "time": "21:30" }
    ],
    "user_notes": "Felt more tired than usual."
  },
  "photo": (binary image),
  "voice_note": (binary audio)
}
```

### **Edit Symptoms Record**

**Endpoint:** `PUT /symptoms-tracker/{record_id}`  
**Hook:** `useEditSymptomsMutation`

**Purpose:**  
Updates an existing symptom record for a given date or record ID.
Used when users need to modify previously logged entries.

**Request Example:**
multipart/form-data

```json
{
  "symptom_data": {
    "tracking_date": "2025-01-22",
    "symptoms": ["fatigue", "headache"],
    "symptom_intensities": ["moderate", "mild"],
    "duration_category": "1-2 hours",
    "user_notes": "Slept better today, symptoms improving."
  },
  "photo": (new image file)
}
```

### **Get Symptom by Date**

**Endpoint:** `GET /symptoms-tracker/{target_date}`  
**Hook:** `useGetSymptomByDateQuery`

**Purpose:**  
Retrieves all recorded symptoms and details for a specific date.

**Request Example:**

```json
{
  "target_date": "2025-01-22"
}
```

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": "sym_001",
      "tracking_date": "2025-01-22",
      "symptoms": ["fatigue", "hot flashes"],
      "symptom_intensities": ["moderate", "severe"],
      "suspected_triggers": ["stress", "sleep deprivation"],
      "sleep_quality": "Fair",
      "sleep_hours": 6,
      "meal_notes": "Had late dinner",
      "created_at": "2025-01-22T21:00:00Z"
    }
  ]
}
```

### **Delete Symptom Record**

**Endpoint:** `DELETE /symptoms-tracker/{symptom_id}`  
**Hook:** `useDeleteSymptomMutation`

**Purpose:**  
Deletes a specific symptom record (for instance, when the user wants to remove a duplicate or incorrect entry).

**Request Example:**

```json
{
  "symptom_id": "sym_001"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Symptom record deleted successfully."
}
```

### **Get AI Suggestions**

**Endpoint:** `GET /symptoms-tracker/ai-suggestions`  
**Hook:** `useGetAiSuggestionsQuery`

**Purpose:**  
Provides AI-powered symptom and trigger recommendations based on previously logged entries and similar user data patterns.

**Response Example:**

```json
{
  "suggested_symptoms": ["fatigue", "bloating", "irritability"],
  "suggested_triggers": [
    "lack of sleep",
    "high sugar intake",
    "stressful events"
  ]
}
```

### **Get Symptoms by Date for Coach**

**Endpoint:** `GET /coach/client/{client_id}/symptoms/{date}`  
**Hook:** `useGetSymptomsByDateForCoachQuery`

**Purpose:**  
Allows coaches to view a client's symptom entries for a specific date.

**Response Example:**

```json
{
  "status": "success",
  "message": "Symptoms retrieved successfully",
  "data": [
    {
      "id": "symptom_001",
      "client_id": "client_123",
      "tracking_date": "2026-02-12",
      "symptoms": ["fatigue", "headache"],
      "severity": 7,
      "triggers": ["lack of sleep"],
      "notes": "Woke up feeling tired"
    }
  ]
}
```

## **Notifications Flows:**

This section outlines how notifications are retrieved, managed, and customized in the Tolu Health platform.
All notification data flows through the notificationsApi slice (src/entities/notifications/lib.ts) using RTK Query and secure JWT-authenticated REST API calls.

### **Get Notifications**

**Endpoint:** `GET /notifications`  
**Hook:** `useGetNotificationsQuery`

**Purpose:**  
Fetches paginated user notifications, with optional filters for unread items and notification type.

**Request Example:**

```json
{
  "page": 1,
  "limit": 20,
  "unread_only": false,
  "type_filter": "content_share"
}
```

**Response Example:**

```json
[
  {
    "id": "notif_001",
    "user_id": "client_123",
    "title": "New Content Shared",
    "message": "Your coach shared 'Healthy Sleep Routine' with you.",
    "type": "content_share",
    "priority": "normal",
    "is_read": false,
    "is_dismissed": false,
    "created_at": "2025-01-20T10:30:00Z",
    "read_at": null,
    "expires_at": "2025-02-01T00:00:00Z",
    "notification_metadata": {
      "content_id": "content_123",
      "shared_by": "coach_456"
    }
  }
]
```

### **Get Unread Count**

**Endpoint:** `GET /notifications/unread`  
**Hook:** `useGetUnreadCountQuery`

**Purpose:**  
Retrieves the total number of unread notifications for the logged-in user.

**Response Example:**

```json
{
  "unread_count": 3
}
```

### **Mark Notifications as Read**

**Endpoint:** `POST /notifications/mark-as-read`  
**Hook:** `useMarkNotificationAsReadMutation`

**Purpose:**  
Marks one or more notifications as read.

**Request Example:**

```json
{
  "notification_ids": ["notif_001", "notif_002"]
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Notifications marked as read."
}
```

### **Dismiss Notification**

**Endpoint:** `POST /notifications/{notification_id}/dismiss`  
**Hook:** `useDismissNotificationsMutation`

**Purpose:**  
Dismisses or removes a specific notification from the user’s notification list.

**Request Example:**

```json
{
  "notification_id": "notif_003"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Notification dismissed successfully."
}
```

### **Get Notification Preferences**

**Endpoint:** `GET /notifications/preferences`  
**Hook:** `useGetNotificationPreferencesQuery`

**Purpose:**  
Retrieves the user’s notification settings, such as whether in-app or email notifications are enabled.

**Response Example:**

```json
{
  "notifications_enabled": true
}
```

### **Update Notification Preferences**

**Endpoint:** `PUT /notifications/preferences`  
**Hook:** `useUpdateNotificationPreferencesMutation`

**Purpose:**  
Allows the user to update their notification settings (e.g., toggle notification delivery).

**Request Example:**

```json
{
  "notifications_enabled": false
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Notification preferences updated successfully."
}
```

## **Coach Files Library Flows:**

This section describes how coaches manage files and folders in the Tolu Health Files Library.
All operations (upload, download, folder management, and moving files) are handled through the filesLibraryApi slice (src/entities/files-library/lib.ts) using RTK Query and JWT-secured REST endpoints.

### **Fetch All Files**

**Endpoint:** `GET /files-library`  
**Hook:** `useFetchAllFilesQuery`

**Purpose:**  
Retrieves all files and folders accessible to the logged-in coach.
Supports pagination, search, and file-type filtering.

**Request Example:**

```json
{
  "page": 1,
  "per_page": 20,
  "search": "nutrition",
  "file_type": "pdf"
}
```

**Response Example:**

```json
{
  "root_folders": [
    {
      "id": "fld_001",
      "name": "Client Reports",
      "files": [],
      "subfolders": [],
      "type": "folder",
      "created_at": "2025-01-18T10:00:00Z"
    }
  ],
  "root_files": [
    {
      "id": "file_001",
      "name": "Wellness Summary.pdf",
      "type": "pdf",
      "size": 240000,
      "mime_type": "application/pdf",
      "created_at": "2025-01-19T08:30:00Z"
    }
  ],
  "total_files": 12,
  "total_folders": 3,
  "max_depth_retrieved": 2,
  "structure": "hierarchical"
}
```

### **Fetch Single File**

**Endpoint:** `GET /files-library/{file_id}`  
**Hook:** `useFetchFileLibraryQuery`

**Purpose:**  
Retrieves detailed metadata for a specific uploaded file.

**Response Example:**

```json
{
  "status": "success",
  "message": "File retrieved successfully",
  "data": {
    "id": "file_001",
    "user_id": "coach_123",
    "filename": "Wellness Summary.pdf",
    "original_filename": "summary.pdf",
    "description": "Client wellness progress report",
    "file_type": "pdf",
    "file_extension": "pdf",
    "size": 240000,
    "upload_date": "2025-01-19T08:30:00Z",
    "created_at": "2025-01-19T08:30:00Z",
    "updated_at": "2025-01-19T08:45:00Z"
  },
  "timestamp": "2026-02-12T10:30:00Z"
}
```

### **Upload Files**

**Endpoint:** `POST /files-library/upload`  
**Hook:** `useUploadFilesLibraryMutation`

**Purpose:**  
Uploads one or multiple files to a folder. Coaches can attach descriptions and optionally specify a target folder.

- Each file is added to a FormData object as files.
- descriptions (optional) are appended as text.
- folder_id (optional) determines upload destination.

**Request Example:**
multipart/form-data

```json
{
  "files": [(binary file), (binary file)],
  "descriptions": "Session documents for January",
  "folder_id": "fld_001"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "2 files uploaded successfully."
}
```

### **Download File**

**Endpoint:** `GET /files-library/download/{file_id}`  
**Hook:** `useDownloadFileLibraryQuery`

**Purpose:**  
Downloads a file from the library for offline access or review.

**Request Example:**

```json
{
  "file_id": "file_001"
}
```

**Response:**
Returns the binary file (e.g., PDF, DOCX, or image) as a Blob.

### **Delete File**

**Endpoint:** `DELETE /files-library/{file_id}`  
**Hook:** `useDeleteFileLibraryMutation`

**Purpose:**  
Deletes a specific file from the coach’s library.

**Request Example:**

```json
{
  "file_id": "file_001"
}
```

### **Create Folder**

**Endpoint:** `POST /files-library/folders`  
**Hook:** `useCreateFolderMutation`

**Purpose:**  
Creates a new folder to organize uploaded files. Supports nested folder structures.

**Request Example:**

```json
{
  "name": "Hormone Health",
  "description": "Resources and case studies",
  "parent_folder_id": null
}
```

**Response Example:**

```json
{
  "id": "fld_002",
  "name": "Hormone Health",
  "description": "Resources and case studies",
  "path": "/Hormone Health",
  "created_at": "2025-01-19T09:00:00Z"
}
```

### **Get Folder Details**

**Endpoint:** `GET /files-library/folders/{folder_id}`  
**Hook:** `useGetFolderQuery`

**Purpose:**  
Retrieves metadata for a specific folder.

**Response Example:**

```json
{
  "id": "fld_002",
  "name": "Hormone Health",
  "description": "Resources and case studies",
  "parent_folder_id": null,
  "path": "/Hormone Health",
  "created_at": "2025-01-19T09:00:00Z",
  "updated_at": "2025-01-19T09:15:00Z"
}
```

### **Update Folder**

**Endpoint:** `PUT /files-library/folders/{folder_id}`  
**Hook:** `useUpdateFolderMutation`

**Purpose:**  
Updates the name or description of a folder, or reassigns its parent folder.

**Request Example:**

```json
{
  "folderId": "fld_002",
  "payload": {
    "name": "Hormone Education",
    "description": "Updated resource folder"
  }
}
```

**Response Example:**

```json
{
  "id": "fld_002",
  "name": "Hormone Education",
  "description": "Updated resource folder",
  "updated_at": "2025-01-20T08:00:00Z"
}
```

### **Get Folder Contents**

**Endpoint:** `GET /files-library/folders/{folder_id}/contents`  
**Hook:** `useGetFolderContentsQuery`

**Purpose:**  
Lists subfolders and files contained in a specific folder with pagination support.

**Request Example:**

```json
{
  "folderId": "fld_002",
  "page": "1",
  "per_page": "10"
}
```

**Response Example:**

```json
{
  "current_folder": {
    "id": "fld_002",
    "name": "Hormone Education",
    "description": "Updated resource folder"
  },
  "subfolders": [
    { "id": "fld_003", "name": "Case Studies", "description": null }
  ],
  "files": [
    {
      "id": "file_010",
      "original_filename": "Hormone_Basics.pdf",
      "file_type": "pdf",
      "size": 150000
    }
  ],
  "breadcrumbs": [
    { "id": "fld_001", "name": "Client Reports" },
    { "id": "fld_002", "name": "Hormone Education" }
  ]
}
```

### **Delete Folder**

**Endpoint:** `DELETE /files-library/folders/{folder_id}`  
**Hook:** `useDeleteFolderMutation`

**Purpose:**  
Deletes a folder and all contained sub-items (if allowed by policy).

**Request Example:**

```json
{
  "folder_id": "fld_003"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Folder deleted successfully."
}
```

### **Move Files Between Folders**

**Endpoint:** `POST /files-library/move-files`  
**Hook:** `useMoveFilesMutation`

**Purpose:**  
Moves one or more files into another folder.

**Request Example:**

```json
{
  "file_ids": ["file_001", "file_002"],
  "folder_id": "fld_004"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Files moved successfully."
}
```

## **Tracker Management (FMP Tracker):**

These endpoints enable coaches to submit, share, and delete tracker data such as Food-Mood-Poop logs or similar client metrics.

### **Submit Tracker**

**Endpoint:** `POST /coach/fmp`  
**Hook:** `useSubmitTrackerMutation`

**Purpose:**  
Submits a new FMP tracker entry for a client, recording daily lifestyle and health metrics.

**Request Example:**

```json
{
  "client_id": "client_123",
  "tracker_data": {
    "mood": "good",
    "energy": "high",
    "sleep_hours": 8,
    "notes": "Slept well and maintained hydration."
  }
}
```

**Response Example:**

```json
{
  "status": "success",
  "message": "Tracker record created successfully",
  "data": {
    "tracker_id": "trk_123",
    "created_at": "2026-02-12T10:30:00Z"
  },
  "timestamp": "2026-02-12T10:30:00Z"
}
```

### **Share Tracker**

**Endpoint:** `POST /coach/share-fmp`  
**Hook:** `useShareTrackerMutation`

**Purpose:**  
Shares an existing tracker entry with a client or another practitioner for collaborative review.

**Request Example:**

```json
{
  "tracker_id": "trk_123",
  "recipient_id": "client_123"
}
```

**Response Example:**

```json
{
  "status": "success",
  "message": "Tracker shared successfully",
  "data": {
    "share_id": "share_456",
    "shared_at": "2026-02-12T10:30:00Z"
  },
  "timestamp": "2026-02-12T10:30:00Z"
}
```

### **Delete Tracker**

**Endpoint:** `DELETE /coach/fmp/{tracker_id}`  
**Hook:** `useDeleteTrackerMutation`

**Purpose:**  
Removes a previously submitted tracker entry.

**Request Example:**

```json
{
  "tracker_id": "trk_123"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Tracker deleted successfully."
}
```

## **Lab Files Management:**

### **Get Lab File**

**Endpoint:** `GET /coach/labs/{client_id}/{file_name}`  
**Hook:** `useGetLabFileQuery`

**Purpose:**  
Downloads or previews a lab file uploaded for a client.

**Request Example:**

```json
{
  "client_id": "client_123",
  "file_name": "lab_results_2025_01.pdf"
}
```

**Response:**
Returns the binary lab file (PDF, image, or text report) for preview or download.

## **Coach Content Library:**

### **Get All User Content**

**Endpoint:** `GET /coach/search-content`  
**Hook:** `useGetAllUserContentQuery`

**Purpose:**  
Fetches all content items authored or shared by the coach. Used in the coach dashboard for browsing personal and AI-generated materials.

**Response Example:**

```json
{
  "contents": [
    {
      "id": "cnt_001",
      "title": "Nutrition Tips for Menopause",
      "status": "active",
      "created_at": "2025-01-10T08:00:00Z"
    },
    {
      "id": "cnt_002",
      "title": "Mindfulness and Sleep Quality",
      "status": "draft",
      "created_at": "2025-01-12T10:30:00Z"
    }
  ]
}
```

## **Folder editing:**

### **Edit Folder**

**Endpoint:** `PUT /coach/edit-folder`  
**Hook:** `useEditFolderMutation`

**Purpose:**  
Updates a folder’s metadata (e.g., name or description) and optionally adds new files in a single request.
Supports uploading multiple files along with folder details using multipart/form-data.

**Request Example:**
multipart/form-data

```json
{
  "edit_data": {
    "folder_id": "fld_002",
    "name": "Updated Educational Resources",
    "description": "Reorganized folder with new guides"
  },
  "files": [(binary file), (binary file)]
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Folder updated and files added successfully."
}
```

## **Coach Management and Client Interaction Flows:**

### **Delete Client**

**Endpoint:** `DELETE /coach/clients/{client_id}`  
**Hook:** `useDeleteClientMutation`

**Purpose:**  
Removes a client from the coach’s managed list. Typically used when the coaching relationship has ended or the client requests removal.

**Request Example:**

```json
{
  "client_id": "client_123"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Client removed successfully."
}
```

### **Get Client Info**

**Endpoint:** `GET /coach/clients/{client_id}/info`  
**Hook:** `useLazyGetClientInfoQuery`

**Purpose:**  
Retrieves full detailed client information, including demographics, onboarding status, goals, and recent interactions. Used in the coach’s client detail dashboard.

**Response Example:**

```json
{
  "id": "client_123",
  "first_name": "Anna",
  "last_name": "Smith",
  "name": "Anna Smith",
  "email": "anna@example.com",
  "photo_url": "https://cdn.toluhealth.com/photos/client_123.jpg",
  "dob": "1988-04-12",
  "timezone": "Europe/London",
  "coach_notes": "Focusing on stress and energy improvement.",
  "onboarding_completed": true,
  "last_activity": "2025-01-19T09:00:00Z"
}
```

### **Edit Client Info**

**Endpoint:** `PUT /coach/clients/{client_id}/info`  
**Hook:** `useEditClientMutation`

**Purpose:**  
Allows a coach to update a client’s profile data — such as name, email, timezone, and coach notes — directly from the management panel.

**Request Example:**

```json
{
  "clientId": "client_123",
  "payload": {
    "name": "Anna S.",
    "email": "anna.s@example.com",
    "timezone": "Europe/London",
    "notes": "Updated nutrition plan and next check-in scheduled."
  }
}
```

**Response Example:**

```json
{
  "status": "success",
  "message": "Client information updated successfully",
  "data": {
    "updated_at": "2026-02-12T10:30:00Z"
  },
  "timestamp": "2026-02-12T10:30:00Z"
}
```

### **Get Client Profile (Coach View)**

**Endpoint:** `GET /coach/client/{client_id}/profile`  
**Hook:** `useGetClientProfileQuery`

**Purpose:**  
Retrieves a specific client's profile information from the coach's perspective. Used by coaches to review client details in their management dashboard.

**Response Example:**

```json
{
  "status": "success",
  "message": "Client profile retrieved successfully",
  "data": {
    "id": "client_123",
    "first_name": "Anna",
    "last_name": "Smith",
    "email": "anna@example.com",
    "photo_url": "/uploads/client_123.jpg",
    "timezone": "Europe/London"
  }
}
```

### **Get Client Coaches**

**Endpoint:** `GET /client/{client_id}/coaches`  
**Hook:** `useGetClientCoachesQuery`

**Purpose:**  
Retrieves all coaches associated with a specific client.

**Response Example:**

```json
{
  "status": "success",
  "message": "Coaches retrieved successfully",
  "data": [
    {
      "id": "coach_001",
      "name": "Dr. Jane Smith",
      "email": "jane@example.com",
      "specialty": "Nutritionist"
    }
  ]
}
```

### **Get Session by ID**

**Endpoint:** `GET /session/{chat_id}`  
**Hook:** `useGetSessionByIdQuery`

**Purpose:**  
Retrieves detailed information about an AI coaching session or search results.

**Response Example:**

```json
{
  "status": "success",
  "message": "Session retrieved successfully",
  "data": {
    "session_id": "session_001",
    "chat_id": "chat_001",
    "search_results": [],
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

### **Update Comprehensive Client**

**Endpoint:** `PUT /coach/client/{client_id}/comprehensive-update`  
**Hook:** `useUpdateComprehensiveClientMutation`

**Purpose:**  
Updates a client's comprehensive profile including multiple data sections at once.

**Request Example:**
multipart/form-data with comprehensive_data JSON

**Response:**

```json
{
  "status": "success",
  "message": "Client profile updated successfully",
  "data": {
    "client_id": "client_123",
    "updated_at": "2026-02-12T10:30:00Z"
  }
}
```

### **Get Lab File**

**Endpoint:** `GET /coach/client/{client_id}/lab-file/{file_name}`  
**Hook:** `useGetLabFileQuery`

**Purpose:**  
Downloads a specific lab file for a client.

**Returns:** Binary file data (Blob)

### **Download License File**

**Endpoint:** `GET /coach/license/{filename}`  
**Hook:** `useDownloadLicenseFileQuery`

**Purpose:**  
Downloads the coach's license or certification file.

**Returns:** Binary file data (Blob)

### **Delete License File**

**Endpoint:** `DELETE /coach/license/{filename}`  
**Hook:** `useDeleteLicenseFileMutation`

**Purpose:**  
Deletes a coach's uploaded license file.

**Response:**

```json
{
  "status": "success",
  "message": "License file deleted successfully"
}
```

### **Update Chat Title**

**Endpoint:** `PUT /ai/update-chat-title`  
**Hook:** `useUpdateChatTitleMutation`

**Purpose:**  
Renames a chat session (for example, an AI learning thread or a client conversation) to keep chat history organized and contextual.

**Request Example:**

```json
{
  "chat_id": "chat_001",
  "new_title": "Stress Management Coaching - Week 3"
}
```

**Response Example:**

```json
{
  "status": "success",
  "message": "Chat title updated",
  "data": {
    "chat_id": "chat_001",
    "new_title": "Stress Management Coaching - Week 3",
    "updated_at": "2026-02-12T10:30:00Z"
  },
  "timestamp": "2026-02-12T10:30:00Z"
}
```

---

## Response Format Summary

Throughout this documentation, all API endpoints follow one of two standardized response formats:

### 1. **BaseResponse<T>** (Most Endpoints)

Used for single-item operations (create, update, delete, get by ID):

```typescript
{
  status: "success" | "error",
  message: string,
  data: T,
  meta?: any,
  timestamp?: string
}
```

### 2. **PaginatedResponse<T>** (List Endpoints)

Used for endpoints returning lists with pagination:

```typescript
{
  message: string,
  data: T[],
  pagination: {
    total: number,
    limit: number,
    offset: number
  }
}
```

**Key Points:**

- All success responses include a `status: "success"` or appropriate success message
- Error responses follow the same structure with `status: "error"` and error details in `message`
- Timestamps are in ISO 8601 format
- Pagination metadata is always included for list endpoints
- The `data` field contains the actual response payload specific to each endpoint

---

## Security and Compliance

- All communication via HTTPS (enforced by backend and proxy).
- JWT authentication with refresh token rotation.
- Sensitive data (tokens, credentials) stored only in Redux and localStorage.
- File uploads sanitized and validated before submission.
- Compliant with SSL and HIPAA guidelines.
- Regular vulnerability scans and dependency audits.
