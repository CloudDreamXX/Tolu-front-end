function Tips({ title, icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full rounded-3xl p-4 border border-stroke2">
      <h3 className="text-h3 flex items-center gap-2">
        <Icon />
        {title}
      </h3>
      <p className="text-p text-gray-500 text-center">{text}</p>
    </div>
  );
}

export default Tips;
