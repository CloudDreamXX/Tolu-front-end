import AIInput from "../../../shared/ui/AIInput";
import PostContainer from "../../../shared/ui/PostContainer";
import { postMock } from "./mock";

function Post() {
  return (
    <div className="w-full flex flex-col gap-2">
      <PostContainer
        title={postMock.title}
        content={postMock.content}
        info={postMock.info}
      />
      <AIInput 
        placeholder="Ask anything..."
        type="user"
      />
    </div>
  );
}

export default Post;