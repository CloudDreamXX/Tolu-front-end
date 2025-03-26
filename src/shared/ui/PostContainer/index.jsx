import PostBar from './components/PostBar';

function PostContainer({ title, content, info }) {
  const { source, date, read } = info;

  return (
    <div className="flex flex-col rounded-2xl bg-white p-4 w-full gap-6 max-h-[68vh] overflow-y-auto">
      <h1 className="text-3xl font-bold">{title}</h1>
      <PostBar source={source} date={date} read={read} />
      <div className="w-full" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default PostContainer;
