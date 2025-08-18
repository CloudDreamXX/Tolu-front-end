import HashtagPopover from "widgets/content-popovers/ui/popover-hashtags/ui";

type Props = {
  contentId: string;
};

export const HashtagsInfo: React.FC<Props> = ({ contentId }) => {
  return (
    <HashtagPopover
      contentId={contentId}
      customTrigger={
        <button className="flex flex-row items-baseline group">
          <div className="text-sm font-semibold md:text-base lg:text-lg group-hover:text-[#008FF6]">
            Hashtags
          </div>
        </button>
      }
    />
  );
};
