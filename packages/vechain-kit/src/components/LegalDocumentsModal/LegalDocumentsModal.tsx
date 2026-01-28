'use client';

import type { EnrichedLegalDocument } from '../../types';
import { Step, StepModal } from '../StepModal/StepModal';
import { useSteps } from '@chakra-ui/react';
import { DisconnectConfirmContent } from '../AccountModal/Contents/DisconnectConfirmation/DisconnectConfirmContent';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LegalDocumentsContent } from './LegalDocumentsContent';

type Props = {
    isOpen: boolean;
    onAgree: (
        documents: EnrichedLegalDocument | EnrichedLegalDocument[],
    ) => void;
    handleLogout: () => void;
    onlyOptionalDocuments?: boolean;
};

export type LegalDocumentsModalContentsTypes = 'legal-documents';

enum LegalDocumentsSteps {
    REVIEW_DOCUMENTS = 'REVIEW_DOCUMENTS',
    REJECT_DOCUMENTS = 'REJECT_DOCUMENTS',
}
export const LegalDocumentsModal = ({
    isOpen,
    onAgree,
    handleLogout,
    onlyOptionalDocuments,
}: Props) => {
    const { t } = useTranslation();
    const { activeStep, goToPrevious, setActiveStep, goToNext } = useSteps({
        index: 0,
        count: Object.keys(LegalDocumentsSteps).length,
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

    const steps = useMemo<Step<LegalDocumentsSteps>[]>(
        () => [
            {
                key: LegalDocumentsSteps.REVIEW_DOCUMENTS,
                content: (
                    <LegalDocumentsContent
                        onAgree={onAgree}
                        onReject={goToLogoutScreen}
                        onlyOptionalDocuments={onlyOptionalDocuments}
                    />
                ),
            },
            {
                key: LegalDocumentsSteps.REJECT_DOCUMENTS,
                content: (
                    <DisconnectConfirmContent
                        onDisconnect={logout}
                        onBack={goToPrevious}
                        onClose={goToPrevious}
                        text={t(
                            'Are you sure you want to reject the policies and disconnect?',
                        )}
                        showCloseButton={false}
                    />
                ),
            },
        ],
        [LegalDocumentsContent, DisconnectConfirmContent, onAgree, logout],
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
