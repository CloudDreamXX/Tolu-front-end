export interface Content {
  title: string;
  description: string;
  link?: string;
  includes?: string[];
  icon?: React.ReactNode;
}

type Contents = Content[];

export const contents: Contents = [
  {
    title: "Privacy Policy",
    description:
      "Welcome to Tolu! As an Educator, your privacy and that of your clients are our top priority. Here’s how we protect your information:",
    includes: [
      "Your account is secure: We use encryption and role-based access to protect your data.",
      "HIPAA-compliant: We safeguard any client health information you access or manage on the platform.",
      "Your content is yours: You control what you publish and share. Your storefront activity and commissions are private.",
      "No third-party sharing without consent: We never sell or share your data unless required by law.",
      "You’re in control: You can update or delete your information and request support anytime.",
    ],
    link: "https://tolu.health/privacy-policy",
  },
  {
    title: "Independent Contractor Agreement",
    description:
      "If Educator Admins are earning commissions or selling content/products, you’ll need a formal contract to define the relationship.",
    includes: [
      "Independent contractor status (not employees)",
      "Revenue share/commission terms",
      "Content ownership and licensing (see below)",
      "Confidentiality obligations",
      "Termination conditions",
      "Non-compete and/or non-solicitation clauses (if desired)",
      "Liability disclaimers",
    ],
  },
  {
    title: "Content Licensing Agreement",
    description:
      "Educator Admins create and upload educational content. You need permission to use, modify, and publish that content on your platform.",
    includes: [
      "Ownership vs. license (i.e., Tolu gets a royalty-free, worldwide license to use the content, but the creator retains IP)",
      "Right to display, distribute, and sell",
      "Quality and originality standards (no plagiarism)",
      "Permission for edits or co-branding",
      "Handling of takedowns or disputes",
    ],
  },
];
