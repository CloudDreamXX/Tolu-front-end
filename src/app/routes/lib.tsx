import { Auth } from "pages/auth";
import {
  ContentManagerAiGenerated,
  ContentManagerApproved,
  ContentManagerArchived,
  ContentManagerCreatePage,
  ContentManagerDocument,
  ContentManagerFolder,
  ContentManagerInReview,
  ContentManagerPublished,
  FilesLibrary,
} from "pages/content-manager";
import { ContentManagerClients } from "pages/content-manager/clients";
import { ContentManagerMessages } from "pages/content-manager/messages";
import { ContentManagerProfile } from "pages/content-manager/profile";
import { HealthSnapshot } from "pages/health-snapshot";
import { Library } from "pages/library";
import { LibraryChat } from "pages/library-chat";
import { LibraryDocument } from "pages/library-document";
import { ClientMessages } from "pages/messages/ui";
import { ClientProfile } from "pages/profile";
import { UserManagement } from "pages/user-management";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Register } from "widgets/auth-forms";
import { CheckEmail } from "widgets/auth-forms/ui/check-email";
import { ForgotPassword } from "widgets/auth-forms/ui/forgot-password";
import { NewPassword } from "widgets/auth-forms/ui/new-password";
// import { Barriers } from "widgets/OnboardingClient/Barriers";
// import { ChooseTest } from "widgets/OnboardingClient/ChooseTest";
import { DemographicStep } from "widgets/OnboardingClient/DemographicStep";
import { FinishClientOnboarding } from "widgets/OnboardingClient/Finish";
// import { PersonalityType } from "widgets/OnboardingClient/PersonalityType";
// import { Readiness } from "widgets/OnboardingClient/Readiness";
import { Summary } from "widgets/OnboardingClient/Summary";
// import { Support } from "widgets/OnboardingClient/Support";
// import { Values } from "widgets/OnboardingClient/Values";
import { WelcomeScreen } from "widgets/OnboardingClient/WelcomeScreen";
// import { WhatBringsYouHere } from "widgets/OnboardingClient/WhatBringsYouHere";
import { AboutYourPractice } from "widgets/OnboardingPractitioner/about-your-practice";
import { InviteClients } from "widgets/OnboardingPractitioner/invite-clients";
import { OnboardingFinish } from "widgets/OnboardingPractitioner/onboarding-finish";
import { OnboardingMain } from "widgets/OnboardingPractitioner/onboarding-main";
import { OnboardingWelcome } from "widgets/OnboardingPractitioner/onboarding-welcome";
import { ProfileSetup } from "widgets/OnboardingPractitioner/profile-setup";
import { SelectType } from "widgets/OnboardingPractitioner/select-type";
import { SubscriptionPlan } from "widgets/OnboardingPractitioner/subscription-plan";
import { MainLayout, ProtectedRoute, RedirectContentToLibrary } from "./ui";
import { FeedbackHub } from "pages/feedback-hub/ui";
import { FeedbackDetails } from "pages/feedback-details";
import { AdminMessages } from "pages/admin-messages";
import { ContentManagement } from "pages/content-management";
import { ContentManagementDocument } from "pages/content-management-document";
import { usePageWidth } from "shared/lib";
import { SymptomsSeverity } from "widgets/OnboardingClient/SymptomsSeverity";
import { CheckInvite } from "widgets/auth-forms/ui/check-invite";
import { AdminProfile } from "pages/admin-profile";
import { AdminRequests } from "pages/admin-requests";

