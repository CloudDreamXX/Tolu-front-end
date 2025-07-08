import { IFolder } from "entities/folder";
import { PathEntry } from "features/document-management/hooks/util";
import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "shared/ui";

interface DocumentBreadcrumbsProps {
  tab?: string;
  folder: IFolder | null;
  path: PathEntry[];
}

export const DocumentBreadcrumbs: React.FC<DocumentBreadcrumbsProps> = ({
  tab,
  folder,
  path,
}) => {
  const subFolderPaths = path.slice(1, -1);
  const documentEntry = path[path.length - 1];

  return (
    <Breadcrumb className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
      {folder && (
        <>
          <BreadcrumbItem className="capitalize ">{tab}</BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem className="capitalize ">{folder.name}</BreadcrumbItem>

          {subFolderPaths.map((sub) => (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="capitalize ">
                {sub.name}
              </BreadcrumbItem>
            </>
          ))}

          {documentEntry && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="capitalize">
                {documentEntry.name}
              </BreadcrumbItem>
            </>
          )}
        </>
      )}
    </Breadcrumb>
  );
};
