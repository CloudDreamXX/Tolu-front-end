export const MessageLoadingSkeleton = () => {
  const Bubble = ({
    align = "left",
    lines = 3,
  }: {
    align?: "left" | "right";
    lines?: number;
  }) => {
    const isRight = align === "right";

    const getRandomWidth = (min: number, max: number) =>
      `${Math.floor(Math.random() * (max - min + 1)) + min}px`;

    return (
      <div
        className={`flex ${isRight ? "justify-end" : "justify-start"} w-full`}
      >
        <div
          className={`flex flex-col gap-[8px] p-[16px] bg-[#F6F6F6] rounded-[8px] max-w-[90%] w-fit`}
        >
          <div className="flex justify-between items-center w-full mb-[6px]">
            <div
              className="h-[10px] skeleton-gradient rounded-[24px]"
              style={{ width: getRandomWidth(60, 100) }}
            />
            <div
              className="h-[10px] skeleton-gradient rounded-[24px]"
              style={{ width: getRandomWidth(60, 100) }}
            />
          </div>

          {[...Array(lines)].map((_, i) => (
            <div
              key={i}
              className="h-[12px] skeleton-gradient rounded-[24px]"
              style={{ width: getRandomWidth(160, 300) }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-pulse">
      <Bubble align="left" lines={2} />
      <Bubble align="right" lines={3} />
      <Bubble align="left" lines={5} />
    </div>
  );
};
