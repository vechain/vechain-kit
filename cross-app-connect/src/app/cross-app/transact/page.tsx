import { TransactClient } from './TransactClient';
import styles from './transact.module.css';

/**
 * Server Component shell for the transact popup. Renders the page container
 * directly to HTML so the browser paints structure before the client island
 * parses. All dynamic behaviour (decrypt URL params, fetch on-chain data,
 * sign + submit) lives in `TransactClient.tsx`.
 */
export default function CrossAppTransactPage() {
    return (
        <main className={styles.shell}>
            <TransactClient />
        </main>
    );
}
