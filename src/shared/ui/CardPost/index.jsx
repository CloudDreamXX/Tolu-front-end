import { formatDate } from "../../../utils/format/formatDate";
import { MdAccessTime } from "react-icons/md";


function CardPost({ item }) {
  const { author, content, date, time, title } = item;

  return (
    <div className="flex flex-col gap-5 relative bg-white rounded-lg p-4 pr-10">
      <div className="flex items-center gap-2 max-w-72 overflow-hidden">
        <h3 className="text-h3 truncate">{title}</h3>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="text-p capitalize">author</span>
            <span className="text-p-md">{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-p capitalize">date</span>
            <span className="text-p-md">{formatDate(date)}</span>
          </div>
        </div>
				<div className="flex w-full items-center gap-2">
					<MdAccessTime className="w-6 h-6" />
					<span className="text-p-md">{time} mins reading left</span>
				</div>
      </div>
    </div>
  );
}

export default CardPost;
