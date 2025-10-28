## Component Organization

The Tolu Health frontend follows the **Feature-Sliced Design (FSD)** architecture pattern.  
Each layer of the `src/` directory has a specific purpose and interaction rules to ensure modularity, scalability, and reusability.

## Frontend Code Structure

```bash
src/
├─ app/ # Application root: routing, providers, layouts
│ ├─ routes/ # Route configuration, guards, and layout wrappers
│ │ ├─ index.ts # Barrel file (exports lib and ui)
│ │ ├─ lib.tsx # Route logic, lazy loading, route guards
│ │ └─ ui.tsx # Route layouts and wrappers (header, sidebar, etc.)
│ ├─ providers/ # Redux, RTK Query, Theme, Router, Auth providers
│ └─ index.tsx # Entry composition of providers
│
├─ entities/ # Domain entities (core data and API logic)
│ ├─ admin/ # Admin-related data models and API endpoints
│ ├─ chat/ # Chat entities (threads, messages, RTK Query endpoints)
│ ├─ client/ # Client data and onboarding state
│ ├─ coach/ # Coach data, onboarding, and management APIs
│ ├─ content/ # Content items, quizzes, learning materials
│ ├─ document/ # Document metadata and file info
│ ├─ files-library/ # Coach file library (uploading, folder tree)
│ ├─ folder/ # Folder entity and folder-tree management
│ ├─ health-history/ # Health history API and types
│ ├─ notifications/ # Notification data and preferences
│ ├─ search/ # Search and AI query endpoints
│ ├─ symptoms-tracker/ # Daily symptoms tracking and logs
│ ├─ user/ # Authentication, tokens, and user profiles
│ └─ store/ # Redux store configuration, slices, and middleware
│
├─ features/ # Functional modules (user actions and isolated use cases)
│ ├─ chat/ # Chat logic and message interaction
│ ├─ chat-item/ # Chat preview (avatars, names, unread badges)
│ ├─ custom-nav-link/ # Reusable link with active-route logic
│ ├─ document-management/ # Document upload/edit flow
│ ├─ library-card/ # Content display card for learning materials
│ ├─ steps/ # Step-by-step forms (onboarding, registration)
│ └─ wrapper-folder-tree/ # Folder tree visualization and drag-drop logic
│
├─ widgets/ # Composite UI sections composed of features/entities
│ ├─ AddClientModal/ # Add client modal (form + API)
│ ├─ auth-error-boundary/ # Error boundary for authentication
│ ├─ auth-forms/ # Login/signup/password-reset forms
│ ├─ bad-rate-response-popup/ # Feedback popup with rating
│ ├─ BottomButtons/ # Persistent bottom button bar
│ ├─ Calendar/ # Calendar widget for scheduling/tracking
│ ├─ change-admin-status-popup/# Admin status change dialog
│ ├─ change-password-modal/ # Change password modal
│ ├─ ChooseSubfolderPopup/ # Folder selection popup
│ ├─ ChooseSubfolderPanel/ # Folder selection panel for file manager
│ ├─ client-edit-profile-modal/# Edit client profile modal
│ └─ other popups... # Additional reusable modal widgets
│
├─ pages/ # Route-level components (entire screens)
│ ├─ admin-messages/ # Admin chat and moderation
│ ├─ auth/ # Auth pages (login, register, reset)
│ ├─ content-management/ # Admin content list
│ ├─ content-manager/ # Coach content editing and management
│ ├─ feedback-hub/ # Feedback analytics overview
│ ├─ health-snapshot/ # Client’s health overview dashboard
│ ├─ library/ # General library view
│ ├─ library-chat/ # Chat within library content
│ ├─ library-document/ # Document view in library
│ ├─ onboarding-main/ # Client onboarding process
│ ├─ onboarding-welcome/# Initial onboarding welcome screen
│ ├─ profile/ # Profile management page
│ ├─ subscription-plan/# Subscription and billing settings
│ ├─ user-management/ # Admin list of users
│ ├─ messages/ # Client-Coach chat page
│ ├─ home/ # Dashboard landing page
│ └─ select-type/ # Role selection (coach/client)
│
├─ shared/ # Shared low-level utilities and base UI
│ ├─ api/ # Common API configurations (fetchBaseQuery, headers)
│ ├─ assets/ # Static images, icons, fonts
│ ├─ hooks/ # Global reusable hooks (useModal, useOutsideClick, etc.)
│ ├─ lib/ # Utilities (formatting, validation, helpers)
│ └─ ui/ # Pure UI primitives (buttons, inputs, modals, loaders)
│
├─ index.css # Global styles and Tailwind base layers
├─ main.tsx # Entry point: renders <App />, connects providers and routes
└─ vite-env.d.ts # Vite TypeScript environment definitions
```

