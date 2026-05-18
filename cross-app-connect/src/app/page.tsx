'use client';

import { useTranslation } from 'react-i18next';
import { VechainHeader } from './components/VechainHeader';
import styles from './page.module.css';

export default function LandingPage() {
    const { t } = useTranslation();
    return (
        <main className={styles.shell}>
            <VechainHeader
                title={t('landing.title')}
                subtitle={t('landing.subtitle')}
            />
            <section>
                <h2 className={styles.heading}>{t('landing.routes')}</h2>
                <ul className={styles.list}>
                    <li>
                        <code className={styles.code}>/cross-app/connect</code>
                        {' '}&mdash; {t('landing.connectDesc')}
                    </li>
                    <li>
                        <code className={styles.code}>/cross-app/transact</code>
                        {' '}&mdash; {t('landing.transactDesc')}
                    </li>
                </ul>
            </section>
            <p className={styles.footer}>{t('landing.footer')}</p>
        </main>
    );
}
