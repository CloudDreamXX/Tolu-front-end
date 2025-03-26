function PostInfo({ source, date }) {
  return (
    <div className="flex gap-6 items-center">
      <div className="flex items-center gap-2.5 text-sm font-medium">
        Source: <span className="text-base font-semibold">{source}</span>
      </div>
      <div className="flex items-center gap-2.5 text-sm font-medium">
        Date: <span className="text-base font-semibold">{date}</span>
      </div>
    </div>
  );
};

export default PostInfo;