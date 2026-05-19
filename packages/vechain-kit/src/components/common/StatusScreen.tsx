import {
    Box,
    Icon,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { LuCircleCheckBig, LuTriangleAlert } from 'react-icons/lu';
import { StickyHeaderContainer } from './StickyHeaderContainer';

type Status = 'success' | 'error';

export type StatusScreenProps = {
    status: Status;
    /** Heading rendered in the modal header. */
    title: string;
    /** Optional supporting copy under the badge. */
    description?: string;
    /** Override the default icon (`LuCircleCheckBig` for success,
     *  `LuTriangleAlert` for error). */
    icon?: IconType | ReactNode;
    /** Slot for primary CTAs (Done / Try again, …). */
    actions: ReactNode;
    /** Optional extra slot under the body — e.g. a "Share on socials" row. */
    bodyExtras?: ReactNode;
    /** Optional explorer link rendered below the actions. */
    footerExtras?: ReactNode;
    /** Hide the close button (used while a tx is still pending). */
    hideCloseButton?: boolean;
};

/**
 * Shared visual scaffold for end-of-flow status screens — success after a
 * transaction confirms, error after one fails. Replaces the four
 * almost-duplicate "100px LuCircleCheck" / "100px LuCircleAlert" surfaces
 * that used to live in AccountModal, TransactionModal and
 * UpgradeSmartAccountModal.
 *
 * Visual: a soft tinted disc (~88px) holds the status icon (~44px solid),
 * with a one-shot framer-motion entrance — the disc fades + scales from
 * 0.92, the icon springs in. No looping animation: the screen should feel
 * polished, not chatty.
 */
export const StatusScreen = ({
    status,
    title,
    description,
    icon,
    actions,
    bodyExtras,
    footerExtras,
    hideCloseButton,
}: StatusScreenProps) => {
    const [successColor, successBg, errorColor, errorBg, textSecondary] =
        useToken('colors', [
            'vechain-kit-success',
            'vechain-kit-success-bg',
            'vechain-kit-error',
            'vechain-kit-error-bg',
            'vechain-kit-text-secondary',
        ]);

    const color = status === 'success' ? successColor : errorColor;
    const bg = status === 'success' ? successBg : errorBg;
    const DefaultIcon: IconType =
        status === 'success' ? LuCircleCheckBig : LuTriangleAlert;

    const renderedIcon =
        // If a custom node was passed, drop it in as-is. Otherwise render
        // either the override IconType or the default at 44px in the
        // status color.
        icon && typeof icon !== 'function' ? (
            icon
        ) : (
            <Icon
                as={(icon as IconType | undefined) ?? DefaultIcon}
                boxSize={'44px'}
                color={color}
                data-testid={`${status}-icon`}
            />
        );

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader textAlign={'center'}>{title}</ModalHeader>
                {!hideCloseButton && <ModalCloseButton />}
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} px={6} py={4} spacing={5}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.22,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        <Box
                            w={'88px'}
                            h={'88px'}
                            borderRadius={'full'}
                            bg={bg}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <motion.div
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 340,
                                    damping: 18,
                                    delay: 0.08,
                                }}
                                style={{ display: 'flex' }}
                            >
                                {renderedIcon}
                            </motion.div>
                        </Box>
                    </motion.div>

                    {description && (
                        <Text
                            fontSize={'14px'}
                            lineHeight={'1.5'}
                            textAlign={'center'}
                            color={textSecondary}
                            maxW={'36ch'}
                            style={{ lineBreak: 'anywhere' }}
                        >
                            {description}
                        </Text>
                    )}

                    {bodyExtras}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent={'center'}>
                <VStack width={'full'} spacing={3}>
                    {actions}
                    {footerExtras}
                </VStack>
            </ModalFooter>
        </>
    );
};
