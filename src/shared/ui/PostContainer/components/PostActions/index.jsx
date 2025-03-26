import { MdAccessTime } from "react-icons/md";
import Button from "../../../Button";

function PostActions({ read }) {
  return (
    <div className="flex gap-6 items-center">
      <div className="flex items-center gap-2.5">
        <MdAccessTime className="w-6 h-6" />
        <span className="text-base font-semibold">{read} mins read</span>
      </div>
      <div className="flex items-center gap-2.5 text-sm font-medium">
        <Button 
          name="Play"
          type="play"
        />
      </div>
    </div>
  );
};

export default PostActions;