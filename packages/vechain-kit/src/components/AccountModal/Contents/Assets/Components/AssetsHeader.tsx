import {
    Heading,
    HStack,
    Icon,
    IconButton,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    LuArrowLeftRight,
    LuArrowUpFromLine,
    LuHistory,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    LocalStorageKey,
    useLocalStorage,
    useTotalBalance,
    useWallet,
} from '@/hooks';

type Props = {
    onSend: () => void;
    onSwap: () => void;
    onHistory: () => void;
    hideHistory?: boolean;
};

const ActionButton = ({
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
            variant="vechainKitSecondary"
            h="44px"
            flex={1}
            borderRadius="lg"
            aria-label={label}
            isDisabled={isDisabled}
            onClick={onClick}
            icon={
                <HStack spacing={1.5}>
                    <Icon as={icon} boxSize={3.5} opacity={0.85} />
                    <Text fontSize="sm" fontWeight="600">
                        {t(label, label)}
                    </Text>
                </HStack>
            }
        />
    );
};

export const AssetsHeader = ({
    onSend,
    onSwap,
    onHistory,
    hideHistory,
}: Props) => {
    const { account } = useWallet();
    const { formattedBalance, hasAnyBalance, isLoading } = useTotalBalance({
        address: account?.address ?? '',
    });
    const [showAssets] = useLocalStorage(LocalStorageKey.SHOW_ASSETS, true);

    return (
        <VStack w="full" spacing={4} align="stretch">
            <Heading size="2xl" fontWeight="700">
                {isLoading
                    ? '...'
                    : showAssets
                    ? formattedBalance
                    : '$****'}
            </Heading>

            <HStack spacing={2} w="full">
                <ActionButton
                    icon={LuArrowUpFromLine}
                    label="Send"
                    onClick={onSend}
                    isDisabled={!hasAnyBalance}
                />
                <ActionButton
                    icon={LuArrowLeftRight}
                    label="Swap"
                    onClick={onSwap}
                    isDisabled={!hasAnyBalance}
                />
                {!hideHistory && (
                    <ActionButton
                        icon={LuHistory}
                        label="History"
                        onClick={onHistory}
                    />
                )}
            </HStack>
        </VStack>
    );
};
