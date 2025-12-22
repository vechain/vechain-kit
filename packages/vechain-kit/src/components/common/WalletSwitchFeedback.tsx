import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineFeedback } from './InlineFeedback';

type Props = {
    /**
     * Show feedback flag passed via content props (desktop)
     * If true, shows the feedback message
     */
    showFeedback?: boolean;
};

/**
 * Component that displays inline feedback when a wallet switch occurs.
 * Handles both desktop (via props) and VeWorld in-app browser (via address change detection).
 * Simply add this component where you want the feedback to appear.
 */
export const WalletSwitchFeedback = ({ showFeedback = false }: Props) => {
    const { t } = useTranslation();
    const [showSwitchFeedback, setShowSwitchFeedback] = useState(false);

    // Handle prop-based feedback (desktop)
    useEffect(() => {
        if (showFeedback) {
            setShowSwitchFeedback(true);
        } else {
            // Reset feedback when prop becomes false/undefined (e.g., modal closed and reopened)
            setShowSwitchFeedback(false);
        }
    }, [showFeedback]);

    if (!showSwitchFeedback) {
        return null;
    }

    return (
        <InlineFeedback
            message={t('Account Changed')}
            duration={2000}
            onClose={() => {
                setShowSwitchFeedback(false);
            }}
        />
    );
};
