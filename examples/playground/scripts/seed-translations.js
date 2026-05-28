/**
 * One-shot seed for non-English playground translations.
 *
 * `yarn translate` (translo-cli) is the canonical path, but it requires API
 * keys this script does not. Use this when translo isn't available or hasn't
 * been wired into a workflow yet: it overwrites the English-fallback values
 * with human-quality translations for the UI strings, keeping the long
 * multi-line AI prompts in English (they're meant for AI agents, which
 * understand English best — and they contain technical identifiers like
 * hook names that shouldn't be translated anyway).
 *
 * Usage:
 *   node scripts/seed-translations.js
 */
const fs = require('fs');
const path = require('path');

const LANG_DIR = path.join(__dirname, '..', 'src', 'app', 'languages');

// Shared across all languages — same English value everywhere.
const KEEP_ENGLISH = new Set([
    'AI prompt', // technical UI label, used as tab label too
    'GitHub',
    'AI Skills',
    'Claude Code',
    'Beta',
    'Alpha',
    'VeKit Playground',
    'Menu',
    'UI',
    'MCP endpoint',
    'npm package',
    'VeChain AI Skills',
]);

// Per-language translation map. Only short, UI-facing strings.
// Long AI prompts (multi-line `\n` content) stay English by design.
const TRANSLATIONS = {
    it: {
        Overview: 'Panoramica',
        Build: 'Sviluppo',
        More: 'Altro',
        'Getting Started': 'Per iniziare',
        'Connect & Auth': 'Connessione e auth',
        Identity: 'Identità',
        'Smart Account': 'Smart Account',
        Transactions: 'Transazioni',
        Signing: 'Firma',
        'Reading Data': 'Lettura dati',
        Modals: 'Modali',
        'Theming & i18n': 'Tema e i18n',
        Resources: 'Risorse',
        'Open menu': 'Apri menu',
        'Toggle color mode': 'Cambia tema',
        'Login or sign up': 'Accedi o registrati',
        'The complete toolkit for VeChain dApps':
            'Il toolkit completo per le dApp VeChain',
        'Every demo ships with three things: a live preview, the code, and a ready-made prompt you can paste into Claude Code, Cursor or any AI agent.':
            'Ogni demo include tre cose: anteprima dal vivo, codice, e un prompt pronto da incollare in Claude Code, Cursor o qualsiasi agente AI.',
        'AI-friendly playground': 'Playground AI-friendly',
        'Connect wallet': 'Connetti wallet',
        'Read the docs': 'Leggi la documentazione',
        'Live demo': 'Demo dal vivo',
        'View code': 'Mostra codice',
        Copy: 'Copia',
        'Copy prompt': 'Copia prompt',
        'Copied!': 'Copiato!',
        'Prompt copied!': 'Prompt copiato!',
        'Paste it into Claude Code, Cursor or any AI agent.':
            'Incollalo in Claude Code, Cursor o qualsiasi agente AI.',
        'Copy failed': 'Copia fallita',
        'Copy command': 'Copia comando',
        New: 'Nuovo',
        Stable: 'Stabile',
        'Connect to try {{feature}}': 'Connettiti per provare {{feature}}',
        'Sign in with a VeChain wallet or social account to unlock this demo.':
            'Accedi con un wallet VeChain o un account social per sbloccare questa demo.',
        'What you get': 'Cosa ottieni',
        'VeWorld, WalletConnect, social logins via Privy.':
            'VeWorld, WalletConnect, login social tramite Privy.',
        'Gas-less first action, recoverable, transferable.':
            'Prima azione senza gas, recuperabile, trasferibile.',
        'Single & multi-clause txs with fee delegation.':
            'Transazioni single & multi-clause con delega del gas.',
        'Personal messages and EIP-712 typed data.':
            'Messaggi personali e dati tipizzati EIP-712.',
        'Balances, prices, VeBetterDAO and more.':
            'Saldi, prezzi, VeBetterDAO e altro.',
        'Dark mode, custom themes, 15+ languages.':
            'Tema scuro, temi personalizzati, 15+ lingue.',
        '🚀 Start a new VeChain dApp': '🚀 Crea una nuova dApp VeChain',
        'Or: add VeChain Kit to an existing project':
            'Oppure: aggiungi VeChain Kit a un progetto esistente',
        'Already have a Next.js app? Install the package, then either follow the provider snippet below or use the AI prompt to wire it up automatically.':
            'Hai già un\'app Next.js? Installa il pacchetto e poi segui lo snippet del provider qui sotto, oppure usa il prompt AI per fare tutto in automatico.',
        'Install the package manually:': 'Installa il pacchetto manualmente:',
        'The recommended path. Hand this prompt to your coding agent — it will read the VeChain skills and scaffold the entire project, provider included.':
            'Il percorso consigliato. Passa questo prompt al tuo agente di coding — leggerà le VeChain skills e scaffolderà l\'intero progetto, provider incluso.',
        'Use the sidebar to explore each capability. Pages with the wallet icon need a connection — sign in from the top bar.':
            'Usa la sidebar per esplorare ogni funzione. Le pagine con l\'icona wallet richiedono una connessione — accedi dalla barra in alto.',
        'Install 11 VeChain skills in Claude Code, Cursor or any agent — domain knowledge for wallet UX, smart contracts, VeBetterDAO and more.':
            'Installa 11 VeChain skills in Claude Code, Cursor o qualsiasi agente — conoscenza dominio per wallet UX, smart contract, VeBetterDAO e altro.',
        'Drop-in wallet UI, plus a hook-first API to roll your own.':
            'UI wallet pronta all\'uso, più un\'API hook-first per costruire la tua.',
        'WalletButton variants': 'Varianti di WalletButton',
        'One component, multiple presentation modes. Style it freely or replace it with your own button + useConnectModal.':
            'Un componente, più modalità di presentazione. Personalizza lo stile o sostituiscilo con un button + useConnectModal.',
        'Custom styling (buttonStyle prop)':
            'Stile custom (prop buttonStyle)',
        'Open VeChain Kit modal': 'Apri il modal VeChain Kit',
        'Open dapp-kit only modal': 'Apri solo il modal di dapp-kit',
        'Social login providers': 'Provider di login social',
        'OAuth runs through your Privy app, or falls back to the VeChain whitelabel cross-app host out of the box.':
            'OAuth passa dalla tua app Privy, oppure ricade automaticamente sul cross-app host whitelabel di VeChain.',
        'Inspect the connected account, its smart account, domain and connection source.':
            'Ispeziona l\'account connesso, il suo smart account, dominio e fonte di connessione.',
        'Account details': 'Dettagli account',
        'Everything useWallet() exposes about the current session.':
            'Tutto quello che useWallet() espone sulla sessione corrente.',
        'Connection source': 'Fonte di connessione',
        'How the user is authenticated — direct wallet, Privy, or cross-app.':
            'Come è autenticato l\'utente — wallet diretto, Privy o cross-app.',
        'Embedded Wallet': 'Embedded Wallet',
        Deployed: 'Deployato',
        Yes: 'Sì',
        No: 'No',
        'VET Domain': 'Dominio VET',
        Source: 'Fonte',
        Network: 'Network',
        "You're connected using Privy authentication, which provides a dedicated user management system for this application.":
            'Sei connesso tramite autenticazione Privy, che fornisce un sistema dedicato di gestione utenti per questa applicazione.',
        "You're connected through the VeChain cross-app ecosystem, sharing authentication with other VeChain apps.":
            'Sei connesso tramite l\'ecosistema cross-app VeChain, condividendo l\'autenticazione con altre app VeChain.',
        "You're connected directly through a Web3 wallet (VeWorld, Sync2, or WalletConnect).":
            'Sei connesso direttamente tramite un wallet Web3 (VeWorld, Sync2 o WalletConnect).',
        'Connection type not recognized.':
            'Tipo di connessione non riconosciuto.',
        'Automatic smart account for Privy users. Gas-less first action, recoverable, transferable.':
            'Smart account automatico per utenti Privy. Prima azione senza gas, recuperabile, trasferibile.',
        'How smart accounts work': 'Come funzionano gli smart account',
        'A primer on the ownership and recovery model.':
            'Un\'introduzione al modello di ownership e recovery.',
        'Upgrade smart account': 'Aggiorna smart account',
        'Migrate the smart account to the latest version when a new release is published.':
            'Migra lo smart account alla versione più recente quando viene pubblicata una nuova release.',
        'Open upgrade modal': 'Apri il modal di upgrade',
        'Secure Ownership': 'Ownership sicura',
        'Exclusively controlled by your Privy-secured wallet':
            'Controllato esclusivamente dal tuo wallet Privy-secured',
        Transferable: 'Trasferibile',
        'Transfer ownership to another wallet anytime':
            'Trasferisci la ownership a un altro wallet in qualsiasi momento',
        Recovery: 'Recovery',
        'Secure backup and recovery through Privy':
            'Backup e recovery sicuri tramite Privy',
        'Smart accounts are not deployed on login but only after the first action — no gas spent until you need it.':
            'Gli smart account non vengono deployati al login ma solo dopo la prima azione — nessun gas speso finché non serve.',
        'Build, send and track transactions with built-in UI (toast or modal) and fee delegation.':
            'Costruisci, invia e traccia transazioni con UI integrata (toast o modal) e delega del gas.',
        'Send a test transaction': 'Invia una transazione di prova',
        'Two UI modes share the same useBuildTransaction state. Pick whichever fits your design.':
            'Due modalità UI condividono lo stesso stato di useBuildTransaction. Scegli quella che si adatta al tuo design.',
        'Send a 0-value B3TR transfer to your own address. Costs nothing, just exercises the full flow.':
            'Invia un trasferimento B3TR da 0 al tuo stesso indirizzo. Non costa nulla, serve solo a testare il flusso completo.',
        'Dummy transaction: transfer 0 B3TR to your own address.':
            'Transazione di prova: trasferisce 0 B3TR al tuo indirizzo.',
        'Transaction status': 'Stato transazione',
        'Transaction ID': 'ID transazione',
        'View on explorer': 'Vedi sull\'explorer',
        'Gas used': 'Gas usato',
        Error: 'Errore',
        'Try again': 'Riprova',
        'Sign plain messages or structured EIP-712 typed data — works for both wallet and embedded users.':
            'Firma messaggi semplici o dati tipizzati EIP-712 — funziona sia per utenti wallet che embedded.',
        'Personal sign': 'Firma personale',
        'A simple message signature. Useful for proving ownership of an address.':
            'Una semplice firma di messaggio. Utile per provare la ownership di un indirizzo.',
        'Message signed!': 'Messaggio firmato!',
        'Signing failed': 'Firma fallita',
        'EIP-712 typed data': 'Dati tipizzati EIP-712',
        'Structured signing — the standard for off-chain order books, permits and gasless approvals.':
            'Firma strutturata — lo standard per order book off-chain, permit e approval gasless.',
        'Sign typed data': 'Firma dati tipizzati',
        'Typed data signed!': 'Dati tipizzati firmati!',
        Signature: 'Firma',
        'React Query hooks for on-chain data — efficient caching, automatic refetching, ready to compose.':
            'Hook React Query per dati on-chain — caching efficiente, refetch automatico, pronti da comporre.',
        'Account balances': 'Saldi dell\'account',
        'B3TR and VOT3 balances for the connected address.':
            'Saldi B3TR e VOT3 per l\'indirizzo connesso.',
        'Token prices': 'Prezzi dei token',
        'Live USD price from the kit price oracle.':
            'Prezzo USD live dal price oracle del kit.',
        'Round metadata and passport validity for the connected account.':
            'Metadati del round e validità del passport per l\'account connesso.',
        'Valid passport': 'Passport valido',
        'Every feature in the kit ships as both a hook and a modal. Trigger them from your own UI.':
            'Ogni feature del kit è disponibile sia come hook che come modal. Triggera direttamente dalla tua UI.',
        'Modal catalog': 'Catalogo modali',
        'Click any card to open the corresponding modal in isolated view. Each card lists the hook that opens it.':
            'Clicca una card per aprire il modal corrispondente in vista isolata. Ogni card mostra l\'hook che la apre.',
        'Show and customize the user profile: avatar, display name, bio and more.':
            'Mostra e personalizza il profilo utente: avatar, display name, bio e altro.',
        'Light/dark mode + multi-language support, fully integrated with Chakra and react-i18next.':
            'Tema chiaro/scuro + supporto multi-lingua, completamente integrati con Chakra e react-i18next.',
        'Dark / light mode': 'Tema scuro / chiaro',
        'Powered by Chakra `useColorMode`. The whole kit (including modals) follows the active mode.':
            'Powered by Chakra `useColorMode`. L\'intero kit (modali inclusi) segue il tema attivo.',
        'Switch to dark mode': 'Passa al tema scuro',
        'Switch to light mode': 'Passa al tema chiaro',
        'Current mode': 'Tema corrente',
        'Multi-language support': 'Supporto multi-lingua',
        'react-i18next ships with the kit. Add your keys, pick the languages you support, and translate.':
            'react-i18next viene fornito con il kit. Aggiungi le tue chiavi, scegli le lingue da supportare, e traduci.',
        'Documentation, source code and integrations to go further with VeChain Kit.':
            'Documentazione, codice sorgente e integrazioni per andare oltre con VeChain Kit.',
        Documentation: 'Documentazione',
        'Full reference for components, hooks and providers.':
            'Riferimento completo per componenti, hook e provider.',
        'Plug VeChain Kit docs into Claude, Cursor and any MCP-compatible client.':
            'Collega la documentazione VeChain Kit a Claude, Cursor e qualsiasi client compatibile MCP.',
        'GitHub repository': 'Repository GitHub',
        'Source code, examples and the playground you are using right now.':
            'Codice sorgente, esempi e il playground che stai usando ora.',
        'Install @vechain/vechain-kit from the registry.':
            'Installa @vechain/vechain-kit dal registry.',
        'Request a feature': 'Richiedi una feature',
        'Missing a building block? Open an issue and tell us about it.':
            'Manca un building block? Apri una issue e raccontaci.',
        'Install 11 VeChain skills in Claude Code, Cursor or any agent so it ships dApps with domain knowledge baked in.':
            'Installa 11 VeChain skills in Claude Code, Cursor o qualsiasi agente, così rilascia dApp con la conoscenza del dominio integrata.',
        'Ship VeChain dApps with AI': 'Rilascia dApp VeChain con l\'AI',
        'Give your coding agent deep VeChain domain knowledge — wallet UX, smart contracts, VeBetterDAO, StarGate, and more. Works with Claude Code, Cursor, and any agent.':
            'Dai al tuo agente di coding una conoscenza profonda del dominio VeChain — wallet UX, smart contract, VeBetterDAO, StarGate e altro. Funziona con Claude Code, Cursor e qualsiasi agente.',
        'Any agent (Skills CLI)': 'Qualsiasi agente (Skills CLI)',
        'Available skills': 'Skills disponibili',
        'Try a prompt': 'Prova un prompt',
        'View on GitHub': 'Mostra su GitHub',
        'Now the task:': 'Adesso il compito:',
        'Before doing anything, read these VeChain AI Skills so you follow current conventions:':
            'Prima di fare qualsiasi cosa, leggi queste VeChain AI Skills per seguire le convenzioni attuali:',
        'Recommended skills': 'Skills consigliate',
        'Tip: install VeChain AI Skills first so your agent picks up domain context automatically.':
            'Suggerimento: installa prima le VeChain AI Skills così il tuo agente prende automaticamente il contesto di dominio.',
        'Core SDK, fee delegation, multi-clause transactions.':
            'SDK core, delega del gas, transazioni multi-clause.',
        'Frontend dApps, wallet, social login, hooks.':
            'dApp frontend, wallet, login social, hook.',
        'Solidity, Hardhat, testing, security.':
            'Solidity, Hardhat, testing, security.',
        'X2Earn apps, B3TR/VOT3, governance.':
            'App X2Earn, B3TR/VOT3, governance.',
        'NFT staking, validators, delegation.':
            'NFT staking, validator, delegation.',
        'Scaffold a VeChain dApp in seconds.':
            'Scaffold di una dApp VeChain in secondi.',
        'VeWorld deep-link integration.': 'Integrazione deep-link VeWorld.',
        'Index VeChain events and blocks for apps or analytics.':
            'Indicizza eventi e blocchi VeChain per app o analytics.',
        'Auto-voting & relayer system.':
            'Sistema di auto-voting & relayer.',
        'i18n translation management across locales.':
            'Gestione traduzioni i18n tra locale.',
        'Pressure-tests your plan before you write code.':
            'Stressa il tuo piano prima di scrivere codice.',
    },

    es: {
        Overview: 'Resumen',
        Build: 'Desarrollo',
        More: 'Más',
        'Getting Started': 'Empezar',
        'Connect & Auth': 'Conexión y auth',
        Identity: 'Identidad',
        'Smart Account': 'Smart Account',
        Transactions: 'Transacciones',
        Signing: 'Firma',
        'Reading Data': 'Lectura de datos',
        Modals: 'Modales',
        'Theming & i18n': 'Tema e i18n',
        Resources: 'Recursos',
        'Open menu': 'Abrir menú',
        'Toggle color mode': 'Cambiar tema',
        'Login or sign up': 'Inicia sesión o regístrate',
        'The complete toolkit for VeChain dApps':
            'El toolkit completo para dApps VeChain',
        'Every demo ships with three things: a live preview, the code, and a ready-made prompt you can paste into Claude Code, Cursor or any AI agent.':
            'Cada demo incluye tres cosas: vista en vivo, el código y un prompt listo para pegar en Claude Code, Cursor o cualquier agente IA.',
        'AI-friendly playground': 'Playground AI-friendly',
        'Connect wallet': 'Conectar wallet',
        'Read the docs': 'Leer la documentación',
        'Live demo': 'Demo en vivo',
        'View code': 'Ver código',
        Copy: 'Copiar',
        'Copy prompt': 'Copiar prompt',
        'Copied!': '¡Copiado!',
        'Prompt copied!': '¡Prompt copiado!',
        'Paste it into Claude Code, Cursor or any AI agent.':
            'Pégalo en Claude Code, Cursor o cualquier agente IA.',
        'Copy failed': 'Copia fallida',
        'Copy command': 'Copiar comando',
        New: 'Nuevo',
        Stable: 'Estable',
        'Connect to try {{feature}}': 'Conéctate para probar {{feature}}',
        'Sign in with a VeChain wallet or social account to unlock this demo.':
            'Inicia sesión con un wallet VeChain o cuenta social para desbloquear esta demo.',
        'What you get': 'Qué incluye',
        '🚀 Start a new VeChain dApp': '🚀 Crea una nueva dApp VeChain',
        'Or: add VeChain Kit to an existing project':
            'O: añade VeChain Kit a un proyecto existente',
        'Install the package manually:': 'Instala el paquete manualmente:',
        'WalletButton variants': 'Variantes de WalletButton',
        'Custom styling (buttonStyle prop)': 'Estilo personalizado (prop buttonStyle)',
        'Open VeChain Kit modal': 'Abrir el modal de VeChain Kit',
        'Open dapp-kit only modal': 'Abrir solo el modal de dapp-kit',
        'Social login providers': 'Proveedores de login social',
        'Account details': 'Detalles de la cuenta',
        'Connection source': 'Fuente de conexión',
        'Embedded Wallet': 'Wallet integrado',
        Deployed: 'Desplegado',
        Yes: 'Sí',
        No: 'No',
        'VET Domain': 'Dominio VET',
        Source: 'Fuente',
        Network: 'Red',
        'How smart accounts work': 'Cómo funcionan los smart accounts',
        'Upgrade smart account': 'Actualizar smart account',
        'Open upgrade modal': 'Abrir modal de actualización',
        'Secure Ownership': 'Ownership seguro',
        Transferable: 'Transferible',
        Recovery: 'Recuperación',
        'Send a test transaction': 'Envía una transacción de prueba',
        'Transaction status': 'Estado de la transacción',
        'Transaction ID': 'ID de transacción',
        'View on explorer': 'Ver en el explorer',
        'Gas used': 'Gas usado',
        Error: 'Error',
        'Try again': 'Reintentar',
        'Personal sign': 'Firma personal',
        'Message signed!': '¡Mensaje firmado!',
        'Signing failed': 'Firma fallida',
        'EIP-712 typed data': 'Datos tipados EIP-712',
        'Sign typed data': 'Firmar datos tipados',
        'Typed data signed!': '¡Datos tipados firmados!',
        Signature: 'Firma',
        'Account balances': 'Saldos de la cuenta',
        'Token prices': 'Precios de tokens',
        'Valid passport': 'Passport válido',
        'Modal catalog': 'Catálogo de modales',
        'Dark / light mode': 'Tema oscuro / claro',
        'Switch to dark mode': 'Cambiar a tema oscuro',
        'Switch to light mode': 'Cambiar a tema claro',
        'Current mode': 'Tema actual',
        'Multi-language support': 'Soporte multi-idioma',
        Documentation: 'Documentación',
        'GitHub repository': 'Repositorio de GitHub',
        'Request a feature': 'Solicitar una funcionalidad',
        'Ship VeChain dApps with AI': 'Lanza dApps VeChain con IA',
        'Any agent (Skills CLI)': 'Cualquier agente (Skills CLI)',
        'Available skills': 'Skills disponibles',
        'Try a prompt': 'Prueba un prompt',
        'View on GitHub': 'Ver en GitHub',
        'Now the task:': 'Ahora la tarea:',
        'Recommended skills': 'Skills recomendadas',
    },

    fr: {
        Overview: 'Vue d\'ensemble',
        Build: 'Développement',
        More: 'Plus',
        'Getting Started': 'Démarrer',
        'Connect & Auth': 'Connexion & auth',
        Identity: 'Identité',
        'Smart Account': 'Smart Account',
        Transactions: 'Transactions',
        Signing: 'Signature',
        'Reading Data': 'Lecture de données',
        Modals: 'Modales',
        'Theming & i18n': 'Thème & i18n',
        Resources: 'Ressources',
        'Open menu': 'Ouvrir le menu',
        'Toggle color mode': 'Changer de thème',
        'Login or sign up': 'Se connecter ou s\'inscrire',
        'The complete toolkit for VeChain dApps':
            'Le toolkit complet pour les dApps VeChain',
        'AI-friendly playground': 'Playground AI-friendly',
        'Connect wallet': 'Connecter le wallet',
        'Read the docs': 'Lire la documentation',
        'Live demo': 'Démo en direct',
        'View code': 'Voir le code',
        Copy: 'Copier',
        'Copy prompt': 'Copier le prompt',
        'Copied!': 'Copié !',
        'Prompt copied!': 'Prompt copié !',
        'Copy failed': 'Échec de la copie',
        'Copy command': 'Copier la commande',
        New: 'Nouveau',
        Stable: 'Stable',
        'Connect to try {{feature}}': 'Connectez-vous pour essayer {{feature}}',
        'What you get': 'Ce que vous obtenez',
        '🚀 Start a new VeChain dApp': '🚀 Démarrer une nouvelle dApp VeChain',
        'Or: add VeChain Kit to an existing project':
            'Ou : ajouter VeChain Kit à un projet existant',
        'Install the package manually:': 'Installer le package manuellement :',
        'WalletButton variants': 'Variantes de WalletButton',
        'Open VeChain Kit modal': 'Ouvrir le modal VeChain Kit',
        'Social login providers': 'Fournisseurs de login social',
        'Account details': 'Détails du compte',
        'Connection source': 'Source de connexion',
        'Embedded Wallet': 'Wallet intégré',
        Deployed: 'Déployé',
        Yes: 'Oui',
        No: 'Non',
        'VET Domain': 'Domaine VET',
        Source: 'Source',
        Network: 'Réseau',
        'How smart accounts work': 'Comment fonctionnent les smart accounts',
        'Upgrade smart account': 'Mettre à jour le smart account',
        'Open upgrade modal': 'Ouvrir le modal de mise à jour',
        'Secure Ownership': 'Ownership sécurisée',
        Transferable: 'Transférable',
        Recovery: 'Récupération',
        'Send a test transaction': 'Envoyer une transaction de test',
        'Transaction status': 'Statut de la transaction',
        'Transaction ID': 'ID de transaction',
        'View on explorer': 'Voir sur l\'explorer',
        'Gas used': 'Gas utilisé',
        Error: 'Erreur',
        'Try again': 'Réessayer',
        'Personal sign': 'Signature personnelle',
        'Message signed!': 'Message signé !',
        'Signing failed': 'Échec de la signature',
        'EIP-712 typed data': 'Données typées EIP-712',
        'Sign typed data': 'Signer les données typées',
        'Typed data signed!': 'Données typées signées !',
        Signature: 'Signature',
        'Account balances': 'Soldes du compte',
        'Token prices': 'Prix des tokens',
        'Valid passport': 'Passport valide',
        'Modal catalog': 'Catalogue de modales',
        'Dark / light mode': 'Mode sombre / clair',
        'Switch to dark mode': 'Passer en mode sombre',
        'Switch to light mode': 'Passer en mode clair',
        'Current mode': 'Mode actuel',
        'Multi-language support': 'Support multilingue',
        Documentation: 'Documentation',
        'GitHub repository': 'Dépôt GitHub',
        'Request a feature': 'Demander une fonctionnalité',
        'Ship VeChain dApps with AI': 'Livrez des dApps VeChain avec l\'IA',
        'Any agent (Skills CLI)': 'N\'importe quel agent (Skills CLI)',
        'Available skills': 'Skills disponibles',
        'Try a prompt': 'Essayez un prompt',
        'View on GitHub': 'Voir sur GitHub',
        'Now the task:': 'Maintenant la tâche :',
        'Recommended skills': 'Skills recommandées',
    },

    de: {
        Overview: 'Übersicht',
        Build: 'Entwicklung',
        More: 'Mehr',
        'Getting Started': 'Loslegen',
        'Connect & Auth': 'Verbindung & Auth',
        Identity: 'Identität',
        'Smart Account': 'Smart Account',
        Transactions: 'Transaktionen',
        Signing: 'Signieren',
        'Reading Data': 'Daten lesen',
        Modals: 'Modale',
        'Theming & i18n': 'Theming & i18n',
        Resources: 'Ressourcen',
        'Open menu': 'Menü öffnen',
        'Toggle color mode': 'Farbschema wechseln',
        'Login or sign up': 'Anmelden oder registrieren',
        'The complete toolkit for VeChain dApps':
            'Das komplette Toolkit für VeChain dApps',
        'AI-friendly playground': 'AI-freundlicher Playground',
        'Connect wallet': 'Wallet verbinden',
        'Read the docs': 'Doku lesen',
        'Live demo': 'Live-Demo',
        'View code': 'Code anzeigen',
        Copy: 'Kopieren',
        'Copy prompt': 'Prompt kopieren',
        'Copied!': 'Kopiert!',
        'Prompt copied!': 'Prompt kopiert!',
        'Copy failed': 'Kopieren fehlgeschlagen',
        'Copy command': 'Befehl kopieren',
        New: 'Neu',
        Stable: 'Stabil',
        'Connect to try {{feature}}': 'Verbinden um {{feature}} zu testen',
        'What you get': 'Was du bekommst',
        '🚀 Start a new VeChain dApp': '🚀 Neue VeChain dApp starten',
        'Or: add VeChain Kit to an existing project':
            'Oder: VeChain Kit zu einem bestehenden Projekt hinzufügen',
        'Install the package manually:': 'Paket manuell installieren:',
        'WalletButton variants': 'WalletButton-Varianten',
        'Open VeChain Kit modal': 'VeChain Kit-Modal öffnen',
        'Social login providers': 'Social-Login-Anbieter',
        'Account details': 'Kontodetails',
        'Connection source': 'Verbindungsquelle',
        'Embedded Wallet': 'Eingebettetes Wallet',
        Deployed: 'Deployed',
        Yes: 'Ja',
        No: 'Nein',
        'VET Domain': 'VET-Domain',
        Source: 'Quelle',
        Network: 'Netzwerk',
        'How smart accounts work': 'Wie Smart Accounts funktionieren',
        'Upgrade smart account': 'Smart Account upgraden',
        'Open upgrade modal': 'Upgrade-Modal öffnen',
        'Secure Ownership': 'Sichere Ownership',
        Transferable: 'Übertragbar',
        Recovery: 'Recovery',
        'Send a test transaction': 'Test-Transaktion senden',
        'Transaction status': 'Transaktionsstatus',
        'Transaction ID': 'Transaktions-ID',
        'View on explorer': 'Im Explorer anzeigen',
        'Gas used': 'Gas verbraucht',
        Error: 'Fehler',
        'Try again': 'Erneut versuchen',
        'Personal sign': 'Persönliche Signatur',
        'Message signed!': 'Nachricht signiert!',
        'Signing failed': 'Signieren fehlgeschlagen',
        'EIP-712 typed data': 'EIP-712 typisierte Daten',
        'Sign typed data': 'Typisierte Daten signieren',
        'Typed data signed!': 'Typisierte Daten signiert!',
        Signature: 'Signatur',
        'Account balances': 'Kontostände',
        'Token prices': 'Token-Preise',
        'Valid passport': 'Gültiger Passport',
        'Modal catalog': 'Modal-Katalog',
        'Dark / light mode': 'Dunkel / hell',
        'Switch to dark mode': 'Zu dunklem Modus wechseln',
        'Switch to light mode': 'Zu hellem Modus wechseln',
        'Current mode': 'Aktueller Modus',
        'Multi-language support': 'Mehrsprachen-Support',
        Documentation: 'Dokumentation',
        'GitHub repository': 'GitHub-Repository',
        'Request a feature': 'Feature anfragen',
        'Ship VeChain dApps with AI': 'VeChain dApps mit KI ausliefern',
        'Any agent (Skills CLI)': 'Beliebiger Agent (Skills CLI)',
        'Available skills': 'Verfügbare Skills',
        'Try a prompt': 'Prompt ausprobieren',
        'View on GitHub': 'Auf GitHub ansehen',
        'Now the task:': 'Jetzt die Aufgabe:',
        'Recommended skills': 'Empfohlene Skills',
    },

    ja: {
        Overview: '概要',
        Build: '開発',
        More: 'その他',
        'Getting Started': 'はじめに',
        'Connect & Auth': '接続と認証',
        Identity: 'アイデンティティ',
        'Smart Account': 'スマートアカウント',
        Transactions: 'トランザクション',
        Signing: '署名',
        'Reading Data': 'データ読み取り',
        Modals: 'モーダル',
        'Theming & i18n': 'テーマと i18n',
        Resources: 'リソース',
        'Open menu': 'メニューを開く',
        'Toggle color mode': 'カラーモードを切り替え',
        'Login or sign up': 'ログインまたは登録',
        'The complete toolkit for VeChain dApps':
            'VeChain dApp のための完全なツールキット',
        'AI-friendly playground': 'AI フレンドリーなプレイグラウンド',
        'Connect wallet': 'ウォレットを接続',
        'Read the docs': 'ドキュメントを読む',
        'Live demo': 'ライブデモ',
        'View code': 'コードを表示',
        Copy: 'コピー',
        'Copy prompt': 'プロンプトをコピー',
        'Copied!': 'コピーしました！',
        'Prompt copied!': 'プロンプトをコピーしました！',
        'Copy failed': 'コピー失敗',
        'Copy command': 'コマンドをコピー',
        New: '新着',
        Stable: '安定版',
        'Connect to try {{feature}}': '接続して {{feature}} を試す',
        'What you get': '何が得られるか',
        '🚀 Start a new VeChain dApp': '🚀 新しい VeChain dApp を始める',
        'Or: add VeChain Kit to an existing project':
            'または: 既存のプロジェクトに VeChain Kit を追加',
        'Install the package manually:': 'パッケージを手動でインストール:',
        'WalletButton variants': 'WalletButton のバリエーション',
        'Open VeChain Kit modal': 'VeChain Kit モーダルを開く',
        'Social login providers': 'ソーシャルログインプロバイダー',
        'Account details': 'アカウント詳細',
        'Connection source': '接続ソース',
        'Embedded Wallet': '組み込みウォレット',
        Deployed: 'デプロイ済み',
        Yes: 'はい',
        No: 'いいえ',
        'VET Domain': 'VET ドメイン',
        Source: 'ソース',
        Network: 'ネットワーク',
        'How smart accounts work': 'スマートアカウントの仕組み',
        'Upgrade smart account': 'スマートアカウントをアップグレード',
        'Open upgrade modal': 'アップグレードモーダルを開く',
        'Secure Ownership': '安全な所有権',
        Transferable: '転送可能',
        Recovery: 'リカバリー',
        'Send a test transaction': 'テストトランザクションを送信',
        'Transaction status': 'トランザクションステータス',
        'Transaction ID': 'トランザクション ID',
        'View on explorer': 'エクスプローラーで表示',
        'Gas used': '使用ガス',
        Error: 'エラー',
        'Try again': '再試行',
        'Personal sign': 'パーソナル署名',
        'Message signed!': 'メッセージを署名しました！',
        'Signing failed': '署名失敗',
        'EIP-712 typed data': 'EIP-712 型付きデータ',
        'Sign typed data': '型付きデータを署名',
        'Typed data signed!': '型付きデータを署名しました！',
        Signature: '署名',
        'Account balances': 'アカウント残高',
        'Token prices': 'トークン価格',
        'Valid passport': '有効なパスポート',
        'Modal catalog': 'モーダルカタログ',
        'Dark / light mode': 'ダーク / ライトモード',
        'Switch to dark mode': 'ダークモードに切り替え',
        'Switch to light mode': 'ライトモードに切り替え',
        'Current mode': '現在のモード',
        'Multi-language support': '多言語サポート',
        Documentation: 'ドキュメント',
        'GitHub repository': 'GitHub リポジトリ',
        'Request a feature': '機能をリクエスト',
        'Ship VeChain dApps with AI': 'AI で VeChain dApp をリリース',
        'Any agent (Skills CLI)': '任意のエージェント (Skills CLI)',
        'Available skills': '利用可能なスキル',
        'Try a prompt': 'プロンプトを試す',
        'View on GitHub': 'GitHub で表示',
        'Now the task:': 'タスク:',
        'Recommended skills': '推奨スキル',
    },

    zh: {
        Overview: '概览',
        Build: '开发',
        More: '更多',
        'Getting Started': '开始',
        'Connect & Auth': '连接与认证',
        Identity: '身份',
        'Smart Account': '智能账户',
        Transactions: '交易',
        Signing: '签名',
        'Reading Data': '读取数据',
        Modals: '弹窗',
        'Theming & i18n': '主题与 i18n',
        Resources: '资源',
        'Open menu': '打开菜单',
        'Toggle color mode': '切换颜色模式',
        'Login or sign up': '登录或注册',
        'The complete toolkit for VeChain dApps':
            '为 VeChain dApp 打造的完整工具包',
        'AI-friendly playground': 'AI 友好的 Playground',
        'Connect wallet': '连接钱包',
        'Read the docs': '阅读文档',
        'Live demo': '实时演示',
        'View code': '查看代码',
        Copy: '复制',
        'Copy prompt': '复制提示',
        'Copied!': '已复制！',
        'Prompt copied!': '提示已复制！',
        'Copy failed': '复制失败',
        'Copy command': '复制命令',
        New: '新',
        Stable: '稳定',
        'Connect to try {{feature}}': '连接以试用 {{feature}}',
        'What you get': '你能得到什么',
        '🚀 Start a new VeChain dApp': '🚀 创建一个新的 VeChain dApp',
        'Or: add VeChain Kit to an existing project':
            '或：将 VeChain Kit 添加到现有项目',
        'Install the package manually:': '手动安装包：',
        'WalletButton variants': 'WalletButton 变体',
        'Open VeChain Kit modal': '打开 VeChain Kit 弹窗',
        'Social login providers': '社交登录提供商',
        'Account details': '账户详情',
        'Connection source': '连接来源',
        'Embedded Wallet': '嵌入式钱包',
        Deployed: '已部署',
        Yes: '是',
        No: '否',
        'VET Domain': 'VET 域名',
        Source: '来源',
        Network: '网络',
        'How smart accounts work': '智能账户如何运作',
        'Upgrade smart account': '升级智能账户',
        'Open upgrade modal': '打开升级弹窗',
        'Secure Ownership': '安全所有权',
        Transferable: '可转移',
        Recovery: '恢复',
        'Send a test transaction': '发送测试交易',
        'Transaction status': '交易状态',
        'Transaction ID': '交易 ID',
        'View on explorer': '在浏览器查看',
        'Gas used': '使用的 Gas',
        Error: '错误',
        'Try again': '重试',
        'Personal sign': '个人签名',
        'Message signed!': '消息已签名！',
        'Signing failed': '签名失败',
        'EIP-712 typed data': 'EIP-712 类型化数据',
        'Sign typed data': '签名类型化数据',
        'Typed data signed!': '类型化数据已签名！',
        Signature: '签名',
        'Account balances': '账户余额',
        'Token prices': '代币价格',
        'Valid passport': '有效护照',
        'Modal catalog': '弹窗目录',
        'Dark / light mode': '深色 / 浅色模式',
        'Switch to dark mode': '切换到深色模式',
        'Switch to light mode': '切换到浅色模式',
        'Current mode': '当前模式',
        'Multi-language support': '多语言支持',
        Documentation: '文档',
        'GitHub repository': 'GitHub 仓库',
        'Request a feature': '请求功能',
        'Ship VeChain dApps with AI': '用 AI 发布 VeChain dApp',
        'Any agent (Skills CLI)': '任意代理 (Skills CLI)',
        'Available skills': '可用技能',
        'Try a prompt': '尝试一个提示',
        'View on GitHub': '在 GitHub 上查看',
        'Now the task:': '现在的任务：',
        'Recommended skills': '推荐技能',
    },
};

const langs = ['it', 'es', 'fr', 'de', 'ja', 'zh'];
let totalApplied = 0;

for (const lang of langs) {
    const filePath = path.join(LANG_DIR, `${lang}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const map = TRANSLATIONS[lang] || {};

    let applied = 0;
    for (const [key, translation] of Object.entries(map)) {
        if (KEEP_ENGLISH.has(key)) continue;
        if (!(key in data)) continue;
        if (data[key] === key) {
            // still English-fallback — replace with translation
            data[key] = translation;
            applied++;
        }
    }

    const sorted = Object.fromEntries(
        Object.keys(data)
            .sort()
            .map((k) => [k, data[k]]),
    );
    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n');
    console.log(`${lang}.json: applied ${applied} translations`);
    totalApplied += applied;
}

console.log(`\nDone. Total translations applied: ${totalApplied}`);
console.log(
    'Long AI prompts intentionally left in English (meant to be pasted into AI agents).',
);
