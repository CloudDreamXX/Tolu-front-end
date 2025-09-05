import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "shared/ui";

interface ChatBreadcrumbProps {
  displayChatTitle: string;
  pathTitle?: string;
  path?: string;
}

export const ChatBreadcrumb: React.FC<ChatBreadcrumbProps> = ({
  displayChatTitle,
  path,
  pathTitle,
}) => (
  <div>
    <Breadcrumb className="flex flex-row items-center gap-2 text-sm text-gray-600">
      <BreadcrumbLink href={path ? path : "/library"}>
        {pathTitle ? pathTitle : "Library"}
      </BreadcrumbLink>
      <BreadcrumbSeparator />
      <BreadcrumbItem className="text-gray-800">
        {displayChatTitle}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
);
