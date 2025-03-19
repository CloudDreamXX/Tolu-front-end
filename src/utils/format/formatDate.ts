export const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    return new Date(date).toLocaleDateString(undefined, options);
};