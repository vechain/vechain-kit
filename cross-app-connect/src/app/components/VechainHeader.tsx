'use client';

import { useTranslation } from 'react-i18next';
import { RequesterChip } from './RequesterChip';
import styles from './VechainHeader.module.css';

type Props = {
    title?: string;
    subtitle?: string;
    /**
     * Requester dApp's callbackUrl. When provided, renders a chip with the
     * site's favicon + hostname under the title to identify who's asking.
     */
    requesterUrl?: string;
};

export function VechainHeader({ title, subtitle, requesterUrl }: Props) {
    const { t } = useTranslation();
    const effectiveTitle = title ?? t('header.title.default');
    return (
        <header className={styles.header}>
            <div className={styles.logoBox}>
                <img
                    src="/brand/vechain-logomark-light.png"
                    alt="VeChain"
                    className={styles.logo}
                    draggable={false}
                />
            </div>
            <div className={styles.titleStack}>
                <h1 className={styles.title}>{effectiveTitle}</h1>

                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

                {requesterUrl && <RequesterChip url={requesterUrl} />}
            </div>
        </header>
    );
}
