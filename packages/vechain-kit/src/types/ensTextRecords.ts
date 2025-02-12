export const ENS_TEXT_RECORDS = [
    'display',
    'avatar',
    'description',
    'keywords',
    'email',
    'url',
    'header',
    'notice',
    'location',
    'phone',
    'com.x',
] as const;

export type TextRecords = {
    [K in (typeof ENS_TEXT_RECORDS)[number]]?: string;
};
