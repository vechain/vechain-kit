'use client';

import {
    Button,
    Heading,
    HStack,
    Icon,
    Select,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useAccountModal } from '@vechain/vechain-kit';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../../i18n';
import { DemoSection } from '../../components/demo/DemoSection';

const THEME_SNIPPET = `import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { darkTheme } from './theme';

// 1. Wrap the app
<ChakraProvider theme={darkTheme}>{children}</ChakraProvider>

// 2. Toggle anywhere
const { colorMode, toggleColorMode } = useColorMode();
<Button onClick={toggleColorMode}>
    {colorMode === 'light' ? 'Dark' : 'Light'} mode
</Button>
`;

const I18N_SNIPPET = `import { useTranslation } from 'react-i18next';

function Greeting() {
    const { t, i18n } = useTranslation();
    return (
        <>
            <p>{t('Welcome')}</p>
            <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
                <option value="en">English</option>
                <option value="it">Italiano</option>
                <option value="ja">日本語</option>
            </select>
        </>
    );
}
`;

function ThemeDemo() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { t } = useTranslation();
    return (
        <HStack spacing={3}>
            <Button
                leftIcon={<Icon as={colorMode === 'light' ? LuMoon : LuSun} />}
                onClick={toggleColorMode}
            >
                {colorMode === 'light'
                    ? t('Switch to dark mode')
                    : t('Switch to light mode')}
            </Button>
            <Text fontSize="sm" opacity={0.7}>
                {t('Current mode')}: <strong>{colorMode}</strong>
            </Text>
        </HStack>
    );
}

function I18nDemo() {
    const { t, i18n } = useTranslation();
    const { open: openAccountModal } = useAccountModal();

    return (
        <VStack align="stretch" spacing={3}>
            <Text fontSize="sm">{t('Demo text to be translated')}</Text>
            <HStack spacing={2}>
                <Select
                    size="sm"
                    width="auto"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    {supportedLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                            {languageNames[
                                lang as keyof typeof languageNames
                            ] ?? lang}
                        </option>
                    ))}
                </Select>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAccountModal()}
                >
                    {t('Check language in account modal')}
                </Button>
            </HStack>
        </VStack>
    );
}

export default function ThemingPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Theming & i18n')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Light/dark mode + multi-language support, fully integrated with Chakra and react-i18next.',
                    )}
                </Text>
            </VStack>

            <DemoSection
                title={t('Dark / light mode')}
                description={t(
                    'Powered by Chakra `useColorMode`. The whole kit (including modals) follows the active mode.',
                )}
                hooks={['useColorMode']}
                code={THEME_SNIPPET}
                aiPrompt={t(
                    'Add a dark/light mode toggle to my Next.js + Chakra UI v3 app using next-themes. Persist the choice in localStorage and respect prefers-color-scheme on first visit. Show a sun/moon icon button in the header.',
                )}
                aiSkills={['vechain-kit']}
            >
                <ThemeDemo />
            </DemoSection>

            <DemoSection
                title={t('Multi-language support')}
                description={t(
                    'react-i18next ships with the kit. Add your keys, pick the languages you support, and translate.',
                )}
                hooks={['useTranslation']}
                code={I18N_SNIPPET}
                aiPrompt={t(
                    'Set up react-i18next in my Next.js app with English, Italian and Japanese. Create JSON files under src/app/languages/, detect the browser language with a localStorage fallback, and add a flag-based dropdown in the header to switch.',
                )}
                aiSkills={['vechain-kit', 'translate']}
            >
                <I18nDemo />
            </DemoSection>
        </VStack>
    );
}
