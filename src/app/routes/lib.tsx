import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout, ProtectedRoute } from "./ui";
import { Auth } from "pages/auth";
import {
  ContentManagerCreatePage,
  ContentManagerDocument,
  ContentManagerAiGenerated,
  ContentManagerInReview,
  ContentManagerApproved,
  ContentManagerFolder,
  ContentManagerPublished,
  ContentManagerArchived,
} from "pages/content-manager";
import { ForgotPassword } from "widgets/auth-forms/ui/forgot-password";
import { NewPassword } from "widgets/auth-forms/ui/new-password";
import { Register } from "widgets/auth-forms";
import { CheckEmail } from "widgets/auth-forms/ui/check-email";
import { OnboardingWelcome } from "widgets/OnboardingPractitioner/onboarding-welcome";
import { OnboardingMain } from "widgets/OnboardingPractitioner/onboarding-main";
import { SubscriptionPlan } from "widgets/OnboardingPractitioner/subscription-plan";
import { SelectType } from "widgets/OnboardingPractitioner/select-type";
import { AboutYourPractice } from "widgets/OnboardingPractitioner/about-your-practice";
import { ProfileSetup } from "widgets/OnboardingPractitioner/profile-setup";
import { InviteClients } from "widgets/OnboardingPractitioner/invite-clients";
import { OnboardingFinish } from "widgets/OnboardingPractitioner/onboarding-finish";
import { WelcomeScreen } from "widgets/OnboardingClient/WelcomeScreen";
import { DemographicStep } from "widgets/OnboardingClient/DemographicStep";
import { WhatBrringsYouHere } from "widgets/OnboardingClient/WhatBringsYouHere";
import { Values } from "widgets/OnboardingClient/Values";
import { Barriers } from "widgets/OnboardingClient/Barriers";
import { Support } from "widgets/OnboardingClient/Support";
import { PersonalityType } from "widgets/OnboardingClient/PersonalityType";
import { ChooseTest } from "widgets/OnboardingClient/ChooseTest";
import { Readiness } from "widgets/OnboardingClient/Readiness";
import { Summary } from "widgets/OnboardingClient/Summary";
import { FinishClientOnboarding } from "widgets/OnboardingClient/Finish";
import { HealthSnapshot } from "pages/health-snapshot";
import { Library } from "pages/library";
import { ContentManagerClients } from "pages/content-manager/clients";
import { ContentManagerLibrary } from "pages/content-manager/library";
import { LibraryChat } from "pages/library-chat";
import { ContentManagerMessages } from "pages/content-manager/messages";
import { UserManagement } from "pages/user-management";
import { LibraryDocument } from "pages/library-document";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["guest"]} />}></Route>
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify-email" element={<CheckEmail from="register" />} />
      <Route
        path="/verify-email-pass"
        element={<CheckEmail from="forgot-password" />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/accept-invite/:token" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/about-your-practice" element={<AboutYourPractice />} />
      <Route path="/subscription-plan" element={<SubscriptionPlan />} />
      <Route path="/select-type" element={<SelectType />} />
      <Route path="/welcome/client" element={<WelcomeScreen />} />
      <Route path="/welcome/practitioner" element={<OnboardingWelcome />} />
      <Route path="/onboarding-welcome" element={<OnboardingMain />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/invite-clients" element={<InviteClients />} />
      <Route path="/onboarding-finish" element={<OnboardingFinish />} />
      <Route path="/about-you" element={<DemographicStep />} />
      <Route path="/what-brings-you-here" element={<WhatBrringsYouHere />} />
      <Route path="/values" element={<Values />} />
      <Route path="/barriers" element={<Barriers />} />
      <Route path="/support" element={<Support />} />
      <Route path="/personality-type" element={<PersonalityType />} />
      <Route path="/choose-test" element={<ChooseTest />} />
      <Route path="/readiness" element={<Readiness />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/finish" element={<FinishClientOnboarding />} />
      <Route
        element={
          <MainLayout mainLocation="content-manager">
            <ProtectedRoute allowedRoles={["Practitioner"]} />
          </MainLayout>
        }
      >
        <Route
          path="/content-manager/create"
          element={<ContentManagerCreatePage />}
        />
        <Route
          path="/content-manager/messages"
          element={<ContentManagerMessages />}
        />
        <Route
          path="/content-manager/library"
          element={<ContentManagerLibrary />}
        />
        <Route
          path="/content-manager/ai-generated"
          element={<ContentManagerAiGenerated />}
        />
        <Route
          path="/content-manager/in-review"
          element={<ContentManagerInReview />}
        />
        <Route
          path="/content-manager/approved"
          element={<ContentManagerApproved />}
        />
        <Route
          path="/content-manager/published"
          element={<ContentManagerPublished />}
        />
        <Route path="/clients" element={<ContentManagerClients />} />
        <Route
          path="/content-manager/archived"
          element={<ContentManagerArchived />}
        />
        <Route
          path="/content-manager/:tab/folder/:folderId"
          element={<ContentManagerFolder />}
        />
        <Route
          path="/content-manager/:tab/folder/:folderId/document/:documentId"
          element={<ContentManagerDocument />}
        />
        <Route
          path="/content-manager/published"
          element={<div>Published</div>}
        />
        <Route
          path="*"
          element={<Navigate to={"/content-manager/library"} />}
        />
        <Route
          path="/content-manager"
          element={<Navigate to={"/content-manager/library"} />}
        />
      </Route>

      <Route
        element={
          <MainLayout mainLocation="library">
            <ProtectedRoute allowedRoles={["Client"]} />
          </MainLayout>
        }
      >
        <Route path="/health-snapshot" element={<HealthSnapshot />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:chatId" element={<LibraryChat />} />
        <Route path="/library/document/:documentId" element={<LibraryDocument />} />
      </Route>

      <Route
        element={
          <MainLayout mainLocation="user-management">
            <ProtectedRoute allowedRoles={["Admin", "Super Admin", "admin"]} />
          </MainLayout>
        }
      >
        <Route path="/user-management" element={<UserManagement />} />
      </Route>

      {/* 404 route */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};
