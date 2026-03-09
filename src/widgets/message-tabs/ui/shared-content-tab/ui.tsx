import {
  CoachSharedContentItem,
  useGetClientSharedContentQuery,
} from "entities/coach";
import { Folder, useGetLibraryContentQuery } from "entities/client";
import { useGetFoldersQuery } from "entities/folder/api";
import { IFolder, ISubfolder } from "entities/folder";
import { LibraryCard } from "features/library-card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, toast, usePageWidth } from "shared/lib";

type SharedListItem = {
  id: string;
  title: string;
  author: string;
};

interface SharedContentTabProps {
  isClient: boolean;
  clientId?: string;
}

const flattenClientFolders = (folders: Folder[] = []): SharedListItem[] => {
  const acc: SharedListItem[] = [];

  const walk = (items: Folder[]) => {
    items.forEach((folder) => {
      (folder.content || []).forEach((item) => {
        acc.push({
          id: item.id,
          title: item.ai_title || item.title || "Untitled",
          author: item.author_name || "Coach",
        });
      });

      if (folder.subfolders?.length) {
        walk(folder.subfolders as Folder[]);
      }
    });
  };

  walk(folders);

  const unique = new Map<string, SharedListItem>();
  acc.forEach((item) => unique.set(item.id, item));
  return Array.from(unique.values());
};

const findFolderForContent = (
  folders: IFolder[] = [],
  contentId: string
): string | undefined => {
  const walk = (folder: IFolder | ISubfolder): string | undefined => {
    if (folder.content?.some((content) => content.id === contentId)) {
      return folder.id;
    }

    for (const sub of folder.subfolders || []) {
      const hit = walk(sub);
      if (hit) return hit;
    }

    return undefined;
  };

  for (const folder of folders) {
    const hit = walk(folder);
    if (hit) return hit;
  }

  return undefined;
};

const mapCoachSharedContent = (
  sharedContent: CoachSharedContentItem[] = []
): SharedListItem[] => {
  const mapped = sharedContent
    .map((item) => {
      const id = item.content_id;
      if (!id) return null;

      return {
        id,
        title: item.title || "Untitled",
        author: "You",
      } as SharedListItem;
    })
    .filter((item): item is SharedListItem => item !== null);

  const unique = new Map<string, SharedListItem>();
  mapped.forEach((item) => unique.set(item.id, item));
  return Array.from(unique.values());
};

export const SharedContentTab: React.FC<SharedContentTabProps> = ({
  isClient,
  clientId,
}) => {
  const navigate = useNavigate();
  const { isMobileOrTablet } = usePageWidth();

  const [sharedItems, setSharedItems] = useState<SharedListItem[]>([]);

  const { data: coachSharedContent, isFetching: loadingCoachSharedContent } =
    useGetClientSharedContentQuery(clientId!, {
      skip: isClient || !clientId,
    });

  const { data: foldersResponse } = useGetFoldersQuery(undefined, {
    skip: isClient,
  });

  const { data: clientLibrary, isFetching: loadingClientLibrary } =
    useGetLibraryContentQuery(
      {
        page: 1,
        page_size: 10,
        folder_id: "recommended",
      },
      {
        skip: !isClient,
      }
    );

  useEffect(() => {
    if (!isClient) return;

    const folders = clientLibrary?.data || [];
    setSharedItems(flattenClientFolders(folders));
  }, [isClient, clientLibrary]);

  useEffect(() => {
    if (isClient) return;
    setSharedItems(
      mapCoachSharedContent(coachSharedContent?.data?.shared_content)
    );
  }, [isClient, coachSharedContent]);

  const loading =
    (!isClient && loadingCoachSharedContent) ||
    (isClient && loadingClientLibrary);

  const handleOpenDocument = (contentId: string) => {
    if (isClient) {
      navigate(`/library/document/${contentId}`);
      return;
    }

    const folderId = findFolderForContent(
      foldersResponse?.folders || [],
      contentId
    );

    if (!folderId) {
      toast({
        variant: "destructive",
        title: "Unable to open shared document",
        description: "Folder for this document was not found.",
      });
      return;
    }

    navigate(
      `/content-manager/library/folder/${folderId}/document/${contentId}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <MaterialIcon
          iconName="progress_activity"
          className="text-blue-500 animate-spin"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-auto custom-message-scroll pr-3",
        isClient
          ? "h-[calc(100vh-215.5px)] md:h-[calc(100vh-333px)] lg:h-[calc(100vh-160px)]"
          : "h-[calc(100vh-229px)] md:h-[calc(100vh-253px)] lg:h-[calc(100vh-260px)]"
      )}
    >
      {!sharedItems.length ? (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-[18px] md:text-[20px] font-[500] text-[#1D1D1F]">
            No shared content yet
          </p>
        </div>
      ) : (
        <div
          className={cn("flex flex-col gap-4", !isMobileOrTablet && "lg:p-6")}
        >
          {sharedItems.map((item) => (
            <LibraryCard
              key={item.id}
              id={item.id}
              title={item.title}
              author={item.author}
              onDocumentClick={handleOpenDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
};
