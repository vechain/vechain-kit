'use client';

import { TermsAndConditionsContent } from './TermsAndConditionsContent';
import { TermsAndConditions } from '@/types';
import { Step, StepModal } from '../StepModal/StepModal';
import { useSteps } from '@chakra-ui/react';
import { DisconnectConfirmContent } from '../AccountModal/Contents/Account/DisconnectConfirmContent';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    isOpen: boolean;
    onAgree: (terms: TermsAndConditions | TermsAndConditions[]) => void;
    handleLogout: () => void;
};

export type TermsAndConditionsModalContentsTypes = 'terms-and-conditions';

enum TermsAndConditionsSteps {
    REVIEW_TERMS = 'REVIEW_TERMS',
    REJECT_TERMS = 'REJECT_TERMS',
}
export const TermsAndConditionsModal = ({
    isOpen,
    onAgree,
    handleLogout,
}: Props) => {
    const { t } = useTranslation();
    const { activeStep, goToPrevious, setActiveStep, goToNext } = useSteps({
        index: 0,
        count: Object.keys(TermsAndConditionsSteps).length,
    });

    const goToFirstStep = () => {
        setActiveStep(0);
    };

    const goToLogoutScreen = () => {
        goToNext();
    };

    const logout = () => {
        handleLogout();
        goToFirstStep();
    };

    const steps = useMemo<Step<TermsAndConditionsSteps>[]>(
        () => [
            {
                key: TermsAndConditionsSteps.REVIEW_TERMS,
                content: (
                    <TermsAndConditionsContent
                        onAgree={onAgree}
                        onReject={goToLogoutScreen}
                    />
                ),
            },
            {
                key: TermsAndConditionsSteps.REJECT_TERMS,
                content: (
                    <DisconnectConfirmContent
                        onDisconnect={logout}
                        onBack={goToPrevious}
                        onClose={goToPrevious}
                        text={t(
                            'Are you sure you want to reject the terms and disconnect?',
                        )}
                        showCloseButton={false}
                    />
                ),
            },
        ],
        [TermsAndConditionsContent, DisconnectConfirmContent],
    );

    return (
        <StepModal
            isOpen={isOpen}
            onClose={() => {}}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
            setActiveStep={setActiveStep}
            steps={steps}
            disableCloseButton={true}
            disableBackButton={true}
            isCloseable={false}
            closeOnOverlayClick={false}
            activeStep={activeStep}
        />
    );
};
