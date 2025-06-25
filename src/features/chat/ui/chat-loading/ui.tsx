export const ChatLoading = () => (
  <div className="flex flex-col items-center justify-center w-full h-full">
    <div className="flex items-center gap-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      <span className="text-sm text-blue-600">Loading chat session...</span>
    </div>
  </div>
);
