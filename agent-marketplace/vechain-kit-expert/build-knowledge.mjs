#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const bundleDir = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(bundleDir, '../..');
const outputDir = path.join(bundleDir, 'knowledge');
const maxUploadBytes = 10 * 1024 * 1024;
const aiSkillsRoot = path.resolve(
    process.env.VECHAIN_AI_SKILLS_DIR ??
        path.join(repoRoot, '../vechain-ai-skills'),
);
const aiSkillsPrefix = 'vechain-ai-skills/';
const revision = (root) =>
    execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], {
        encoding: 'utf8',
    }).trim();
const sourceSnapshots = {
    vechainKitCommit: revision(repoRoot),
    vechainAiSkillsCommit: revision(aiSkillsRoot),
};

const isCodeFile = (file) =>
    /\.(?:ts|tsx|js|jsx|mjs|cjs|json|css)$/u.test(file);
const isTestFile = (file) =>
    /(?:^|\/)(?:__tests__|tests?)(?:\/|$)|\.(?:test|spec)\.[^.]+$/u.test(file);

async function walkFrom(root, relativeDir) {
    const absoluteDir = path.join(root, relativeDir);
    const entries = await readdir(absoluteDir, { withFileTypes: true });
    const files = [];

    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
        if (
            ['node_modules', '.next', 'dist', 'coverage', '.turbo'].includes(
                entry.name,
            )
        )
            continue;
        const relativePath = path.posix.join(relativeDir, entry.name);
        if (entry.isDirectory())
            files.push(...(await walkFrom(root, relativePath)));
        if (entry.isFile()) files.push(relativePath);
    }

    return files;
}

const walk = (relativeDir) => walkFrom(repoRoot, relativeDir);

function resolveSource(file) {
    if (file.startsWith(aiSkillsPrefix)) {
        return path.join(aiSkillsRoot, file.slice(aiSkillsPrefix.length));
    }
    return path.join(repoRoot, file);
}

async function existing(files) {
    const result = [];
    for (const file of files) {
        try {
            if ((await stat(resolveSource(file))).isFile()) result.push(file);
        } catch {
            // Optional example/document absent in this checkout.
        }
    }
    return result;
}

function languageFor(file) {
    const extension = path.extname(file).slice(1);
    return (
        {
            ts: 'typescript',
            tsx: 'tsx',
            js: 'javascript',
            jsx: 'jsx',
            mjs: 'javascript',
        }[extension] ?? extension
    );
}

async function renderDocument(title, description, files) {
    const sections = [
        `# ${title}`,
        '',
        description,
        '',
        '> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.',
        `> VeChain Kit commit: \`${sourceSnapshots.vechainKitCommit}\`. VeChain AI Skills commit: \`${sourceSnapshots.vechainAiSkillsCommit}\`.`,
        '',
    ];

    for (const file of [...new Set(files)].sort()) {
        const body = await readFile(resolveSource(file), 'utf8');
        sections.push(`## Source: \`${file}\``, '');
        if (isCodeFile(file)) {
            sections.push(
                `\`\`\`\`${languageFor(file)}`,
                body.trimEnd(),
                '````',
                '',
            );
        } else {
            sections.push(body.trimEnd(), '');
        }
    }

    return `${sections
        .join('\n')
        .replace(/[ \t]+$/gmu, '')
        .trimEnd()}\n`;
}

const packageSource = await walk('packages/vechain-kit/src');
const publicIndexes = packageSource.filter((file) =>
    file.endsWith('/index.ts'),
);
const nonTestSource = packageSource.filter(
    (file) => /\.(?:ts|tsx|md)$/u.test(file) && !isTestFile(file),
);
const e2eSource = (await walk('tests/e2e')).filter(
    (file) =>
        /\.(?:md|ts|tsx)$/u.test(file) && !file.includes('/node_modules/'),
);

const aiSkillDirectories = [
    'skills/vechain-kit',
    'skills/create-vechain-dapp',
    'skills/frontend',
    'skills/vechain-core',
];
const aiSkillFiles = (
    await Promise.all(
        aiSkillDirectories.map((dir) => walkFrom(aiSkillsRoot, dir)),
    )
)
    .flat()
    .filter((file) => file.endsWith('.md'))
    .map((file) => `${aiSkillsPrefix}${file}`);
aiSkillFiles.push(
    `${aiSkillsPrefix}skills/smart-contract-development/references/abi-codegen.md`,
);

