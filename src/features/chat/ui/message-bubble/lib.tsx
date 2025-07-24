import parse from "html-react-parser";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

export const smartRender = async (text: string) => {
  const type = detectContentType(text);

  if (type === "html") {
    return <div className="font-inter">{parse(cleanHtml(text))}</div>;
  }

  if (type === "markdown") {
    return (
      <div className="font-inter" style={{ fontFamily: "Inter, sans-serif" }}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="font-inter" style={{ fontFamily: "Inter, sans-serif" }}>
      {text}
    </div>
  );
};

// export const smartRender = async (text: string) => {
//   const type = detectContentType(text);

//   if (type === "html") {
//     return (
//       <div style={{ fontFamily: "'Inter', sans-serif" }}>
//         {parse(cleanHtml(text))}
//       </div>
//     );
//   }

//   if (type === "markdown") {
//     return (
//       <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#ECEFF4" }}>
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm, remarkBreaks]}
//           components={{
//             p: ({ node, children, ...props }) => (
//               <p style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#ECEFF4" }} {...props}>
//                 {children}
//               </p>
//             ),
//             a: ({ node, children, ...props }) => (
//               <a style={{ fontFamily: "'Inter', sans-serif'", color: "#2563eb" }} {...props}>
//                 {children}
//               </a>
//             ),
//             strong: ({ node, children, ...props }) => (
//               <strong style={{ fontFamily: "'Inter', sans-serif" }} {...props}>
//                 {children}
//               </strong>
//             ),
//             li: ({ node, children, ...props }) => (
//               <li style={{ fontFamily: "'Inter', sans-serif" }} {...props}>
//                 {children}
//               </li>
//             ),
//           }}
//         >
//           {text}
//         </ReactMarkdown>
//       </div>
//     );
//   }

//   return <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#ECEFF4" }}>{text}</div>;
// };

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

const cleanHtml = (raw: string): string => {
  if (!raw) return "";

  const startIndex = raw.search(/<\s*[\w!]/);
  const trimmedStart = startIndex >= 0 ? raw.slice(startIndex) : raw;

  const lastTagClose = trimmedStart.lastIndexOf(">");
  const trimmedEnd =
    lastTagClose >= 0 ? trimmedStart.slice(0, lastTagClose + 1) : trimmedStart;

  return trimmedEnd.trim();
};

export const renderResultBlocks = (rawContent: string) => {
  const nav = useNavigate();
  const blocks = rawContent
    .split(/\n\n+/)
    .filter((b) => b.includes("/content/retrieve/"));

  return blocks.map((block, index) => {
    const idmatch = block.match(/\/content\/retrieve\/([a-f0-9-]{36})/i);
    const folderMatch = block.match(/\*\*Folder:\*\* (.+)/);
    const previewMatch = block.match(/\*\*Preview:\*\* (.+)/);
    const createdMatch = block.match(/\*\*Created:\*\* (.+)/);

    const id = idmatch?.[1];
    const folder = folderMatch?.[1];
    const previewHtml = previewMatch?.[1];
    const { heading } = extractAndCleanPreview(previewHtml || "");
    const created = createdMatch?.[1];

    return (
      <div
        className="!font-inter"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div
          key={index}
          className="p-4 my-3 bg-white border rounded-md shadow-sm h-[140px] flex flex-col justify-between"
          onClick={() => {
            window.open(
              `/library/document/${id}`,
              "_blank",
              "noopener,noreferrer"
            );
            nav(``);
          }}
        >
          <p className="mb-1 font-bold cursor-pointer hover:underline line-clamp-3">
            {heading}
          </p>
          <p className="mb-2 text-sm text-gray-500 font-inter">{folder}</p>
          <div className="text-sm line-clamp-2 font-inter">{created}</div>
        </div>
      </div>
    );
  });
};

const extractAndCleanPreview = (
  previewHtml: string
): {
  heading: string | null;
  cleanedHtml: string;
} => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, "text/html");

    const headingElement = doc.querySelector("h1, h2, h3, h4, h5, h6");
    const heading = headingElement?.textContent?.trim() || null;

    if (headingElement?.parentNode) {
      headingElement.parentNode.removeChild(headingElement);
    }

    const cleanedHtml = doc.body.innerHTML.trim();

    return { heading, cleanedHtml };
  } catch {
    return { heading: null, cleanedHtml: previewHtml };
  }
};
