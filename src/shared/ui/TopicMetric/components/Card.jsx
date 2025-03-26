function Card({ id, value }) {
  return (
    <>
      {id === 'date' || id === 'author' ? (
        <div className="flex flex-col w-full gap-4 bg-white rounded-lg p-4 sm:max-w-[295px]">
          <span className="text-p">{id}</span>
          <span className="text-h2 max-w-[246px] truncate">{value}</span>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-4 bg-white rounded-lg p-4 sm:max-w-[295px]">
          <span className="text-h2">{value}</span>
          <span className="text-p">{id}</span>
        </div>
      )}
    </>
  );
}

export default Card;
