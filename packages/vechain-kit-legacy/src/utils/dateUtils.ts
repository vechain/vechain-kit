export const formatDate = (timestamp: number, locale: string = 'en-US') => {
    //Return intl (Eg. Sep 15)

    return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
    }).format(new Date(timestamp));
};