export const AppRoutes = () => {
  const { isMobileOrTablet } = usePageWidth();
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
      <Route path="/check-invite" element={<CheckInvite />} />
      <Route path="/accept-invite/:token" element={<Register />} />
      <Route path="join-via-referral/:token" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/about-your-practice" element={<AboutYourPractice />} />
      <Route path="/subscription-plan" element={<SubscriptionPlan />} />
      <Route path="/select-type" element={<SelectType />} />
      <Route path="/welcome/client" element={<WelcomeScreen />} />
      <Route path="/welcome/practitioner" element={<OnboardingWelcome />} />
      <Route path="/onboarding-welcome" element={<OnboardingMain />} />
      <Route path="/reset-password" element={<RedirectToNewPassword />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/invite-clients" element={<InviteClients />} />
      <Route path="/onboarding-finish" element={<OnboardingFinish />} />
      {/* <Route
        path="/welcome/client/personal-story"
        element={<OnboardingHealthProfile />}
      /> */}
      <Route path="/about-you" element={<DemographicStep />} />
      <Route path="/symptoms-severity" element={<SymptomsSeverity />} />
      {/* <Route path="/what-brings-you-here" element={<WhatBringsYouHere />} /> */}
      {/* <Route path="/values" element={<Values />} />
      <Route path="/barriers" element={<Barriers />} /> */}
      {/* <Route path="/support" element={<Support />} /> */}
      {/* <Route path="/personality-type" element={<PersonalityType />} /> */}
      {/* <Route path="/choose-test" element={<ChooseTest />} /> */}
      {/* <Route path="/readiness" element={<Readiness />} /> */}
      <Route path="/summary" element={<Summary />} />
      <Route path="/finish" element={<FinishClientOnboarding />} />
      <Route
        path="/content/:documentId"
        element={<RedirectContentToLibrary />}
      />
      <Route
        element={
          <MainLayout mainLocation="content-manager">
            <ProtectedRoute allowedRoles={["Practitioner"]} />
          </MainLayout>
        }
      >
        <Route
          path="/content-manager/profile"
          element={<ContentManagerProfile />}
        />
        <Route
          path="/content-manager/create"
          element={<ContentManagerCreatePage />}
        />
        <Route
          path="/content-manager/messages"
          element={<ContentManagerMessages />}
        />
        <Route
          path="/content-manager/messages/:chatId"
          element={<ContentManagerMessages />}
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
          path="/content-manager/library/:chatId"
          element={<LibraryChat />}
        />
        <Route
          path="/content-manager/:tab/folder/:folderId"
          element={<ContentManagerFolder />}
        />
        <Route
          path="/content-manager/:tab/folder/:folderId/chat/:chatId"
          element={<ContentManagerDocument />}
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
          element={
            <Navigate
              to={
                isMobileOrTablet
                  ? `/content-manager/library/new_chat_${Date.now()}`
                  : "/content-manager/create"
              }
            />
          }
        />
        <Route
          path="/content-manager/create"
          element={
            <Navigate
              to={
                isMobileOrTablet
                  ? `/content-manager/library/new_chat_${Date.now()}`
                  : "/content-manager/create"
              }
            />
          }
        />
        <Route
          path="/content-manager"
          element={
            <Navigate
              to={
                isMobileOrTablet
                  ? `/content-manager/library/new_chat_${Date.now()}`
                  : "/content-manager/create"
              }
            />
          }
        />
        <Route path="/content-manager/files" element={<FilesLibrary />} />
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
        <Route path="/messages/:chatId" element={<ClientMessages />} />
        <Route path="/messages/" element={<ClientMessages />} />
        <Route
          path="/library/document/:documentId"
          element={<LibraryDocument />}
        />
        <Route path="/profile" element={<ClientProfile />} />
      </Route>

      <Route
        element={
          <MainLayout mainLocation="user-management">
            <ProtectedRoute allowedRoles={["Admin", "Super Admin", "admin"]} />
          </MainLayout>
        }
      >
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/content-management" element={<ContentManagement />} />
        <Route
          path="/content-management/document/:documentId"
          element={<ContentManagementDocument />}
        />
        <Route path="/feedback" element={<FeedbackHub />} />
        <Route path="/feedback/details" element={<FeedbackDetails />} />
        <Route path="/admin-messages/:chatId?" element={<AdminMessages />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
      </Route>

      {/* 404 route */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

const RedirectToNewPassword = () => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");

  return <Navigate to="/new-password" replace state={{ token, email }} />;
};
