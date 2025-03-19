export const loadMoreItems = (items, currentCount, increment) => {
    return items.slice(0, currentCount + increment);
};