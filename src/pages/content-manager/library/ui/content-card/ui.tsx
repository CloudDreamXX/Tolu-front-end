import { useGetDocumentByIdQuery } from "entities/document";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  content: string;
  query: string;
  searchQuery?: string;
};

const highlightText = (text: string, searchQuery?: string) => {
  if (!searchQuery) return text;

  const regex = new RegExp(`(${searchQuery})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        style={{ backgroundColor: "#008FF61A", color: "#1C63DB" }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};

const highlightTextInHTML = (htmlContent: string, searchQuery?: string) => {
  if (!searchQuery) return htmlContent;

  const regex = new RegExp(`(${searchQuery})`, "gi");

  const highlightedContent = htmlContent.replace(regex, (match) => {
    return `<span style="background-color: #008FF61A; color: #1C63DB">${match}</span>`;
  });

  return highlightedContent;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

export const ContentCard: React.FC<Props> = ({
  id,
  title,
  content,
  query,
  searchQuery,
}) => {
  const nav = useNavigate();
  const { data: document } = useGetDocumentByIdQuery(id!);

  const onCardClick = async () => {
    try {
      nav(
        `/content-manager/library/folder/${document?.originalFolderId}/document/${id}`
      );
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const maxTitleLength = 50;
  const maxQueryLength = 80;
  const maxContentLength = 400;

  const truncatedTitle = truncateText(title, maxTitleLength);
  const truncatedQuery = truncateText(query, maxQueryLength);
  const truncatedContent = truncateText(content, maxContentLength);

  const highlightedTitle = highlightText(truncatedTitle, searchQuery);
  const highlightedQuery = highlightText(truncatedQuery, searchQuery);
  const highlightedContent = highlightTextInHTML(truncatedContent, searchQuery);

  return (
    <div
      className="border border-[#DDEBF6] bg-white rounded-[16px] p-[16px] w-full cursor-pointer hover:shadow-xl"
      onClick={onCardClick}
    >
      <div className="flex flex-col gap-[16px]">
        <h1 className="text-[18px] text-[#1D1D1F] font-semibold">
          {highlightedTitle}
        </h1>
        <div className="text-[24px] text-[#1D1D1F] font-[700]">
          {highlightedQuery}
        </div>
        <div
          className="prose text-[16px] text-[#5F5F65] font-[500]"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      </div>
    </div>
  );
};
