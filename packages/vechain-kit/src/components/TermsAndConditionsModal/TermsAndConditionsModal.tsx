import {
    Button,
    Icon,
    Link,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
} from '@chakra-ui/react';
import { BaseModal } from '@/components/common';
import { useTermsAndConditions } from '@/hooks/utils/useTermsAndConditions';
import { IoOpenOutline } from 'react-icons/io5';
import { useVeChainKitConfig } from '@/providers';
import { useTranslation } from 'react-i18next';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onAgree: () => void;
};

export const TermsAndConditionsModal = ({
    isOpen,
    onClose,
    onAgree,
}: Props) => {
    const { termsUrl } = useTermsAndConditions();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { t } = useTranslation();

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
        >
            <ModalHeader>{t('Terms and Conditions')}</ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <ModalBody>
                <Text mb={4}>
                    {t(
                        'To proceed, you must agree to our Terms and Conditions.',
                    )}
                </Text>
                <Text>{t('Please review our terms at:')}</Text>{' '}
                <Link
                    href={termsUrl}
                    isExternal
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                    fontSize={'14px'}
                    textDecoration={'underline'}
                >
                    {termsUrl}
                    <Icon ml={1} as={IoOpenOutline} />
                </Link>
            </ModalBody>
            <ModalFooter w="full" display="flex" gap={2}>
                <Button variant="vechainKitSecondary" onClick={onClose}>
                    {t('Disagree')}
                </Button>
                <Button variant="vechainKitPrimary" onClick={onAgree}>
                    {t('Agree')}
                </Button>
            </ModalFooter>
        </BaseModal>
    );
};
