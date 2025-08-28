import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { NavigationItem } from "./model";

export const navigationItems: NavigationItem[] = [
  {
    title: "Content Manager",
    mainLink: "/content-manager",
    links: [
      {
        title: "Create New Content",
        link: "/content-manager/create",
        icon: <></>,
      },
      {
        title: "Approved",
        link: "/content-manager/approved",
        icon: <MaterialIcon iconName="person_search" fill={1} />,
      },
      {
        title: "AI-Generated",
        link: "/content-manager/ai-generated",
        icon: <MaterialIcon iconName="stars_2" fill={1} />,
      },
      {
        title: "Published",
        link: "/content-manager/published",
        icon: <></>,
      },
      {
        title: "In Review",
        link: "/content-manager/in-review",
        icon: <MaterialIcon iconName="mystery" fill={1} />,
      },
      {
        title: "Archived",
        link: "/content-manager/archived",
        icon: <></>,
      },
    ],
  },
  {
    title: "Storefront",
    mainLink: "/storefront",
    additionalTitle: "Health Shop",
    links: [
      {
        title: "My Content Shop",
        link: "/storefront/my-content-shop",
        icon: <></>,
      },
      {
        title: "Recommended Products",
        link: "/storefront/recommended-products",
        icon: <MaterialIcon iconName="thumb_up" />,
      },
      {
        title: "Reviews & Ratings",
        link: "/storefront/reviews-ratings",
        icon: <MaterialIcon iconName="star" />,
      },
      {
        title: "Referral Links",
        link: "/storefront/referral-links",
        icon: <></>,
      },
      {
        title: "Earnings from Content",
        link: "/storefront/earnings",
        icon: <MaterialIcon iconName="paid" />,
      },
      {
        title: "Product Sales & Commissions",
        link: "/storefront/product-sales",
        icon: <></>,
      },
      {
        title: "Storefront Settings",
        link: "/storefront/settings",
        icon: <MaterialIcon iconName="settings" />,
      },
      {
        title: "Shop Configuration",
        link: "/storefront/shop-configuration",
        icon: <></>,
      },
    ],
  },
  {
    title: "Clients",
    mainLink: "/clients",
    links: [
      {
        title: "My Clients",
        link: "/clients/my-clients",
        icon: <MaterialIcon iconName="person" />,
      },
      {
        title: "Assigned Content",
        link: "/clients/assigned-content",
        icon: <></>,
      },
      {
        title: "Add New Client",
        link: "/clients/add-new-client",
        icon: <MaterialIcon iconName="person_add" />,
      },
      {
        title: "Client Notes & Forms",
        link: "/clients/notes-forms",
        icon: <></>,
      },
      {
        title: "Client Folders",
        link: "/clients/client-folders",
        icon: <></>,
      },
    ],
  },
  {
    title: "Messaging",
    mainLink: "/messaging",
    links: [
      {
        title: "Inbox",
        link: "/messaging/inbox",
        icon: <></>,
      },
      {
        title: "New Message",
        link: "/messaging/new-message",
        icon: <></>,
      },
      {
        title: "Client Replies",
        link: "/messaging/client-replies",
        icon: <MaterialIcon iconName="reply" />,
      },
      {
        title: "Group Messages",
        link: "/messaging/group-messages",
        icon: <MaterialIcon iconName="groups" />,
      },
    ],
  },
  {
    title: "Insights",
    mainLink: "/insights",
    variant: "small",
    links: [
      {
        title: "Content Performance",
        link: "/insights/content-performance",
        icon: <></>,
      },
      {
        title: "Subscription & Plan",
        link: "/insights/subscription-plan",
        icon: <></>,
      },
      {
        title: "Top Performing Topics",
        link: "/insights/top-performing-topics",
        icon: <MaterialIcon iconName="star" />,
      },
    ],
  },
  {
    title: "Community",
    mainLink: "/community",
    links: [
      {
        title: "Coach Community",
        link: "/community/coach-community",
        icon: <></>,
      },
      {
        title: "Create Group Study",
        link: "/community/create-group-study",
        icon: <></>,
      },
      {
        title: "My Groups",
        link: "/community/my-groups",
        icon: <MaterialIcon iconName="groups" />,
      },
      {
        title: "Invite Clients",
        link: "/community/invite-clients",
        icon: <></>,
      },
    ],
  },
  {
    title: "Settings",
    mainLink: "/settings",
    links: [
      {
        title: "Profile & Credentials",
        link: "/settings/profile-credentials",
        icon: <></>,
      },
      {
        title: "Connected Tools",
        titleAdditional: "wearables/labs",
        link: "/settings/account-connections",
        icon: <MaterialIcon iconName="manage_accounts" />,
      },
      {
        title: "Payment Setup",
        link: "/settings/payment-setup",
        icon: <></>,
      },
      {
        title: "Notification Preferences",
        link: "/settings/notification-preferences",
        icon: <></>,
      },
    ],
  },
];
