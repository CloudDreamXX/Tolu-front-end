import NoRecommended from "shared/assets/images/NoRecommended.png";

export const RecommendedTab: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center lg:mt-40">
      <img src={NoRecommended} alt="No files" className="mb-6 md:mb-12" />
      <h1 className="text-lg md:text-3xl font-bold text-[#1D1D1F]">
        No articles recommended so far
      </h1>
      <p className="mt-2 text-base md:text-xl text-[#5F5F65]">
        Your coach’s suggestions will show up here.
      </p>
    </div>
  );
};
