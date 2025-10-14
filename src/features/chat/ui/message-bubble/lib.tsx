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

const CustomLinkWrapper = (props: any) => (
  <a
    href={props.href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#1C63DB",
      textDecoration: "underline",
      display: "block",
      marginBottom: "8px",
      whiteSpace: "normal",
      wordBreak: "break-word",
    }}
  >
    {props.children}
  </a>
);

const normalizeLinks = (html: string): string => {
  return html.replace(
    /<a\s+([^>]*href="[^"]+"[^>]*)>(.*?)<\/a>/gi,
    `<a $1 style="color:#1C63DB;text-decoration:underline;display:block;margin-bottom:8px;white-space:normal;word-break:break-word;">$2</a>`
  );
};

const detectContentType = (text: string): "html" | "markdown" | "plain" => {
  const trimmed = text.trim();
  if (!trimmed) return "plain";

  const htmlPattern = /<\/?[a-z][\s\S]*?>/i;
  const mdPattern = /(^|\n)(#{1,6}|[*_~`]|>\s|\d+\.\s|\*\s|-\s|\[.*?\]\(.*?\))/;

  if (htmlPattern.test(trimmed)) return "html";
  if (mdPattern.test(trimmed)) return "markdown";
  return "plain";
};

export const smartRender = async (text: string) => {
  try {
    const relevantContentIndex = text.indexOf("Relevant content");
    const cutIndex = Math.min(
      relevantContentIndex !== -1 ? relevantContentIndex : text.length
    );

    const trimmedText = cutIndex !== -1 ? text.slice(0, cutIndex) : text;

    const preprocessedText = trimmedText
      .replace(/^##\s?/gm, "")
      .replace(/\ud83d\udcda/g, "");

    const sanitizedText = sanitizeHtml(preprocessedText, {
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
        "strong",
        "blockquote",
        "pre",
        "code",
        "br",
        "hr",
        "div",
        "span",
        "img",
        "style",
        "font",
        "input",
        "form",
        "label",
        "button",
        "ul",
        "li",
        "script",
      ],
      allowedAttributes: {
        "*": ["class", "id", "style", "title", "data-list"],
        a: ["href", "target", "rel"],
        img: [
          "src",
          "alt",
          "title",
          "width",
          "height",
          "loading",
          "srcset",
          "sizes",
        ],
        input: ["type", "value", "name", "id", "checked", "disabled"],
        button: ["type", "onclick"],
        form: ["action", "method"],
      },
      allowedSchemes: ["http", "https", "data"],
      allowVulnerableTags: true,
    });

    const urlRegex = /\((https?:\/\/[^\s]+)\)/g;
    const withAnchors = sanitizedText.replace(urlRegex, (_, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    const formattedText = normalizeLinks(withAnchors);

    const type = detectContentType(formattedText);

    if (type === "html") {
      return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
    }

    if (type === "markdown") {
      const cleaned = cleanMarkdown(formattedText);

      const htmlParts = extractHtmlFromMarkdown(cleaned);

      return (
        <div>
          {htmlParts.map((part, index) =>
            part.isHtml ? (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: part.content }}
              />
            ) : (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm, remarkBreaks]}
                skipHtml
                components={{
                  body: (props) => <body {...props} />,
                  h1: (props) => <h1 {...props} />,
                  h2: (props) => <h2 {...props} />,
                  h3: (props) => <h3 {...props} />,
                  h4: (props) => <h4 {...props} />,
                  p: (props) => <p {...props} />,
                  ul: (props) => <ul {...props} />,
                  li: (props) => <li {...props} />,
                  a: CustomLinkWrapper,
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
        style={{ fontFamily: "Inter, sans-serif" }}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  } catch (error) {
    console.error("Error rendering response:", error);
    return <div>Error rendering content.</div>;
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
    const heading =
      extractTitleFromBlock(block) ||
      (id ? `Document ${id.slice(0, 8)}` : "Untitled");
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
                <p className="font-bold  text-base line-clamp-3 hover:underline mb-2">
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

          <p className="mb-1 text-sm text-gray-500 ">{folder}</p>
          <div className="text-sm text-gray-400 ">{created}</div>
        </div>
      </div>
    );
  });
};

export const renderLinkBlocks = (rawContent: string) => {
  const nav = useNavigate();

  const linkRegex = /<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi;
  const matches: { href: string; text: string }[] = [];
  let match;
  const blocks = rawContent
    .split(/\n\n+/)
    .filter((b) => b.includes("/content/retrieve/"));

  if (blocks.length) {
    return;
  }

  while ((match = linkRegex.exec(rawContent)) !== null) {
    matches.push({ href: match[1], text: match[2] });
  }

  return matches.map((m, index) => {
    const idMatch = m.href.match(/\/content\/retrieve\/([a-f0-9-]{36})/i);
    const id = idMatch?.[1];

    return (
      <div style={{ fontFamily: "'Inter', sans-serif" }} key={index}>
        <div
          className="p-4 my-3 bg-white border rounded-md shadow-sm min-h-[120px] flex flex-col justify-between cursor-pointer h-full"
          onClick={() => {
            if (id) {
              nav(`/library/document/${id}`);
            } else {
              window.open(m.href, "_blank", "noopener,noreferrer");
            }
          }}
        >
          <p className="font-bold text-base line-clamp-3 hover:underline mb-2">
            {m.text || "Untitled"}
          </p>
        </div>
      </div>
    );
  });
};

const extractTitleFromBlock = (block: string) => {
  const m = block.match(/<a[^>]*target="_self"[^>]*>([^<]+)<\/a>/i);
  if (m?.[1]) return m[1].trim();

  const h1 = block.match(/^\s*#\s+(.+)$/m);
  return h1?.[1]?.trim() ?? "";
};
