export const countConditionMap: Record<string, number> = {
  'Continue Reading': 8,
  'Personalized for you': 4,
  'Explore new topics': 3,
};

export const getCountCondition = (
  title: string,
  itemsLength: number
): number => {
  return countConditionMap[title] || itemsLength;
};

export const getLinkCondition = (item: any, type: string): string => {
  if (type === 'post') {
    return `/post/${item.title.replace(/\s+/g, '-').toLowerCase()}`;
  } else {
    return `/admin2/folder/${item.folderId || 'default'}/topic/${item.title.replace(/\s+/g, '-').toLowerCase()}`;
  }
};
