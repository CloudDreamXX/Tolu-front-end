import { NavigationItem } from "./model";
import EditCreate from "shared/assets/icons/edit-create";
import Sparkle from "shared/assets/icons/sparkle";
import Review from "shared/assets/icons/review";
import Approved from "shared/assets/icons/approved";
import Published from "shared/assets/icons/published";
import Layer from "shared/assets/icons/layer";
import Content from "shared/assets/icons/content";
import Star from "shared/assets/icons/star";
import Coins from "shared/assets/icons/coins";
import Setting from "shared/assets/icons/setting";
import Recomended from "shared/assets/icons/recomended";
import Referral from "shared/assets/icons/referral";
import Product from "shared/assets/icons/product";
import Shop from "shared/assets/icons/shop";
import User from "shared/assets/icons/user";
import Assigned from "shared/assets/icons/assigned";
import UserPlus from "shared/assets/icons/user-plus";
import Note from "shared/assets/icons/note";
import Folder from "shared/assets/icons/folder";
import Inbox from "shared/assets/icons/inbox";
import Message from "shared/assets/icons/message";
import Reply from "shared/assets/icons/reply";
import Users from "shared/assets/icons/users";
import LaptopPerformance from "shared/assets/icons/laptop-performance";
import MoneyLinear from "shared/assets/icons/money-linear";
import Leader from "shared/assets/icons/leader";
import File from "shared/assets/icons/file";
import Mail from "shared/assets/icons/mail";
import Profile from "shared/assets/icons/profile";
import Tools from "shared/assets/icons/tools";
import Payment from "shared/assets/icons/payment";
import Notification from "shared/assets/icons/notification";

export const navigationItems: NavigationItem[] = [
  {
    title: "Content Manager",
    mainLink: "/content-manager",
    links: [
      {
        title: "Create New Content",
        link: "/content-manager/create",
        icon: <EditCreate />,
      },
      {
        title: "Approved",
        link: "/content-manager/approved",
        icon: <Approved />,
      },
      {
        title: "AI-Generated",
        link: "/content-manager/ai-generated",
        icon: <Sparkle />,
      },
      {
        title: "Published",
        link: "/content-manager/published",
        icon: <Published />,
      },
      {
        title: "In Review",
        link: "/content-manager/in-review",
        icon: <Review />,
      },
      {
        title: "Archived",
        link: "/content-manager/archived",
        icon: <Layer />,
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
        icon: <Content />,
      },
      {
        title: "Recommended Products",
        link: "/storefront/recommended-products",
        icon: <Recomended />,
      },
      {
        title: "Reviews & Ratings",
        link: "/storefront/reviews-ratings",
        icon: <Star />,
      },
      {
        title: "Referral Links",
        link: "/storefront/referral-links",
        icon: <Referral />,
      },
      {
        title: "Earnings from Content",
        link: "/storefront/earnings",
        icon: <Coins />,
      },
      {
        title: "Product Sales & Commissions",
        link: "/storefront/product-sales",
        icon: <Product />,
      },
      {
        title: "Storefront Settings",
        link: "/storefront/settings",
        icon: <Setting />,
      },
      {
        title: "Shop Configuration",
        link: "/storefront/shop-configuration",
        icon: <Shop />,
      },
    ],
  },
  {
    title: "Clients",
    mainLink: "/clients",
    links: [
      { title: "My Clients", link: "/clients/my-clients", icon: <User /> },
      {
        title: "Assigned Content",
        link: "/clients/assigned-content",
        icon: <Assigned />,
      },
      {
        title: "Add New Client",
        link: "/clients/add-new-client",
        icon: <UserPlus />,
      },
      {
        title: "Client Notes & Forms",
        link: "/clients/notes-forms",
        icon: <Note />,
      },
      {
        title: "Client Folders",
        link: "/clients/client-folders",
        icon: <Folder />,
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
        icon: <Inbox />,
      },
      {
        title: "New Message",
        link: "/messaging/new-message",
        icon: <Message />,
      },
      {
        title: "Client Replies",
        link: "/messaging/client-replies",
        icon: <Reply />,
      },
      {
        title: "Group Messages",
        link: "/messaging/group-messages",
        icon: <Users />,
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
        icon: <LaptopPerformance />,
      },
      {
        title: "Subscription & Plan",
        link: "/insights/subscription-plan",
        icon: <MoneyLinear />,
      },
      {
        title: "Top Performing Topics",
        link: "/insights/top-performing-topics",
        icon: <Star />,
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
        icon: <Leader />,
      },
      {
        title: "Create Group Study",
        link: "/community/create-group-study",
        icon: <File />,
      },
      {
        title: "My Groups",
        link: "/community/my-groups",
        icon: <Users />,
      },
      {
        title: "Invite Clients",
        link: "/community/invite-clients",
        icon: <Mail />,
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
        icon: <Profile />,
      },
      {
        title: "Connected Tools",
        titleAdditional: "wearables/labs",
        link: "/settings/account-connections",
        icon: <Tools />,
      },
      {
        title: "Payment Setup",
        link: "/settings/payment-setup",
        icon: <Payment />,
      },
      {
        title: "Notification Preferences",
        link: "/settings/notification-preferences",
        icon: <Notification />,
      },
    ],
  },
];