## Layer Interaction Rules (Detailed Frontend Architecture)

The Tolu Health frontend project follows the **Feature-Sliced Design (FSD)** pattern.  
This structure enforces modularity, scalability, and a clear separation between data, logic, and UI presentation.

Each folder in `src/` corresponds to a logical layer in the application.

#### Barrel Files (`index.ts`)

Most folders include an `index.ts` file that acts as a **barrel file**, re-exporting components and utilities from that module.

This approach simplifies imports and keeps module boundaries clean.

**Example:**

```ts
// src/app/routes/index.ts
export * from "./lib";
export * from "./ui";
```

---

### 1. `app/` — Application Core and Routing Layer

This is the **root layer** of the frontend application.  
It defines how the app is initialized, routes are registered, and global providers are connected.

**Structure:**

- `routes/`
  - `ui.tsx` — high-level layout for routing (e.g., main layout with sidebar and header).
  - `lib.tsx` — defines route configuration and navigation tree, helper functions for route guards, redirects, or lazy loading.

**Responsibilities:**

- Initialize app (`main.tsx`)
- Register global providers (Redux, Theme, Router, RTK Query)
- Set up global error boundaries and suspense wrappers
- Manage routing structure for both public and protected routes

---

### 2. `entities/` — Domain Data and Business Logic Layer

Each folder inside `entities/` represents a **core domain model** of the platform.  
This is the layer where **RTK Query API slices, Redux slices, and types** are defined.

**Examples:**

| Entity              | Description                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| `admin/`            | Administrative APIs for user management, moderation, feedback, and chat oversight |
| `chat/`             | Handles chat messages, participants, files, and note management                   |
| `client/`           | Client data models, onboarding, and profile APIs                                  |
| `coach/`            | Coach onboarding, licensing, and client relationship management                   |
| `content/`          | Learning materials, quizzes, and AI-generated content                             |
| `document/`         | Document metadata and retrieval endpoints                                         |
| `files-library/`    | File and folder management for coaches                                            |
| `folder/`           | Folder structure representation and hierarchy operations                          |
| `health-history/`   | Client medical and lifestyle history records                                      |
| `notifications/`    | System notification API and preference settings                                   |
| `search/`           | AI-powered search and semantic matching endpoints                                 |
| `symptoms-tracker/` | Daily symptom tracking and AI suggestion APIs                                     |
| `user/`             | Authentication, JWT handling, and user profile operations                         |
| `store/`            | Global Redux store setup with middleware and slice registration                   |

**Responsibilities:**

- Define business entities and data contracts
- Encapsulate data fetching and normalization via RTK Query
- Provide typed models and constants to `features` and `widgets`

---

### 3. `features/` — Functional Use Case Layer

This layer implements **specific user actions and interactive features**, connecting UI with business logic from `entities`.

Each subfolder corresponds to an isolated **use case** or **user interaction scenario**.

**Examples:**

| Folder                 | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `chat/`                | Chat input, message sending, and typing indicators              |
| `chat-item/`           | Chat preview component (name, avatar, last message)             |
| `custom-nav-link/`     | Navigation link with active route highlighting                  |
| `document-management/` | Document upload, edit, and version control                      |
| `library-card/`        | UI card for displaying library content items                    |
| `steps/`               | Step-based forms (e.g., onboarding flows, registration wizards) |
| `wrapper-folder-tree/` | File/folder hierarchy tree and drag-drop logic                  |

**Responsibilities:**

- Combine shared UI components with entity logic
- Manage isolated state for small features
- Provide reusable hooks (`useChatActions`, `useUploadDocument`)
- Expose ready-to-use UI blocks to `widgets` and `pages`

---

### 4. `widgets/` — Composite UI Components

Widgets are **modular, reusable interface blocks** composed of multiple features and entities.  
They are typically larger than a single feature but smaller than a page.

