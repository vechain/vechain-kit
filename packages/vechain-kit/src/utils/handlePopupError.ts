import { isSafari } from 'react-device-detect';

type PopupErrorOptions = {
    error: unknown;
    safariMessage?: string;
    rejectedMessage?: string;
    defaultMessage?: string;
};

export const handlePopupError = ({
    error,
    safariMessage = 'Safari blocked the window. Please try again.',
    rejectedMessage = 'Request was cancelled.',
    defaultMessage = 'Operation failed',
}: PopupErrorOptions): Error => {
    const errorMsg = (error as { message?: string })?.message;

    // If it's Safari and not a user rejection, it might be due to popup blocking
    if (isSafari && !errorMsg?.includes('rejected')) {
        return new Error(safariMessage);
    }

    // Handle user rejection or other errors
    if (errorMsg?.includes('rejected') || errorMsg?.includes('closed')) {
        return new Error(rejectedMessage);
    }

    // If it's an Error instance, return it, otherwise create new Error
    return error instanceof Error ? error : new Error(defaultMessage);
};
