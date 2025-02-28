type PopupErrorOptions = {
    error: unknown;
    rejectedMessage?: string;
    defaultMessage?: string;
};

export const handlePopupError = ({
    error,
    rejectedMessage = 'Request was cancelled.',
    defaultMessage = 'Operation failed',
}: PopupErrorOptions): Error => {
    const errorMsg = (error as { message?: string })?.message;

    // Handle user rejection or other errors
    if (errorMsg?.includes('rejected') || errorMsg?.includes('closed')) {
        return new Error(rejectedMessage);
    }

    // If it's an Error instance, return it, otherwise create new Error
    return error instanceof Error ? error : new Error(defaultMessage);
};
