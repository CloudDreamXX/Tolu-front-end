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
      "We Use Encryption and Role-based access to protect your data!",
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
  {
    title: "Affiliate/Promoter Terms (if selling products/labs/supplements)",
    description:
      "If they promote 3rd-party products via affiliate links, this agreement ensures compliance and defines their earnings.",
    includes: [
      "Commission structure",
      "Permitted promotional practices (no false claims)",
      "Disclosure obligations (FTC compliance)",
      "Relationship with vendors or manufacturers",
      "Payment timelines and thresholds",
    ],
  },
  {
    title: "Confidentiality and Data Protection Addendum",
    description:
      "Reinforces HIPAA obligations and limits data use outside Tolu’s platform.",
    includes: [
      "PHI access restrictions",
      "Agreement not to store or transmit PHI outside secure channels",
      "Mandatory breach reporting within [24–72] hours",
      "Consequences for violations (termination, liability)",
    ],
  },
  {
    title: "Media & Testimonial Release Form",
    description:
      "If Educator Admins will appear in marketing, give testimonials, or submit success stories, get their permission in writing.",
  },
];
