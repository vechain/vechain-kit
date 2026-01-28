import { useState, useRef } from 'react';
import {
    Box,
    HStack,
    VStack,
    Text,
    Switch,
    Icon,
    useToken,
} from '@chakra-ui/react';
import { LuGripVertical } from 'react-icons/lu';
import type { GasTokenType } from '../../../../types/gasToken';
import { SUPPORTED_GAS_TOKENS } from '../../../../utils/constants';
import { useVeChainKitConfig } from '../../../../providers';

interface DragListProps {
    tokens: GasTokenType[];
    excludedTokens: GasTokenType[];
    onReorder: (newOrder: GasTokenType[]) => void;
    onToggleExclusion: (token: GasTokenType) => void;
}

interface TokenItemProps {
    token: GasTokenType;
    index: number;
    isExcluded: boolean;
    onToggleExclusion: (token: GasTokenType) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDrop: (index: number) => void;
    onTouchStart: (index: number, event: React.TouchEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    onTouchEnd: () => void;
    isDragging: boolean;
    isDraggedOver: boolean;
}

const TokenPriorityItem = ({
    token,
    index,
    isExcluded,
    onToggleExclusion,
    onDragStart,
    onDragOver,
    onDrop,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging,
    isDraggedOver,
}: TokenItemProps) => {
    const tokenInfo = SUPPORTED_GAS_TOKENS[token];
    const { darkMode: isDark } = useVeChainKitConfig();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    return (
        <Box
            bg={isDark ? '#ffffff0a' : 'blackAlpha.50'}
            borderRadius="md"
            border="1px"
            borderColor={
                isDragging
                    ? isDark
                        ? 'blue.500'
                        : 'blue.300'
                    : isDraggedOver
                    ? isDark
                        ? 'blue.400'
                        : 'blue.200'
                    : cardBg
            }
            p={3}
            mb={2}
            opacity={isDragging ? 0.5 : isExcluded ? 0.5 : 1}
            cursor="move"
            transition="background-color 0.2s ease, border-color 0.2s ease"
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver(index);
            }}
            onDrop={() => onDrop(index)}
            onTouchStart={(e) => onTouchStart(index, e)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            _hover={{
                backgroundColor: isDark ? '#ffffff12' : 'blackAlpha.200',
            }}
        >
            <HStack justify="space-between">
                <HStack opacity={isExcluded ? 0.5 : 1}>
                    <Box
                        cursor="grab"
                        _active={{ cursor: 'grabbing' }}
                        pointerEvents="none"
                    >
                        <Icon as={LuGripVertical} color={textSecondary} />
                    </Box>
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" color={textPrimary}>
                            {tokenInfo.name}
                        </Text>
                        <Text fontSize="sm" color={textSecondary}>
                            {tokenInfo.description}
                        </Text>
                    </VStack>
                </HStack>
                <Switch
                    isChecked={!isExcluded}
                    onChange={() => onToggleExclusion(token)}
                    colorScheme="blue"
                    size="sm"
                />
            </HStack>
        </Box>
    );
};

export const GasTokenDragList = ({
    tokens,
    excludedTokens,
    onReorder,
    onToggleExclusion,
}: DragListProps) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const touchStartY = useRef<number>(0);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index: number) => {
        setDragOverIndex(index);
    };

    const handleDrop = (dropIndex: number) => {
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newOrder = [...tokens];
        const draggedToken = newOrder[draggedIndex];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(dropIndex, 0, draggedToken);

        onReorder(newOrder);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Touch event handlers for mobile support
    const handleTouchStart = (index: number, event: React.TouchEvent) => {
        touchStartY.current = event.touches[0].clientY;
        setDraggedIndex(index);
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        if (draggedIndex === null) return;

        const touch = event.touches[0];
        const currentY = touch.clientY;

        // Find which item is under the current touch position
        for (let i = 0; i < itemRefs.current.length; i++) {
            const element = itemRefs.current[i];
            if (!element) continue;

            const rect = element.getBoundingClientRect();
            if (currentY >= rect.top && currentY <= rect.bottom) {
                setDragOverIndex(i);
                break;
            }
        }
    };

    const handleTouchEnd = () => {
        if (
            draggedIndex !== null &&
            dragOverIndex !== null &&
            draggedIndex !== dragOverIndex
        ) {
            const newOrder = [...tokens];
            const draggedToken = newOrder[draggedIndex];
            newOrder.splice(draggedIndex, 1);
            newOrder.splice(dragOverIndex, 0, draggedToken);
            onReorder(newOrder);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
        touchStartY.current = 0;
    };

    return (
        <Box w="full">
            {tokens.map((token, index) => (
                <Box
                    key={token}
                    ref={(el) => {
                        itemRefs.current[index] = el;
                    }}
                >
                    <TokenPriorityItem
                        token={token}
                        index={index}
                        isExcluded={excludedTokens.includes(token)}
                        onToggleExclusion={onToggleExclusion}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        isDragging={draggedIndex === index}
                        isDraggedOver={dragOverIndex === index}
                    />
                </Box>
            ))}
        </Box>
    );
};
