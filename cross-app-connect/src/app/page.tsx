import { VechainHeader } from './components/VechainHeader';
import styles from './page.module.css';

export default function LandingPage() {
    return (
        <main className={styles.shell}>
            <VechainHeader
                title="VeChain Cross-App Connect"
                subtitle="Whitelabel host for Privy cross-app connection and transaction flows."
            />
            <section>
                <h2 className={styles.heading}>Routes</h2>
                <ul className={styles.list}>
                    <li>
                        <code className={styles.code}>/cross-app/connect</code>
                        {' '}&mdash; handles connection requests
                    </li>
                    <li>
                        <code className={styles.code}>/cross-app/transact</code>
                        {' '}&mdash; handles transaction / signing requests
                    </li>
                </ul>
            </section>
            <p className={styles.footer}>
                This page isn&apos;t opened directly by users.
            </p>
        </main>
    );
}
