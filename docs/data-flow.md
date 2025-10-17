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
``` json
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
``` json
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
```json
multipart/form-data
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
``` json
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

We use that onboarding info to show in coach and client profiles and client's health history.


