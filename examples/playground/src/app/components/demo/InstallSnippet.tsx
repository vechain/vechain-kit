'use client';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { CodeBlock } from './CodeBlock';

const COMMANDS: Array<{ name: string; cmd: string }> = [
    { name: 'yarn', cmd: 'yarn add @vechain/vechain-kit' },
    { name: 'npm', cmd: 'npm install @vechain/vechain-kit' },
    { name: 'pnpm', cmd: 'pnpm add @vechain/vechain-kit' },
];

export function InstallSnippet() {
    return (
        <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
            <TabList>
                {COMMANDS.map((c) => (
                    <Tab key={c.name}>{c.name}</Tab>
                ))}
            </TabList>
            <TabPanels>
                {COMMANDS.map((c) => (
                    <TabPanel key={c.name} px={0} pt={3}>
                        <CodeBlock code={c.cmd} language="bash" label={c.name} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    );
}
