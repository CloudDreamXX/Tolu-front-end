import { formatDate } from "../../../utils/format/formatDate";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineHashtag } from "react-icons/hi";

function Card({item}) {
    const {
        title: title, 
        creator_id: author, 
        created_at: date
    } = item;

    return (
        <div className="flex flex-col gap-5 relative bg-white rounded-lg p-4">
            <BsThreeDotsVertical className="absolute top-4 right-4 cursor-pointer" />
            <div className="flex items-center gap-2 max-w-72 overflow-hidden">
                <h3 className="text-h3 truncate">
                    <HiOutlineHashtag className="w-6 h-6" />
                    {title}
                </h3>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-p capitalize">author</span>
                    <span className="text-p-md">{author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-p capitalize">date</span>
                    <span className="text-p-md">{formatDate(date)}</span>
                </div>
            </div>
        </div>
    );
};

export default Card;