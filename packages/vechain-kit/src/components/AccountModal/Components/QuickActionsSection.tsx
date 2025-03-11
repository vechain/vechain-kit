import {
    Grid,
    Icon,
    IconButton,
    VStack,
    Text,
    Heading,
} from '@chakra-ui/react';
import { MdSwapHoriz } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import { AccountModalContentTypes } from '../Types';
import { useBalances, useWallet } from '@/hooks';
import { IoMdApps, IoMdSettings } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { LuArrowDownToLine } from 'react-icons/lu';
import { RiSwap3Line } from 'react-icons/ri';

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
    isDisabled?: (totalBalance: number) => boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
    {
        icon: MdSwapHoriz,
        label: 'Swap',
        onClick: (setCurrentContent) => setCurrentContent('swap-token'),
    },
    {
        icon: LuArrowDownToLine,
        label: 'Receive',
        onClick: (setCurrentContent) => setCurrentContent('receive-token'),
    },
    {
        icon: FiSend,
        label: 'Send',
        onClick: (setCurrentContent) =>
            setCurrentContent({
                type: 'send-token',
                props: {
                    setCurrentContent,
                    isNavigatingFromMain: true,
                },
            }),
        isDisabled: (totalBalance) => totalBalance === 0,
    },
    {
        icon: RiSwap3Line,
        label: 'Bridge',
        onClick: (setCurrentContent) => setCurrentContent('bridge'),
    },
    {
        icon: IoMdApps,
        label: 'Ecosystem',
        onClick: (setCurrentContent) => setCurrentContent('ecosystem'),
    },
    {
        icon: IoMdSettings,
        label: 'Settings',
        onClick: (setCurrentContent) => setCurrentContent('settings'),
    },
];

const QuickActionButton = ({
    icon,
    label,
    onClick,
    isDisabled,
}: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
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
                    <Text fontSize="sm" fontWeight="600">
                        {t(label, label)}
                    </Text>
                </VStack>
            }
            onClick={onClick}
        />
    );
};

export const QuickActionsSection = ({ mt, setCurrentContent }: Props) => {
    const { account } = useWallet();
    const { totalBalance } = useBalances({
        address: account?.address ?? '',
    });
    const { t } = useTranslation();

    return (
        <VStack w={'full'} mt={mt} spacing={4}>
            <Heading size={'xs'} fontWeight={'500'} w={'full'} opacity={0.5}>
                {t('Activities')}
            </Heading>
            <Grid templateColumns="repeat(3, 1fr)" gap={2} w="full">
                {QUICK_ACTIONS.map((action) => (
                    <QuickActionButton
                        key={action.label}
                        icon={action.icon}
                        label={action.label}
                        onClick={() => action.onClick(setCurrentContent)}
                        isDisabled={action.isDisabled?.(totalBalance)}
                    />
                ))}
            </Grid>
        </VStack>
    );
};
