export interface Content {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

type Contents = Content[];

export const contents: Contents = [
    {
        title: "Your Account is Secure!",
        description: "We Use Encryption and Role-based access to protect your data!",

    },
    {
        title: "HIPAA-Compliant!",
        description: "We safeguard any client health information you access or manage on the platform.",
    },
    {
        title: "Your Content is Yours!",
        description: "You control what you publish and share. Your storefront activity and commissions are tracked privately.", 
    },
    {
        title: "We Don't Share Your Data!",
        description: "With third parties without your consent - unless required by law.",
    },
    {
        title: "You’re in control!",
        description: "You can update or delete your information, and request support anytime.",
    },
];
