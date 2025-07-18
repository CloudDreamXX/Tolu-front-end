import parse from "html-react-parser";

interface StreamingResponseProps {
  streamingText: string;
}

export const StreamingResponse: React.FC<StreamingResponseProps> = ({
  streamingText,
}) => (
  <div className="flex justify-start">
    <div className="w-full md:max-w-[70%] min-w-36">
      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-row justify-between w-full text-sm text-[#1D1D1F]">
          <span className="font-semibold">AI Assistant</span>
          <span>Just Now</span>
        </div>

        {streamingText ? (
          <div className="text-sm text-[#1D1D1F] bg-[#ECEFF4] px-[14px] py-[10px] rounded-md">
            {parse(streamingText)}
            <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>
          </div>
        ) : (
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
            <span className="text-sm text-blue-600">AI is thinking...</span>
          </div>
        )}
      </div>
    </div>
  </div>
);