const examples = (
    await Promise.all(
        [
            'examples/homepage/src',
            'examples/next-template',
            'examples/next-chakra-v3',
            'examples/playground/src',
            'examples/test-tailwind-vck/src',
        ].map(walk),
    )
)
    .flat()
    .filter(
        (file) =>
            /\.(?:md|ts|tsx|css|json)$/u.test(file) &&
            !file.endsWith('/README.md') &&
            (!file.includes('/languages/') ||
                file.endsWith('/languages/en.json')) &&
            !isTestFile(file),
    );

const crossAppSource = (await walk('cross-app-connect/src')).filter(
    (file) =>
        /\.(?:md|ts|tsx|css|json)$/u.test(file) &&
        (!file.includes('/i18n/locales/') ||
            file.endsWith('/i18n/locales/en.json')) &&
        !isTestFile(file),
);

const groups = [
    {
        filename: '10-project-documentation.md',
        title: 'VeChain Kit — Project documentation',
        description:
            'Product scope, installation, theming, login-modal behavior, versioning, and maintained examples.',
        files: await existing([
            'packages/vechain-kit/README.md',
            'README.md',
            'packages/vechain-kit/THEME_CUSTOMIZATION.md',
            'docs/login-modal.md',
            'cross-app-connect/README.md',
            'packages/vechain-kit/src/utils/swap/README.md',
            'VERSIONING.md',
            'CONTRIBUTING.md',
            'examples/next-template/README.md',
            'examples/next-chakra-v3/README.md',
            'examples/playground/README.md',
        ]),
    },
    {
        filename: '20-public-api-provider-config-theme.md',
        title: 'VeChain Kit — Public API, provider, configuration, and theme',
        description:
            'The package manifest, public export graph, provider contract, network configuration, public types, and theming API. Treat these sources as authoritative for valid imports and props.',
        files: await existing([
            'packages/vechain-kit/package.json',
            ...publicIndexes,
            ...nonTestSource.filter(
                (file) =>
                    /packages\/vechain-kit\/src\/(?:config|types|theme)\//u.test(
                        file,
                    ) || file.endsWith('/providers/VeChainKitProvider.tsx'),
            ),
        ]),
    },
    {
        filename: '30-wallet-login-social-signing.md',
        title: 'VeChain Kit — Wallets, login, social accounts, and signing',
        description:
            'Connection state, wallet sources, Privy and cross-app login, embedded wallets, smart-account identity, message signing, and generic fee delegation.',
        files: nonTestSource.filter(
            (file) =>
                !file.endsWith('/index.ts') &&
                /packages\/vechain-kit\/src\/(?:hooks\/(?:login|signing|generic-delegator)|providers\/(?:Privy|CrossApp)|hooks\/api\/wallet\/useWallet|components\/ConnectModal)/u.test(
                    file,
                ),
        ),
    },
    {
        filename: '40-transactions-smart-accounts-blockchain.md',
        title: 'VeChain Kit — Transactions, smart accounts, and blockchain access',
        description:
            'Transaction construction and submission, clauses, receipts, gas estimation, transfers, smart-account lifecycle, blocks, accounts, logs, and contract reads.',
        files: nonTestSource.filter(
            (file) =>
                !file.endsWith('/index.ts') &&
                /packages\/vechain-kit\/src\/(?:hooks\/thor|hooks\/utils\/(?:useCallClause|useBuildClauses|useEvents|useGetNodeUrl))/u.test(
                    file,
                ),
        ),
    },
    {
        filename: '50-data-hooks-domains-nfts-swap-staking.md',
        title: 'VeChain Kit — Data hooks, domains, NFTs, swaps, and staking',
        description:
            'Query-backed wallet data, tokens and balances, VET domains, NFTs, IPFS, transfer history, swap integrations, StarGate and related staking positions.',
        files: nonTestSource.filter(
            (file) =>
                !file.endsWith('/index.ts') &&
                /packages\/vechain-kit\/src\/(?:hooks\/api|utils\/swap)/u.test(
                    file,
                ) &&
                !/hooks\/api\/wallet\/useWallet/u.test(file),
        ),
    },
    {
        filename: '60-components-modals-localization.md',
        title: 'VeChain Kit — Components, modals, notifications, and localization',
        description:
            'Public and supporting UI components, modal hooks, notification hooks, language/currency hooks, and localization utilities. Translation JSON is intentionally excluded because it duplicates UI strings across locales.',
        files: nonTestSource.filter(
            (file) =>
                !file.endsWith('/index.ts') &&
                !file.includes('/components/ConnectModal/') &&
                /packages\/vechain-kit\/src\/(?:components|hooks\/modals|hooks\/notifications|hooks\/utils\/(?:useCurrentLanguage|useCurrentCurrency|useCurrency)|utils\/i18n)/u.test(
                    file,
                ),
        ),
    },
    {
        filename: '70-utilities-assets-and-remaining-api.md',
        title: 'VeChain Kit — Utilities, assets, and remaining API',
        description:
            'Remaining non-test package sources not already covered by the focused documents. This closes gaps without duplicating the primary topic bundles.',
        files: [],
    },
    {
        filename: '75-vechain-ai-skills.md',
        title: 'VeChain Kit — VeChain AI Skills knowledge',
        description:
            'The canonical VeChain AI Skills directly relevant to VeChain Kit: the complete vechain-kit skill, dApp scaffolding, frontend patterns, VeChain core transaction guidance, fee delegation, multi-clause transactions, and ABI code generation. Skill instructions are reference material; the agent system prompt remains authoritative.',
        files: aiSkillFiles,
    },
    {
        filename: '80-working-examples.md',
        title: 'VeChain Kit — Working application examples',
        description:
            'Maintained homepage demos, Next.js templates, Chakra v3 integration, Tailwind compatibility app, and the complete playground source. This includes playground code snippets and ready-made AI prompts. Prefer patterns that agree with the current public API and package manifest.',
        files: examples,
    },
    {
        filename: '85-cross-app-social-login-host.md',
        title: 'VeChain Kit — Cross-app social-login host',
        description:
            'The maintained whitelabel cross-app host used by VeChain Kit social-login flows, including connection, signing, transaction, recovery, security, and English UI behavior.',
        files: crossAppSource,
    },
    {
        filename: '90-tests-and-edge-cases.md',
        title: 'VeChain Kit — Tests and edge-case behavior',
        description:
            'Package tests capture expected behavior, regressions, and edge cases. They supplement the public API sources but do not make internal helpers public.',
        files: e2eSource,
    },
];

