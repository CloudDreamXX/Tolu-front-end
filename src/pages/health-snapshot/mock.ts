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