**Examples:**

| Widget                      | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `AddClientModal`            | Modal for adding a new client, includes validation and API call. |
| `auth-error-boundary`       | Handles authentication-related runtime errors gracefully.        |
| `auth-forms`                | Contains login, signup, and password recovery forms.             |
| `bad-rate-response-popup`   | Popup shown for failed or invalid rating submissions.            |
| `BottomButtons`             | Sticky footer buttons for mobile or form navigation.             |
| `Calendar`                  | Calendar view for scheduling or tracking sessions.               |
| `change-admin-status-popup` | Modal for changing admin privileges.                             |
| `change-password-modal`     | User password update dialog.                                     |
| `ChangeStatusPopup`         | Generic entity status change modal.                              |
| `ChooseSubfolderPanel`      | Panel for selecting subfolders during file organization.         |
| `ChooseSubfolderPopup`      | Popup for selecting destination subfolders.                      |
| `client-edit-profile-modal` | Edit form for client profile details.                            |
| `ConfirmCancelModal`        | Confirmation dialog for cancel actions.                          |
| `ConfirmDeleteModal`        | Confirmation dialog for delete actions.                          |
| `ConfirmDiscardModal`       | Confirms discarding unsaved changes.                             |
| `ConfirmModal`              | General-purpose confirmation modal.                              |
| `content-popovers`          | Tooltip/popover wrappers for contextual UI hints.                |
| `conversation-item`         | Single chat or conversation preview item.                        |
| `conversation-list`         | List view of multiple chat conversations.                        |
| `couch-edit-profile-modal`  | Modal for editing practitioner or “coach” profiles.              |
| `CreateSubfolderPopup`      | UI for creating a new subfolder.                                 |
| `CRMSelectField`            | Custom select field for CRM-related inputs.                      |
| `CustomRadio`               | Styled radio input component with enhanced accessibility.        |
| `date-of-birth-picker`      | Date picker specialized for birth date input.                    |
| `date-time-picker`          | Combined date and time selector widget.                          |
| `dayli-journal`             | Client daily journal entry view/editor.                          |
| `DeleteMessagePopup`        | Confirmation popup for message deletion.                         |
| `document-breadcrumbs`      | Breadcrumb navigation for document hierarchy.                    |
| `document-header`           | Header bar for document views.                                   |
| `document-info-header`      | Displays metadata (author, date, etc.) for a document.           |
| `EditClientModal`           | Modal for editing existing client information.                   |
| `EditDocumentPopup`         | Popup for editing document properties.                           |
| `empty-state-tolu`          | Empty-state display for list or page with no data.               |
| `file-item`                 | Represents a single file in a list/grid view.                    |
| `file-message-item`         | Message bubble with attached file.                               |
| `filters-popup`             | Popup for applying list or table filters.                        |
| `Footer`                    | Global footer layout component.                                  |
| `Header`                    | Main header bar/navigation for app layout.                       |
| `HeaderOnboarding`          | Header variant for onboarding screens.                           |
| `health-profile-form`       | Form for capturing user health data.                             |
| `HealthGoalsCard`           | Displays health goals and progress tracking.                     |
| `HealthTable`               | Tabular view of health-related data points.                      |
| `LanguagesMultiSelect`      | Multi-select dropdown for choosing languages.                    |
| `library-client-content`    | Content section for client resource library.                     |
| `library-small-chat`        | Compact chat panel embedded in library views.                    |
| `MenopauseModals`           | Group of modals for menopause-related flow handling.             |
| `message-bubble`            | Visual bubble for individual chat messages.                      |
| `message-input`             | Input box for composing chat messages.                           |
| `message-list`              | Container showing the list of chat messages.                     |
| `message-sidebar`           | Sidebar with conversation participants or threads.               |
| `message-tabs`              | Tabs for switching between chat contexts.                        |
| `MoodScore`                 | Displays mood score graph or metric for user tracking.           |
| `MultiSelectField`          | Generic multi-select input field.                                |
| `navigations`               | Navigation components (breadcrumbs, side menus, etc.).           |
| `notes-item`                | Single note element in a notes list.                             |
| `OnboardingClient`          | Client-side onboarding flow component.                           |
| `OnboardingPractitioner`    | Practitioner-side onboarding flow component.                     |
| `RatePopup`                 | Popup for user rating or feedback submission.                    |
| `ReferAFriendPopup`         | Modal for inviting or referring new users.                       |
| `SelectedClientModal`       | Displays information of the currently selected client.           |
| `share-popup`               | Modal for sharing files, documents, or links.                    |
| `sidebars`                  | Collection of sidebars used across the app.                      |
| `StepperWithLabels`         | Stepper component with labeled steps for guided flows.           |
| `switch-group`              | Grouped toggle switches for preference settings.                 |
| `TimelineItem`              | Timeline component representing a dated activity.                |
| `upload-client-modal`       | Modal for uploading client-related documents.                    |
| `user-engagement-sidebar`   | Sidebar for engagement analytics or user activity.               |

