export const DocumentLoadingSkeleton = () => {
  const getRandomWidth = (min: number, max: number) =>
    `${Math.floor(Math.random() * (max - min + 1)) + min}px`;

  return (
    <div className="p-[24px] rounded-[16px] bg-white xl:overflow-y-auto animate-pulse w-full">
      {/* Header block with title and query */}
      <div className="ml-auto w-full flex flex-col gap-[16px] mb-[24px]">
        <div
          className="h-[16px] skeleton-gradient rounded-[24px] max-w-[280px] md:max-w-none"
          style={{ width: getRandomWidth(400, 600) }}
        />
        <div
          className="h-[16px] skeleton-gradient rounded-[24px] max-w-[180px] md:max-w-none"
          style={{ width: getRandomWidth(200, 400) }}
        />
      </div>

      <div className="ml-auto w-full flex items-center gap-[24px] mb-[24px] justify-between">
        <div className="flex flex-col gap-[8px]">
          <div
            className="h-[10px] skeleton-gradient rounded-[24px] max-w-[100px] md:max-w-none"
            style={{ width: getRandomWidth(50, 150) }}
          />
          <div
            className="h-[10px] skeleton-gradient rounded-[24px] max-w-[100px] md:max-w-none"
            style={{ width: getRandomWidth(50, 150) }}
          />
        </div>
        <div className="hidden md:flex flex-col gap-[8px]">
          <div
            className="h-[10px] skeleton-gradient rounded-[24px]"
            style={{ width: getRandomWidth(50, 150) }}
          />
          <div
            className="h-[10px] skeleton-gradient rounded-[24px]"
            style={{ width: getRandomWidth(50, 150) }}
          />
        </div>
        <div className="hidden md:flex flex-col gap-[8px]">
          <div
            className="h-[10px] skeleton-gradient rounded-[24px]"
            style={{ width: getRandomWidth(50, 150) }}
          />
          <div
            className="h-[10px] skeleton-gradient rounded-[24px]"
            style={{ width: getRandomWidth(50, 150) }}
          />
        </div>
        <div className="hidden md:flex flex-col gap-[8px]">
          <div
            className="h-[10px] skeleton-gradient rounded-[24px]"
            style={{ width: getRandomWidth(50, 150) }}
          />
          <div
            className="h-[10px] skeleton-gradient rounded-[24px]"
            style={{ width: getRandomWidth(50, 150) }}
          />
        </div>
        <div className="bg-[#DDEBF6] px-[16px] py-[18px] rounded-full">
          <div className="h-[10px] bg-[#AAC6EC] rounded-[24px] w-[62px]" />
        </div>
      </div>

      {/* Simulated paragraph lines */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[10px] skeleton-gradient rounded-[24px] max-w-[280px] md:max-w-[600px] xl:max-w-none"
              style={{ width: getRandomWidth(200, 700) }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[8px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[10px] skeleton-gradient rounded-[24px] max-w-[280px] md:max-w-[600px] xl:max-w-none"
              style={{ width: getRandomWidth(200, 700) }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[8px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[10px] skeleton-gradient rounded-[24px] max-w-[280px] md:max-w-[600px] xl:max-w-none"
              style={{ width: getRandomWidth(200, 700) }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[8px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[10px] skeleton-gradient rounded-[24px] max-w-[280px] md:max-w-[600px] xl:max-w-none"
              style={{ width: getRandomWidth(200, 700) }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[8px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[10px] skeleton-gradient rounded-[24px] max-w-[280px] md:max-w-[600px] xl:max-w-none"
              style={{ width: getRandomWidth(200, 700) }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[8px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[10px] skeleton-gradient rounded-[24px] max-w-[280px] md:max-w-[600px] xl:max-w-none"
              style={{ width: getRandomWidth(200, 700) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
