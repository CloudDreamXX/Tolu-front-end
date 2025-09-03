import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface VirtuosoHeaderProps {
  loadingMore: boolean;
  hasMore: boolean;
}

export const VirtuosoHeader: React.FC<VirtuosoHeaderProps> = ({
  loadingMore,
  hasMore,
}) => {
  if (loadingMore) {
    return (
      <div className="flex justify-center py-2">
        <MaterialIcon
          iconName="progress_activity"
          className="w-5 h-5 animate-spin"
        />
      </div>
    );
  }
  if (hasMore) {
    return (
      <div className="py-2 text-center opacity-60">
        Scroll up to load history…
      </div>
    );
  }
  return <div className="py-2 text-center opacity-60">No more messages</div>;
};
