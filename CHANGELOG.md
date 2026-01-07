## [1.8.0] - 2026-01-07

### New feature

- Add abillity to the coach to highlight text in the chat and add to client notes.
- The client health profile is visible in the message area, and access is visible by clicking on the name of the client.
- Add tabs Quick view, Notes, Labs, Files, Chat, Providers, Biometrics, Journals in the message area.
- Fix displaying of users first and last name in messages sidebar.
- Fix notifications integration to show a notification inside of a platform for a new message.
- Add ability for emojies rection to messages.
- Add preview for files inside of File library and Files tab in messaging.

## [1.7.0] - 2025-12-17

### New feature

- Add access code to the invitation email for new client.
- Add check if the client exists before inviting him to join the platform and popup to inform about that.
- Add banner on existing client's platform that the coach invited her/him.
- Add endpoint to decline coach invitation.

## [1.6.4] - 2025-12-08

### Fixes & Minor Changes

- Add a link that will lead to our website with form to request access opened on the screen with code input for sign up.
- Update styles for successfully submited form on the website.
- Send requests to support@tolu.health only.
- Add an additional field to the form: How did you hear about Tolu?
- Add field Source for super admin requests.
- Fix search bar size on the Files library page.
- Limit the size of the email block in the clients table so that the text cannot overlap other blocks.
- Remove the question “Didn't receive the code?” on the Forgot password page near the emal input.

## [1.6.3] - 2025-12-03

### Fixes & Minor Changes

- Hide status "In review" for content.
- Restrict editing of published content.
- Move User engagement block above the content in a popover.
- Keep the sidebar expanded when content is opened.
- Shrink chat window to minimum when content is opened.
- Fix initial chat bot for the client.

## [1.6.2] - 2025-11-28

### Fixes & Minor Changes

- Update styles for User Engagement block.
- Move scrollbar to the block of document content.
- Fix displaying of clients names in Add client(s) dropdown on Messages page.
- Fix delete user action for Super admin.
- Fix error in client invitation.
- Fix displaying of coach's data in Providers popup.
- Fix coach onboarding error on the coach profile page.
- Fix the last delete popup to appear above the button in super admin users table.

## [1.6.1] - 2025-11-21

### Fixes & Minor Changes

- Fix login with empty onboarding data.
- Fix password validation to deny passwords without special character.
- Fix opening new chat error.
- Fix first name and last name of the participants in the chats.
- Allow coach to view profile of clients with pending status.
- Add signup_date to the client profile card for coaches.
- Fix delete user action for super admin.

## [1.6.0] - 2025-11-20

### New feature

- New page Requests for Super admin, where he can approve or deny request for sign up.
- New sign up flow: Add OTP code for the user to know if he is allowed to sign up.
- Prefill sign up form with user's info from the request to sign up.

## [1.5.0] - 2025-11-17

### New feature

- Add super admin profile page.
- Add abillity for super admin to change password.
- Add abillity for super admin to delete users.
- Change password validation to have at least 12 symbols.
- Reuse shadcn input otp for login with abillity to copy-paste the code.

## [1.4.1] - 2025-11-12

### Fixes & Minor Changes

- Fix delete folder action in the popup.
- Update client Chatbot UI.
- Add email in the top of the client's opened card.
- Fix linked coach name in the client library.
- Fix saving of 'Metabolic & digestive health' fields.
- Remove 'Content & submissions' from health profile.
- Fix dropdown top position in SelectField.
- Implement resizable chat.
- Fix height of the clients popup.
- Fix tables view in the coach assistant bot.

## [1.4.0] - 2025-11-05

### New feature

- Implement new chatwindow for coach.
- Add new chat bot Coach assistant.
- Move actions to be under each ai message, not for all chat (coach).
- Move Profile and Exit buttons from header to the sidebar (coach).
- Update displaying of the attached file in the chatwindow.
- Remove gap between field and dropdown in up position.

## [1.3.1] - 2025-10-28

### Fixes & Minor Changes

