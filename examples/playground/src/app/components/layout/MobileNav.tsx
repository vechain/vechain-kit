'use client';

import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const { t } = useTranslation();

    return (
        <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            size="xs"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{t('Menu')}</DrawerHeader>
                <DrawerBody p={0}>
                    <Sidebar onItemClick={onClose} />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
