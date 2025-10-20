## Overview

This document explains how data is received, managed, and transferred from the Tolu Health Frontend (React + Vite + TypeScript) to the Backend API.

## Architecture Overview

- React Components handle forms and trigger API mutations/queries.
- RTK Query manages data fetching, caching, and normalization.
- Backend API handles validation, authentication, and persistence.

## API Configuration

All network requests are handled through RTK Query’s fetchBaseQuery, configured in src/entities

- All requests use HTTPS (enforced via backend configuration).
- Authorization is automatically handled through prepareHeaders.
- Tokens are stored securely in Redux state and localStorage.

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

# Data Flow Documentation

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
  "user": {
    "id": "123",
    "name": "Jane Doe",
    "email": "user@example.com",
    "role": "coach"
  },
  "accessToken": "jwt_token_here"
}
```

Frontend Action:
The setCredentials reducer stores both the user object and accessToken.
Future API calls automatically attach Authorization: Bearer <token>.

## **Registration Flow**

### registerUser:

Endpoint: POST /user/signup
Hook: useRegisterUserMutation

Payload:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPass123!",
  "phone_number": "+123456789",
  "roleID": 2,
  "country": "USA",
  "state": "CA"
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
  onboarding_data: {
    "agreements": { "terms_of_use": true, "confidentiality": true },
    "practitioner_info": { "school": "Stanford", "types": ["nutritionist"] },
    "business_setup": { "practice_software": "Notion" }
  }
  headshot: (binary file)
  license_files: (binary files)
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
  profile_data: {
    "name": "Anna Smith",
    "email": "anna.smith@example.com",
    "phone": "+1234567890",
    "dob": "1988-04-12",
    "timezone": "Europe/London",
    "gender": "female"
  }
  photo: (binary file)
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
 onboarding_data: {
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
  }
  headshot: (binary file)
  license_files: (binary file array)
  photo: (binary file)
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

**Endpoints:** `POST /ai-search/`, `POST /ai-content-search/`, `POST /ai-coach-research/`  
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
