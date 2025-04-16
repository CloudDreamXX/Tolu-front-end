import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <div className="flex items-center justify-center w-20 h-20 text-4xl text-blue-400 border-4 border-transparent rounded-full animate-spin border-t-blue-400">
          <div className="flex items-center justify-center w-16 h-16 text-2xl text-red-400 border-4 border-transparent rounded-full animate-spin border-t-red-400"></div>
        </div>
      </div>
    </div>
  );
};
