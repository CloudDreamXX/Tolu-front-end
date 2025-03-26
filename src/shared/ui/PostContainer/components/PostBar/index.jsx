import PostInfo from "../PostInfo";
import PostActions from "../PostActions";

function PostBar({ source, date, read }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <PostInfo source={source} date={date} />
      <PostActions read={read} />
    </div> 
  );
};

export default PostBar;