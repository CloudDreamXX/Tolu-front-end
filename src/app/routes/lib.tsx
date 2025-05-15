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
import { OnboardingWerlcome } from "widgets/OnboardingPractitioner/onboarding-welcome";
import { OnboardingMain } from "widgets/OnboardingPractitioner/onboarding-main";
import { SubscriptionPlan } from "widgets/OnboardingPractitioner/subscription-plan";
import { SelectType } from "widgets/OnboardingPractitioner/select-type";
import { AboutYourPractice } from "widgets/OnboardingPractitioner/about-your-practice";
import { ProfileSetup } from "widgets/OnboardingPractitioner/profile-setup";
import { InviteClients } from "widgets/OnboardingPractitioner/invite-clients";
import { OnboardingFinish } from "widgets/OnboardingPractitioner/onboarding-finish";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["guest"]} />}></Route>
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify-email" element={<CheckEmail from="register"/>} />
      <Route path="/verify-email-pass" element={<CheckEmail from="forgot-password" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/about-your-practice" element={<AboutYourPractice />} />
      <Route path="/subscription-plan" element={<SubscriptionPlan />} />
      <Route path="/select-type" element={<SelectType />} />
      <Route path="/welcome" element={<OnboardingWerlcome />} />
      <Route path="/onboarding-welcome" element={<OnboardingMain />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/invite-clients" element={<InviteClients />} />
      <Route path="/onboarding-finish" element={<OnboardingFinish />} />

      <Route
        element={
          <MainLayout mainLocation="content-manager">
            <ProtectedRoute allowedRoles={["guest", "admin", "coaches"]} />
          </MainLayout>
        }
      >
        <Route
          path="/content-manager/create"
          element={<ContentManagerCreatePage />}
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
        <Route
          path="/content-manager/archived"
          element={<ContentManagerArchived />}
        />
        <Route
          path="/content-manager/:tab/folder/:folderId"
          element={<ContentManagerFolder />}
        />
        <Route
          path="/content-manager/:tab/document/:folderId/:documentId"
          element={<ContentManagerDocument />}
        />
        <Route
          path="/content-manager/published"
          element={<div>Published</div>}
        />
        <Route
          path="*"
          element={<Navigate to={"/content-manager/published"} />}
        />
        <Route
          path="/content-manager"
          element={<Navigate to={"/content-manager/published"} />}
        />
      </Route>

      {/* 404 route */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};