**Responsibilities:**

- Combine multiple `features` and `entities` into a single UI unit
- Handle intermediate business logic at UI level (form validation, state sync)
- Reusable between multiple `pages` (e.g., Dashboard and Profile use same widgets)

---

### 5. `pages/` — Route-Level Components (Screens)

Each folder inside `pages/` corresponds to a full **application route** (screen).  
Pages combine widgets, features, and entities to render complete UI flows.

**Examples:**

| Page                                             | Description                                    |
| ------------------------------------------------ | ---------------------------------------------- |
| `admin-messages/`                                | Admin chat and moderation dashboard            |
| `auth/`                                          | Login, registration, password reset screens    |
| `content-management/`                            | Admin interface for managing published content |
| `content-manager/`                               | Coach content editor and library management    |
| `feedback-hub/` / `feedback-details/`            | Feedback analytics and details view            |
| `health-snapshot/`                               | Summary of client’s health and progress        |
| `home/`                                          | Main dashboard landing page                    |
| `library/`, `library-chat/`, `library-document/` | Content and AI library pages                   |
| `messages/`                                      | Chat and direct messaging interface            |
| `onboarding-main/`, `onboarding-welcome/`        | Client and coach onboarding flows              |
| `profile/`                                       | Profile management screen for client or coach  |
| `subscription-plan/`                             | Subscription and payment management            |
| `user-management/`                               | Admin user list and controls                   |

**Responsibilities:**

- Represent top-level route components
- Connect global layout (`app/routes/ui.tsx`) with page content
- Compose multiple widgets and features into full-page experiences

---

### 6. `shared/` — Cross-Layer Foundation

The `shared/` folder contains **fundamental, reusable code** that can be used anywhere in the project.

**Subfolders:**

- `api/` → global API helpers and configurations
- `assets/` → static assets like logos, icons, illustrations
- `hooks/` → global React hooks (e.g., `useModal`, `useClickOutside`, `useTheme`)
- `lib/` → pure JS/TS utilities (date, validation, sanitization, formatting)
- `ui/` → reusable UI primitives (buttons, inputs, modals, loaders)

**Responsibilities:**

- Provide building blocks for all other layers
- Must not depend on any higher layer
- Contain no business-specific logic

---

### Summary

- **`app/`** → Bootstraps the app, sets up routing and providers
- **`entities/`** → Defines domain logic and API communication
- **`features/`** → Implements specific functional use cases
- **`widgets/`** → Builds larger composite UI elements
- **`pages/`** → Assembles full user-facing screens
- **`shared/`** → Foundation layer for utilities, hooks, and UI primitives

This layered structure allows for predictable imports, clean scalability, and maintainable development across a growing frontend codebase.

### Component Types

| Type                    | Purpose                                                | Example                          |
| ----------------------- | ------------------------------------------------------ | -------------------------------- |
| **UI Component**        | Pure presentational elements (buttons, inputs, modals) | `shared/ui/Button.tsx`           |
| **Container Component** | Connects logic and data (uses hooks, RTK Query, etc.)  | `features/auth/ui/LoginForm.tsx` |
| **Page Component**      | Route-level component composed of widgets              | `pages/DashboardPage.tsx`        |
| **Widget Component**    | Reusable composition of features/entities              | `widgets/ClientProfileCard.tsx`  |

### Key Principles

- **Separation of concerns:** UI, logic, and data are isolated by layers.
- **Scalability:** New features are added as isolated modules.
- **Reusability:** Shared components live in `/shared` and are dependency-free.
- **Predictable imports:** Higher layers can use lower ones, never vice versa.
