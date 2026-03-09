import { SharedContentTab } from "../shared-content-tab";

interface RecommendedTabProps {
  isClient?: boolean;
  clientId?: string;
}

export const RecommendedTab: React.FC<RecommendedTabProps> = ({
  isClient = false,
  clientId,
}) => {
  if (isClient) {
    return <SharedContentTab isClient={true} clientId={clientId} />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center lg:mt-40">
      <h1 className="text-lg md:text-3xl font-bold text-[#1D1D1F]">
        No articles recommended so far
      </h1>
      <p className="mt-2 text-base md:text-xl text-[#5F5F65]">
        Your coach’s suggestions will show up here.
      </p>
    </div>
  );
};
