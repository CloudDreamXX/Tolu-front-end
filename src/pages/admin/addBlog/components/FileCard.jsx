import React from 'react';

const FileCard = ({ title, description, Icon }) => {
    return (
        <div className="w-full justify-between flex px-6 py-3 items-center border-2 border-[#008FF614] bg-white shadow-[#7090B024] rounded-2xl">
            <div>
                <div>
                    <p className="text-lg font-medium text-[#1D1D1FB2]">{title}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-[#1D1D1F80]">{description}</p>
                </div>
            </div>
            <div>
                {Icon && ( // Conditionally render the icon if it's provided
                    <div>
                        <Icon className="text-3xl text-[#1D1D1FB2]" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileCard;