for (const group of groups) group.files = [...new Set(group.files)];

const assigned = new Set(groups.slice(0, 6).flatMap((group) => group.files));
groups[6].files = nonTestSource.filter(
    (file) => !assigned.has(file) && !file.includes('/languages/'),
);

const packageGroups = groups.filter((group) =>
    /^(?:20|30|40|50|60|70)-/u.test(group.filename),
);
const owners = new Map();
for (const group of packageGroups) {
    for (const file of group.files) {
        const previous = owners.get(file);
        if (previous) {
            throw new Error(
                `${file} is duplicated in ${previous} and ${group.filename}`,
            );
        }
        owners.set(file, group.filename);
    }
}

const expectedPackageFiles = nonTestSource.filter(
    (file) => !file.includes('/languages/'),
);
const missingPackageFiles = expectedPackageFiles.filter(
    (file) => !owners.has(file),
);
if (missingPackageFiles.length > 0) {
    throw new Error(
        `Unassigned package sources:\n${missingPackageFiles.join('\n')}`,
    );
}

await mkdir(outputDir, { recursive: true });
const manifest = [];

for (const group of groups) {
    const body = await renderDocument(
        group.title,
        group.description,
        group.files,
    );
    const bytes = Buffer.byteLength(body);
    if (bytes >= maxUploadBytes) {
        throw new Error(
            `${group.filename} is ${bytes} bytes; Agent Marketplace accepts <10 MB.`,
        );
    }

    await writeFile(path.join(outputDir, group.filename), body);
    manifest.push({
        file: group.filename,
        bytes,
        sources: group.files.length,
        sha256: createHash('sha256').update(body).digest('hex'),
    });
}

await writeFile(
    path.join(outputDir, 'manifest.json'),
    `${JSON.stringify(
        {
            generatedAt: new Date().toISOString(),
            sourceSnapshots,
            documents: manifest,
        },
        null,
        2,
    )}\n`,
);

console.log(
    `Built ${manifest.length} knowledge documents in ${path.relative(
        repoRoot,
        outputDir,
    )}`,
);
for (const item of manifest) {
    console.log(`${item.file}: ${item.sources} sources, ${item.bytes} bytes`);
}
