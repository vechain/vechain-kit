import { ConnectClient } from './ConnectClient';
import styles from './connect.module.css';

/**
 * Server Component shell for the connect popup. Renders the page container
 * to HTML so the browser paints structure before the client island parses.
 * Login flow + cross-app handshake live in `ConnectClient.tsx`.
 */
export default function CrossAppConnectPage() {
    return (
        <main className={styles.shell}>
            <ConnectClient />
        </main>
    );
}
