import {
    Grid,
    Icon,
    IconButton,
    VStack,
    Text,
    Heading,
    HStack,
    Box,
} from '@chakra-ui/react';
import { MdSwapHoriz } from 'react-icons/md';
import { AccountModalContentTypes } from '../Types';
import { useUpgradeRequired, useWallet, useTotalBalance } from '@/hooks';
import { useTranslation } from 'react-i18next';
import {
    LuArrowDownToLine,
    LuArrowLeftRight,
    LuArrowUpFromLine,
} from 'react-icons/lu';
import { Analytics } from '@/utils/mixpanelClientInstance';

type Props = {
    mt?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type QuickAction = {
    icon: React.ElementType;
    label: string;
    onClick: (setCurrentContent: Props['setCurrentContent']) => void;
    isDisabled?: (hasAnyBalance: boolean) => boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
    {
        icon: LuArrowUpFromLine,
        label: 'Send',
        onClick: (setCurrentContent) =>
            setCurrentContent({
                type: 'send-token',
                props: {
                    setCurrentContent,
                    isNavigatingFromMain: true,
                },
            }),
        isDisabled: (hasAnyBalance) => !hasAnyBalance,
    },
    {
        icon: LuArrowLeftRight,
        label: 'Swap',
        onClick: (setCurrentContent) => {
            Analytics.swap.opened();
            setCurrentContent('swap-token');
        },
    },
    {
        icon: LuArrowDownToLine,
        label: 'Receive',
        onClick: (setCurrentContent) => {
            Analytics.wallet.trackWallet('receive_qr_generated');
            setCurrentContent('receive-token');
        },
    },
];

const QuickActionButton = ({
    icon,
    label,
    onClick,
    isDisabled,
    showRedDot,
}: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
    showRedDot?: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <IconButton
            variant="mainContentButton"
            h="80px"
            w="full"
            aria-label={label}
            isDisabled={isDisabled}
            icon={
                <VStack spacing={4}>
                    <Icon as={icon} boxSize={5} opacity={0.9} />

                    <HStack p={0} alignItems={'baseline'} spacing={1}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            data-testid={`${label.toLowerCase()}-button-label`}
                        >
                            {t(label, label)}
                        </Text>
                        {showRedDot && (
                            <Box
                                minWidth="8px"
                                height="8px"
                                bg="red.500"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            />
                        )}
                    </HStack>
                </VStack>
            }
            onClick={onClick}
        />
    );
};

export const QuickActionsSection = ({ mt, setCurrentContent }: Props) => {
    const { account, smartAccount, connectedWallet, connection } = useWallet();
    const { hasAnyBalance } = useTotalBalance({
        address: account?.address ?? '',
    });
    const { t } = useTranslation();

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    const showRedDot = connection.isConnectedWithPrivy && upgradeRequired;

    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={2} w="full" mt={mt}>
            {QUICK_ACTIONS.map((action) => (
                <QuickActionButton
                    key={action.label}
                    icon={action.icon}
                    label={action.label}
                    onClick={() => action.onClick(setCurrentContent)}
                    isDisabled={action.isDisabled?.(hasAnyBalance)}
                    showRedDot={showRedDot && action.label === 'Settings'}
                />
            ))}
        </Grid>
    );
};
