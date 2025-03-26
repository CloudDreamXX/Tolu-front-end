import { formatDate } from '../../../utils/format/formatDate';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineHashtag } from 'react-icons/hi';
import { CiFileOn } from 'react-icons/ci';
import { IoBookOutline } from 'react-icons/io5';
import { CiBookmark } from 'react-icons/ci';

function Card({ item }) {
  const {
    title: title,
    creator_id: author,
    fileCount,
    docCount,
    created_at: date,
    saved = '12,467',
    views = '33,374 read',
  } = item;
  const filesCount = fileCount ?? docCount ?? 0;

  return (
    <div className="flex flex-col gap-5 relative bg-white rounded-lg p-4 pr-10">
      <BsThreeDotsVertical className="absolute top-4 right-4 cursor-pointer" />
      <div className="flex items-center gap-2 max-w-72 overflow-hidden">
        <HiOutlineHashtag className="min-w-6 min-h-6" />
        <h3 className="text-h3 truncate">{title}</h3>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CiFileOn />
            <span className="text-p-md">{filesCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <CiBookmark />
            <span className="text-p-md">{saved} saved</span>
          </div>
          <div className="flex items-center gap-2">
            <IoBookOutline />
            <span className="text-p-md">{views} read</span>
          </div>
        </div>
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
      </div>
    </div>
  );
}

export default Card;
