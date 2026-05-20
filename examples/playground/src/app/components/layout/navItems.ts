import {
    LuRocket,
    LuLogIn,
    LuIdCard,
    LuShield,
    LuArrowLeftRight,
    LuPenLine,
    LuDatabase,
    LuLayoutGrid,
    LuPalette,
    LuBookOpen,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import type { Status } from '../demo/StatusBadge';

export interface NavGroup {
    label: string;
    items: NavItemConfig[];
}

export interface NavItemConfig {
    href: string;
    icon: IconType;
    label: string;
    descriptionKey?: string;
    status?: Status;
}

export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Overview',
        items: [
            {
                href: '/getting-started',
                icon: LuRocket,
                label: 'Getting Started',
            },
        ],
    },
    {
        label: 'Build',
        items: [
            {
                href: '/connect',
                icon: LuLogIn,
                label: 'Connect & Auth',
            },
            {
                href: '/identity',
                icon: LuIdCard,
                label: 'Identity',
            },
            {
                href: '/smart-account',
                icon: LuShield,
                label: 'Smart Account',
            },
            {
                href: '/transactions',
                icon: LuArrowLeftRight,
                label: 'Transactions',
            },
            {
                href: '/signing',
                icon: LuPenLine,
                label: 'Signing',
            },
            {
                href: '/data',
                icon: LuDatabase,
                label: 'Reading Data',
            },
        ],
    },
    {
        label: 'UI',
        items: [
            {
                href: '/modals',
                icon: LuLayoutGrid,
                label: 'Modals',
            },
            {
                href: '/theming',
                icon: LuPalette,
                label: 'Theming & i18n',
            },
        ],
    },
    {
        label: 'More',
        items: [
            {
                href: '/resources',
                icon: LuBookOpen,
                label: 'Resources',
            },
        ],
    },
];
