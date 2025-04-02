const FileCard = ({ title, description, Icon, openAddFileModal }) => {
  return (
    <div
      onClick={openAddFileModal}
      className="w-full justify-between flex px-6 py-3 items-center border-2 border-[#E8EAEC] bg-white rounded-3xl"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex w-full justify-center">
          <p className="text-xl font-bold flex items-center gap-2">
            {Icon && (
              <div>
                <Icon className="text-xl" />
              </div>
            )}
            {title}
          </p>
        </div>
        <p className="text-sm text-center font-medium text-[#1D1D1F80]">{description}</p>
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default FileCard;
