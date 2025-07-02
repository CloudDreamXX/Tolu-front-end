import React from "react";
import { IFolder, ISubfolder } from "entities/folder";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbItem,
} from "shared/ui";

interface DocumentBreadcrumbsProps {
  tab?: string;
  folder: IFolder | null;
  subfolder?: ISubfolder;
}

export const DocumentBreadcrumbs: React.FC<DocumentBreadcrumbsProps> = ({
  tab,
  folder,
  subfolder,
}) => {
  return (
    <Breadcrumb className="flex flex-row gap-2 text-sm text-muted-foreground">
      {folder && (
        <>
          <BreadcrumbLink
            className="capitalize"
            href={`/content-manager/${tab}`}
          >
            {tab}
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink
            className="capitalize"
            href={`/content-manager/${tab}/folder/${folder.id}`}
          >
            {folder.name}
          </BreadcrumbLink>
          {subfolder && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {subfolder.name ?? "Unknown Folder"}
              </BreadcrumbItem>
            </>
          )}
        </>
      )}
    </Breadcrumb>
  );
};
