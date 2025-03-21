import { FaRegFolder } from "react-icons/fa6";
import FolderBg from "../../../assets/images/auth/FolderBg.png";
import { formatDate } from "../../../utils/format/formatDate";
import { BsThreeDotsVertical } from "react-icons/bs";

function FolderCard({item}) {
    const {
        name: title, 
        creator_id: author, 
        created_at: date
    } = item;

    return (
        <div
            className="flex flex-col gap-5 relative bg-white sm:bg-transparent bg-cover bg-center bg-no-repeat pl-4 pr-10 pt-10 pb-4 rounded-xl"
            style={{ backgroundImage: `url(${FolderBg})` }}
        >
            <BsThreeDotsVertical className="absolute top-12 right-4 cursor-pointer" />
            <div className="flex items-center gap-2">
                <FaRegFolder />
                <h3 className="text-h3">{title}</h3>
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

export default FolderCard;