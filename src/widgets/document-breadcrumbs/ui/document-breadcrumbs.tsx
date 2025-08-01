import { IFolder } from "entities/folder";
import { PathEntry } from "features/wrapper-folder-tree";
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
    <Breadcrumb className="flex flex-row flex-wrap items-center gap-2 text-sm text-muted-foreground ">
      {folder && path.length && (
        <>
          <BreadcrumbItem className="capitalize text-nowrap">
            {tab}
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem className="capitalize text-nowrap ">
            {path[0].name}
          </BreadcrumbItem>

          {subFolderPaths.map((sub) => (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="capitalize text-nowrap ">
                {sub.name}
              </BreadcrumbItem>
            </>
          ))}

          {documentEntry && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="capitalize truncate">
                {documentEntry.name}
              </BreadcrumbItem>
            </>
          )}
        </>
      )}
    </Breadcrumb>
  );
};
