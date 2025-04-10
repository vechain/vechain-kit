import {
    Button,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
} from '@chakra-ui/react';
import { BaseModal } from '@/components/common';
import { useTermsAndConditions } from '@/hooks/utils/useTermsAndConditions';
import { useWallet } from '@/hooks';
import { useCallback } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const TermsAndConditionsModal = ({ isOpen, onClose }: Props) => {
    const { disconnect } = useWallet();
    const { agreeToTerms, termsUrl } = useTermsAndConditions();

    const handleAgree = useCallback(() => {
        agreeToTerms();
        onClose();
    }, [agreeToTerms, onClose]);

    const handleDisagree = useCallback(() => {
        onClose();
        disconnect();
    }, [disconnect, onClose]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
        >
            <ModalHeader>Terms and Conditions</ModalHeader>
            <ModalCloseButton onClick={handleDisagree} />
            <ModalBody>
                <Text mb={4}>
                    To proceed, you must agree to our Terms and Conditions.
                </Text>
                <Text>
                    Please review our terms at:{' '}
                    <a
                        href={termsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {termsUrl}
                    </a>
                </Text>
            </ModalBody>
            <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleDisagree}>
                    Disagree
                </Button>
                <Button colorScheme="blue" onClick={handleAgree}>
                    Agree
                </Button>
            </ModalFooter>
        </BaseModal>
    );
};
