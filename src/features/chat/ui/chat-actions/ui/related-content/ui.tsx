import { Button } from "shared/ui";

const mockContent = [
  {
    id: "1",
    title: "Breaking Down Barriers to Mental Wellness",
    label: "Health",
    description: "Journal of Nutrition",
  },
  {
    id: "2",
    title: "Boost Your Heart Health Today",
    label: "Cardio",
    description: "Journal of Nutrition",
  },
  {
    id: "3",
    title: "Understanding Triggers and Solutions",
    label: "Allergies",
    description: "Journal of Nutrition",
  },
  {
    id: "4",
    title: "Motivation and Tools You Need",
    label: "Health Goals",
    description: "Journal of Nutrition",
  },
  {
    id: "5",
    title: "The Role of Antidepressants in Mental Health",
    label: "Antidepressants",
    description: "Journal of Nutrition",
  },
];

export const RelatedContent = () => {
  return (
    <div className="h-full w-full max-w-[292px] p-6 rounded-xl bg-white">
      <h2 className="mb-6 text-lg font-semibold">Related Content</h2>
      <ul className="flex flex-col gap-4">
        {mockContent.map((item) => (
          <li key={item.label}>
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="flex flex-col gap-4 p-4 text-left border rounded-2xl"
            >
              <p className="text-lg font-semibold leading-tight">
                {item.title}
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-[#5F5F65] leading-none">
                  {item.label}
                </p>
                <p className="font-semibold leading-none">{item.description}</p>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
