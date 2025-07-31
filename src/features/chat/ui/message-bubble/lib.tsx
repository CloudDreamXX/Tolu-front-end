import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";
import sanitizeHtml from "sanitize-html";

export const smartRender = async (text: string) => {
  try {
    const cutIndex = text.indexOf("Relevant content");
    const trimmedText = cutIndex !== -1 ? text.slice(0, cutIndex) : text;

    const sanitizedText = sanitizeHtml(trimmedText, {
      allowedTags: [
        "p",
        "a",
        "b",
        "i",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "em",
      ],
      allowedAttributes: {
        "*": ["class", "id", "style", "href"],
      },
    });

    const type = detectContentType(sanitizedText);

    if (type === "html") {
      return (
        <div
          className="bg-[#ECEFF4]"
          dangerouslySetInnerHTML={{ __html: sanitizedText }}
        />
      );
    }

    if (type === "markdown") {
      const cleaned = cleanMarkdown(sanitizedText);

      const htmlParts = extractHtmlFromMarkdown(cleaned);

      return (
        <div className="font-inter bg-[#ECEFF4] p-4">
          {htmlParts.map((part, index) =>
            part.isHtml ? (
              <div
                key={index}
                className="bg-[#ECEFF4]"
                dangerouslySetInnerHTML={{ __html: part.content }}
              />
            ) : (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm, remarkBreaks]}
                skipHtml
                components={{
                  body: (props) => (
                    <body className="font-inter bg-[#ECEFF4]" {...props} />
                  ),
                  h1: (props) => <h1 className="font-inter" {...props} />,
                  h2: (props) => <h2 className="font-inter" {...props} />,
                  h3: (props) => <h3 className="font-inter" {...props} />,
                  h4: (props) => <h4 className="font-inter" {...props} />,
                  p: (props) => <p className="font-inter" {...props} />,
                  ul: (props) => <ul className="font-inter" {...props} />,
                  li: (props) => <li className="font-inter" {...props} />,
                  a: (props) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-inter text-wrap"
                    />
                  ),
                }}
              >
                {part.content}
              </ReactMarkdown>
            )
          )}
        </div>
      );
    }

    return (
      <div
        className="font-inter bg-[#ECEFF4]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {sanitizedText}
      </div>
    );
  } catch (error) {
    console.error("Error rendering response:", error);
    return (
      <div className="font-inter bg-[#ECEFF4]">Error rendering content.</div>
    );
  }
};

const extractHtmlFromMarkdown = (markdown: string) => {
  const regex = /```html\n([\s\S]*?)\n```/g;
  const parts: { isHtml: boolean; content: string }[] = [];

  let match;
  let lastIndex = 0;

  while ((match = regex.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        isHtml: false,
        content: markdown.slice(lastIndex, match.index),
      });
    }

    parts.push({ isHtml: true, content: match[1] });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < markdown.length) {
    parts.push({ isHtml: false, content: markdown.slice(lastIndex) });
  }

  return parts;
};

export const joinReplyChunksSafely = (chunks: string[]): string => {
  return chunks.reduce((acc, curr) => {
    if (!acc) return curr;

    const prevLastChar = acc.slice(-1);
    const currFirstChar = curr.slice(0, 1);

    const needsSpace =
      (/\w/.test(prevLastChar) && /\w/.test(currFirstChar)) ||
      (/[.,!?;:)]/.test(prevLastChar) && /[A-Za-z]/.test(currFirstChar));

    if (needsSpace) {
      return acc + " " + curr;
    }

    return acc + curr;
  }, "");
};

const cleanMarkdown = (raw: string): string => {
  return raw
    .replace(/<\/?html.*?>/gi, "")
    .replace(/<\/?body.*?>/gi, "")
    .trim();
};

const detectContentType = (text: string): "html" | "markdown" | "plain" => {
  const trimmed = text.trim();

  if (!trimmed) return "plain";

  const htmlPattern = /<\/?[a-z][\s\S]*?>/i;
  const markdownPattern =
    /(^|\n)(#{1,6}|[*_~`]|>\s|\d+\.\s|\*\s|-\s|\[.*?\]\(.*?\))/;

  if (htmlPattern.test(trimmed) && !markdownPattern.test(trimmed)) {
    return "html";
  }

  if (markdownPattern.test(trimmed)) {
    return "markdown";
  }

  return "plain";
};

export const renderResultBlocks = (rawContent: string) => {
  const nav = useNavigate();
  const blocks = rawContent
    .split(/\n\n+/)
    .filter((b) => b.includes("/content/retrieve/"));

  return blocks.map((block, index) => {
    const idmatch = block.match(/\/content\/retrieve\/([a-f0-9-]{36})/i);
    const folderMatch = block.match(/\*\*Folder:\*\* (.+)/);
    const createdMatch = block.match(/\*\*Created:\*\* (.+)/);

    const id = idmatch?.[1];
    const folder = folderMatch?.[1];
    const heading = extractTitleFromPreview(rawContent);
    const created = createdMatch?.[1];

    return (
      <div style={{ fontFamily: "'Inter', sans-serif" }} key={index}>
        <div
          className="p-4 my-3 bg-white border rounded-md shadow-sm min-h-[160px] flex flex-col justify-between cursor-pointer h-full"
          onClick={() => {
            nav(`/library/document/${id}`);
          }}
        >
          <TooltipProvider delayDuration={500} disableHoverableContent>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="font-bold font-inter text-base line-clamp-3 hover:underline mb-2">
                  {heading}
                </p>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="z-50 p-[16px] max-w-[309px]"
              >
                <div className="text-[#1B2559] text-sm leading-[1.4] font-medium">
                  {heading}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <p className="mb-1 text-sm text-gray-500 font-inter">{folder}</p>
          <div className="text-sm text-gray-400 font-inter">{created}</div>
        </div>
      </div>
    );
  });
};

const extractTitleFromPreview = (rawContent: string) => {
  const match = rawContent.match(/target="_self">([^<]+)<\/a>/);
  const title = match ? match[1] : "No title found";
  return title;
};
