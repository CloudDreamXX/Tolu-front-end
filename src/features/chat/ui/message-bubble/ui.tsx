import { useEffect, useRef, useState } from "react";
import { renderResultBlocks, smartRender } from "./lib";
import { ChatActions } from "../chat-actions";

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  document?: string;
  images?: string[];
  pdfs?: {
    name: string;
    url: string;
    type: string;
  }[];
  audio?: string;
}

interface MessageBubbleProps {
  message: Message;
  isHistoryPopup?: boolean;
  onReadAloud?: () => void;
  isReadingAloud?: boolean;
  isSearching?: boolean;
  currentChatId?: string;
  selectedSwitch?: string;
}

interface TelegramAudioPlayerProps {
  src: string;
  outgoing?: boolean;
}

const formatAudioTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const TelegramAudioPlayer: React.FC<TelegramAudioPlayerProps> = ({
  src,
  outgoing,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [src]);

  const handleTogglePlay = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioEl.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number) => {
    const audioEl = audioRef.current;
    if (!audioEl || duration <= 0) return;
    const nextTime = (value / 100) * duration;
    audioEl.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div
      className={`mt-2 w-full max-w-[340px] rounded-[20px] border px-3 py-2 ${outgoing
        ? "bg-white/90 border-[#D7E4FB]"
        : "bg-[#EEF4FF] border-[#D7E4FB]"
        }`}
    >
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`relative flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-[1.03] ${outgoing ? "bg-[#1C63DB] text-white" : "bg-white text-[#1C63DB]"
            }`}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-[#1C63DB]/30" />
          )}
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="3" height="10" rx="1" fill="currentColor" />
              <rect x="9" y="2" width="3" height="10" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 2.5L11 7L4 11.5V2.5Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="relative h-4 w-full">
            <div className="absolute left-0 right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#D7E4FB]" />
            <div
              className="absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#1C63DB]"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white bg-[#1C63DB] shadow-sm"
              style={{ left: `clamp(0px, calc(${progress}% - 5px), calc(100% - 10px))` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Audio progress"
            />
          </div>
          <div className="flex items-center justify-end text-[11px] text-[#5F5F65]">
            {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isHistoryPopup,
  isReadingAloud,
  isSearching,
  onReadAloud,
  currentChatId,
  selectedSwitch,
}) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null);
  const isContentManager =
    location.pathname.includes("content-manager") ||
    location.pathname.includes("clients");

  const cleanedContent = message.content
    .replace(/Conversational Response/g, "")
    .replace(
      /<head[^>]*>[\s\S]*?<title>[\s\S]*?<\/title>[\s\S]*?<\/head>/gi,
      (match) => match.replace(/<title>[\s\S]*?<\/title>/gi, "")
    );

  useEffect(() => {
    const render = async () => {
      const result = await smartRender(cleanedContent);
      setRenderedContent(result);
    };
    render();
  }, [cleanedContent]);

  return (
    <div style={{ all: "revert", fontFamily: "'Inter', sans-serif" }}>
      <div
        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
          }`}
      >
        <div
          className={`w-full ${message.type === "user"
            ? "order-2 max-w-[50%]"
            : "order-1 w-full md:max-w-[80%]"
            }`}
        >
          {message.type === "user" ? (
            <div className="flex flex-col justify-end w-full">
              <div className="flex flex-row gap-[16px] w-full text-sm text-[#1D1D1F]">
                <span className="font-semibold ">You</span>
                <span>{message.timestamp.toLocaleDateString()}</span>
              </div>
              <div
                className={`w-full px-4 py-2 ${isContentManager ? "text-black bg-blue-500/10" : "text-white bg-blue-500"} rounded-lg`}
              >
                {message.pdfs?.map((pdf, i) => (
                  <a
                    key={i}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 mt-2 px-3 py-1 mb-[5px] rounded-lg bg-white border hover:bg-[#3A3A3A] transition-colors w-full max-w-[280px]"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-[#1C63DB]/10 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1C63DB"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <path
                          d="M6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 
        2 0 0 0 2-2V8l-6-6H6zm7 7V3.5L18.5 
        9H13z"
                        />
                      </svg>
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <p className="text-[14px] font-medium truncate max-w-[180px]">
                        {pdf.name}
                      </p>
                      <span className="text-gray-400 text-[13px] uppercase tracking-wide">
                        {pdf.type.split("/")[1] || "PDF"}
                      </span>
                    </div>
                  </a>
                ))}
                {message.content}
                {message.audio && (
                  <TelegramAudioPlayer src={message.audio} outgoing />
                )}
                {!!message.images?.length && (
                  <div className="mt-2 grid gap-2 grid-cols-1">
                    {message.images.map((src, idx) => (
                      <a
                        key={src + idx}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        title="Open image"
                      >
                        <img
                          src={src}
                          alt={`uploaded-${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-[#E5E7EB]"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            target.parentElement?.remove();
                          }}
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-end w-full">
              <div className="flex flex-row gap-[16px] w-full text-sm text-[#1D1D1F]">
                <span className="font-semibold ">AI Assistant</span>
                <span>{message.timestamp.toLocaleDateString()}</span>
              </div>
              <div
                className={`text-[#1D1D1F] ${selectedSwitch === "Coach Assistant" ? "bg-[#fafafa]" : "bg-white"} px-[14px] py-[10px] rounded-md`}
              >
                {selectedSwitch === "Coach Assistant"
                  ? (() => {
                    let updatedContent = message.content;

                    updatedContent = updatedContent.replace(
                      /<header([^>]*)style="([^"]*?)"/gi,
                      (match, attrs, style) => {
                        let newStyle = style;

                        if (/align-items\s*:\s*center/.test(newStyle)) {
                          newStyle = newStyle.replace(
                            /align-items\s*:\s*center/gi,
                            "align-items:flex-start"
                          );
                        } else if (!/align-items\s*:/.test(newStyle)) {
                          newStyle += ";align-items:flex-start";
                        }

                        return `<header${attrs}style="${newStyle}"`;
                      }
                    );

                    updatedContent = updatedContent.replace(
                      /<header\b[^>]*>([\s\S]*?)<\/header>/gi,
                      (match, inner) => {
                        const modifiedInner = inner.replace(
                          /<div\s+style="([^"]*?)"/i,
                          (divMatch: any, style: string) => {
                            if (/flex-shrink\s*:\s*0/.test(style))
                              return divMatch;
                            const newStyle = `${style};flex-shrink:0;`;
                            return `<div style="${newStyle}"`;
                          }
                        );
                        const headerAttrs =
                          match.match(/<header([^>]*)>/i)?.[1] || "";
                        return `<header${headerAttrs}>${modifiedInner}</header>`;
                      }
                    );

                    updatedContent = updatedContent.replace(
                      /<footer([^>]*)style="([^"]*?)"/gi,
                      (match, attrs, style) => {
                        let newStyle = style;

                        if (/display\s*:\s*flex/.test(newStyle)) {
                          if (!/flex-direction\s*:/.test(newStyle)) {
                            newStyle += ";flex-direction:column";
                          } else {
                            newStyle = newStyle.replace(
                              /flex-direction\s*:\s*[^;]+/gi,
                              "flex-direction:column"
                            );
                          }
                        }

                        return `<footer${attrs}style="${newStyle}"`;
                      }
                    );

                    return (
                      <div
                        className="message-content"
                        dangerouslySetInnerHTML={{ __html: updatedContent }}
                      />
                    );
                  })()
                  : renderedContent}
                {message.document && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2  pb-[10px]">
                    {renderResultBlocks(message.document || "")}
                  </div>
                )}
                {message.audio && <TelegramAudioPlayer src={message.audio} />}
                {isContentManager && onReadAloud && (
                  <ChatActions
                    chatState={[message]}
                    isSearching={isSearching ?? false}
                    hasMessages={true}
                    isHistoryPopup={isHistoryPopup}
                    onReadAloud={onReadAloud}
                    isReadingAloud={isReadingAloud}
                    currentChatId={currentChatId}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
