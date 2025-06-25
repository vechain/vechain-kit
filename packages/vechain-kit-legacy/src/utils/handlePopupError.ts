import { isMobile } from 'react-device-detect';
import { isRejectionError } from './stringUtils';

type PopupErrorOptions = {
    error: unknown;
    mobileBrowserPopupMessage?: string;
    rejectedMessage?: string;
    defaultMessage?: string;
};

export const handlePopupError = ({
    error,
    mobileBrowserPopupMessage = 'Mobile browser blocked the window. Please try again.',
    rejectedMessage = 'Request was cancelled.',
    defaultMessage = 'Operation failed',
}: PopupErrorOptions): Error => {
    const errorMsg = (error as { message?: string })?.message;

    // If it's mobile browser and not a user rejection, it might be due to popup blocking
    if (isMobile && errorMsg && !isRejectionError(errorMsg)) {
        return new Error(mobileBrowserPopupMessage);
    }

    // Handle user rejection or other errors
    if (errorMsg && isRejectionError(errorMsg)) {
        return new Error(rejectedMessage);
    }

    // If it's an Error instance, return it, otherwise create new Error
    return error instanceof Error ? error : new Error(defaultMessage);
};
