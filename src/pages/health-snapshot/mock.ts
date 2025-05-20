import { ClientCardProps } from "shared/ui";

type SmallCard = ClientCardProps & {
    id: number;
};

export const smallCards: SmallCard[] = [
    {
        id: 0,
        title: "Sleep quality",
        indicator: "+45 min",
        trend: "up",
    },
    {
        id: 1,
        title: "HRV",
        indicator: "5%",
        trend: "down",
    },
    {
        id: 2,
        title: "Cravings",
        indicator: "2 days",
        trend: "up",
        increased: true,
    },
    {
        id: 3,
        title: "Fatigue",
        indicator: "improved",
        trend: "down",
    },
]

export const tableHeaders = [
    { id: 0, title: "Metric" },
    { id: 1, title: "Latest Result" },
    { id: 2, title: "Test date" },
    { id: 3, title: "Status" },
    { id: 4, title: "Comment" },
];

export const tableRows = [
    {
        metric: "Vitamin D",
        LatestResult: "38 ng/mL",
        Testdate: "Apr 20, 2025 8:00 pm",
        Status: "Borderline",
        Comment: "Vitamin D has\n improved 15% since\n last test",
    },
    {
        metric: "Estradiol",
        LatestResult: "72 pg/mL",
        Testdate: "Apr 1, 2025 8:00 pm",
        Status: "Optimal",
        Comment: "Stable over past 3\n months",
    },
    {
        metric: "Glucose (fasted)",
        LatestResult: "112 mg/dL",
        Testdate: "Apr 24, 2025 3:30 pm",
        Status: "Needs Attention",
        Comment: "Increased 10% —\n consider dietary\n review",
    },
    {
        metric: "hsCRP",
        LatestResult: "2.3 mg/L",
        Testdate: "Apr 27, 2025 4:45 am",
        Status: "Borderline",
        Comment: "Decreased slightly,\n monitor regularly",
    },
    {
        metric: "TSH",
        LatestResult: "1.9 µIU/mL",
        Testdate: "May 6, 2025 3:30 am",
        Status: "Optimal",
        Comment: "Consistent with\n previous test",
    },
]

export const timelines = [
    {
        title: "Vitamin D result updated",
        date: "May 4, 4:02 am",
        description: "You added a new lab value: 38 ng/mL ",
    },
    {
        title: "Vitamin D result updated",
        date: "May 4, 4:02 am",
        description: "You added a new lab value: 38 ng/mL ",
    },
    {
        title: "Vitamin D result updated",
        date: "May 4, 4:02 am",
        description: "You added a new lab value: 38 ng/mL ",
    },
    {
        title: "Vitamin D result updated",
        date: "May 4, 4:02 am",
        description: "You added a new lab value: 38 ng/mL ",
    },
    {
        title: "Vitamin D result updated",
        date: "May 4, 4:02 am",
        description: "You added a new lab value: 38 ng/mL ",
    },
    {
        title: "Vitamin D result updated",
        date: "May 4, 4:02 am",
        description: "You added a new lab value: 38 ng/mL ",
    },
]