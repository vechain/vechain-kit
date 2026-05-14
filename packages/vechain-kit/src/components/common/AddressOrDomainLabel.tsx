import { Text, TextProps } from '@chakra-ui/react';
import { useVechainDomain } from '@/hooks';
import { humanAddress } from '@/utils/formattingUtils';

type Props = TextProps & {
    address: string;
    /**
     * Characters to keep on each side of the address when it has no domain.
     * Defaults to 4/4 (e.g. `0xab12...cd34`).
     */
    headLen?: number;
    tailLen?: number;
};

export const AddressOrDomainLabel = ({
    address,
    headLen = 4,
    tailLen = 4,
    ...textProps
}: Props) => {
    const { data } = useVechainDomain(address);
    const label = data?.domain || humanAddress(address, headLen, tailLen);
    return <Text {...textProps}>{label}</Text>;
};
