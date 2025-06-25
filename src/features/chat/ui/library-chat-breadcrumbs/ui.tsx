import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "shared/ui";

interface ChatBreadcrumbProps {
  displayChatTitle: string;
}

export const ChatBreadcrumb: React.FC<ChatBreadcrumbProps> = ({
  displayChatTitle,
}) => (
  <div className="">
    <Breadcrumb className="flex flex-row gap-2 text-sm text-gray-600">
      <BreadcrumbLink href="/library">Library</BreadcrumbLink>
      <BreadcrumbSeparator className="text-gray-400" />
      <BreadcrumbItem className="text-gray-800">
        {displayChatTitle}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
);
