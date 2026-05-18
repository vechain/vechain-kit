import type { IconType } from 'react-icons';
import { RequesterChip } from './RequesterChip';
import styles from './VechainHeader.module.css';

type Props = {
    title?: string;
    /**
     * Optional icon rendered alongside the title. Used on the transact
     * screen to anchor a security framing (LuShieldCheck / LuShieldAlert /
     * LuShieldX depending on risk).
     */
    titleIcon?: IconType;
    /**
     * Color for the title icon. Defaults to the accent token. The transact
     * screen passes `var(--warn)` / `var(--danger)` on cautioned / dangerous
     * transactions so the icon swaps in tandem with the verb.
     */
    titleIconColor?: string;
    subtitle?: string;
    /**
     * Requester dApp's callbackUrl. When provided, renders a chip with the
     * site's favicon + hostname under the title to identify who's asking.
     */
    requesterUrl?: string;
};

export function VechainHeader({
    title = 'Log in to your wallet',
    titleIcon: TitleIcon,
    titleIconColor = 'var(--accent)',
    subtitle,
    requesterUrl,
}: Props) {
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
                <div className={styles.titleRow}>
                    {TitleIcon && (
                        <TitleIcon
                            className={styles.titleIcon}
                            style={{ color: titleIconColor }}
                            aria-hidden
                        />
                    )}
                    <h1 className={styles.title}>{title}</h1>
                </div>

                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

                {requesterUrl && <RequesterChip url={requesterUrl} />}
            </div>
        </header>
    );
}