- Fix dropdown position and height to appear top or bottom depending on the page height.
- Add development-and-deployment.md and component-organization.md.
- Remove Diet type from Nutrition Habits and move there Specific diet from Lifestyle & Habits.
- Remove item from drop-down list - "Irregular periods".
- Add explanations for "Cycle status" options as on the onboarding.
- Add Close button to the Multiple chat settings modal.
- Close all popups and modals on outside click.
- Make Submit and Next buttons inactive if nothing was selected in Cards.
- Make See result button in Cards to appear immediately, not after refreshing the page.
- Fix displaying of the symptoms in onboarding summary to show all the symptoms, not only changed ones.
- Remove "You're all set" page.
- Remove footer about privacy.
- Remove book image in empty articles view.
- Remove PDFs support for certificates and licenses.
- Go to the first incomplete step in onboarding for coach after login.

## [1.3.0] - 2025-10-21

### New feature

- Add docs/data-flow.md.
- Add onboarding popup for users with unfinished onboarding(coach and client)
- First and last name for invitations instead of full name.
- Change weekly meals field (client onboarding) to multiselect.
- Add drop-down with a list for the States (sign up).
- Add calculated age from the BE for client profile instead of using age from FE.
- Add two fields first and last name everywhere instead of full name.

## [1.2.1] - 2025-10-16

### Fixes & Minor Changes

- Update all FE data models and interfaces (e.g., User, Coach, Client, Profile, Onboarding, Message) to include: first_name, last_name, calculated_age.
- Replace old name usage to use first_name and last_name for initials everywhere.
- Fix downloading coach and client profile photo and fix edit coach profile.
- Fix slider for symptoms severity to have separate lines and smooth transition.
- Fix invitation errors conflict.
- Handle second try to accept coach invitation.
- Fix displaying of phone numbers.
- Fix 403 error from fetch all chats endpoint.

## [1.2.0] - 2025-10-14

### New feature

- Fix voices for Read aloud action.
- Add voice input for Smart Search bot.
- Implement 2fa sign in.
- Rewrite user block to RTK query.
- Fix Slider for client onboarding.
- Fix coach information modal for client.

## [1.1.0] - 2025-10-13

### New feature

- Add learning card chat bot.
- Change icon for cards in the sidebar.
- Change admin content management view.
- Add abillity to edit cards.
- Add tracking progress for client cards.

## [1.0.4] - 2025-10-13

### Fixes & Minor Changes

- Fix super admin accept and reject actions.
- Fix sending files in the chats.
- Fix bulleted lists in the coach edit action.
- Fix client layout.
- Fix location of the article.
- Complete the Check invite flow.
- Fix invite client flow to show client info in the sign up form.
- Fix displaying of the coach's data in the client library.
- Fix selection of the year in Edit client profile modal.
- Update coach, client, files library, folders, document, admin, chat, content, health history, notifications, symptoms tracker endpoints to use RTK query
- Fix edit client profile endpoint.
- Update coach and client onboardings.

## [1.0.3] - 2025-10-02

### Fixes & Minor Changes

- Fix search input for files library.
- Fix create and update health history.
- Update daily journal on the profile page to show data from the BE and add actions to the buttons.
- Fix learn bot answers.
- Fix multiselect field.
- Fix delete files library.
- Fix open new chat on mobile.
- Add client id for research.

## [1.0.2] - 2025-09-30

### Fixes & Minor Changes

- Update client onboarding.
- Update links in chat bots ai answers.
- Fix coach profile loading.
- Update intake form in coach profile.
- Add loading skeleton for files library page.
- Fix slider.

## [1.0.1] - 2025-09-29

### Fixes & Minor Changes

- Fix multiselect scroll down to see all options.
- Change bot selectors to dropdown on the top.
- Fix create group chat to include participants.
- Fix sending content_id when a text_quote is being sent.
- Integrate ability to attach files from files library as a coach in Messaging.
- Implement the ability to preview added library files in popover.
- Fix bullet points and numbers after editing the document.
- Fix links view in ai answers in the chat bot.
- Add loading skeleton for profile pages.
- Fix login error.
- Fix coach invitation.
- Fix research to correctly show links as blocks.
- Change meta description.
- Fix created document view.
