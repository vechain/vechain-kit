'use client';

import { VStack } from '@chakra-ui/react';
import { AISkillsSection } from '../../components/features/AISkills/AISkillsSection';

export default function AISkillsPage() {
    return (
        <VStack align="stretch" spacing={6}>
            <AISkillsSection />
        </VStack>
    );
}
