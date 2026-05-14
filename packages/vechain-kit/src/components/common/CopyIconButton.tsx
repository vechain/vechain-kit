import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { useState } from 'react';
import { copyToClipboard } from '@/utils/ssrUtils';

type Props = Omit<IconButtonProps, 'aria-label' | 'icon' | 'onClick'> & {
    value: string;
    ariaLabel?: string;
};

export const CopyIconButton = ({
    value,
    ariaLabel = 'Copy',
    size = 'xs',
    variant = 'ghost',
    ...rest
}: Props) => {
    const [copied, setCopied] = useState(false);

    const handleClick = async () => {
        const ok = await copyToClipboard(value);
        if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <IconButton
            aria-label={ariaLabel}
            icon={copied ? <LuCheck size={12} /> : <LuCopy size={12} />}
            onClick={handleClick}
            size={size}
            variant={variant}
            minW="20px"
            height="20px"
            opacity={0.7}
            _hover={{ opacity: 1 }}
            {...rest}
        />
    );
};
