import { useState } from 'react';
import { Box, HStack, VStack, Text, Switch, Icon } from '@chakra-ui/react';
import { MdDragIndicator } from 'react-icons/md';
import { GasTokenType, SUPPORTED_GAS_TOKENS } from '@/types/gasToken';

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
    isDragging,
    isDraggedOver,
}: TokenItemProps) => {
    const tokenInfo = SUPPORTED_GAS_TOKENS[token];

    return (
        <Box
            bg="white"
            borderRadius="md"
            border="1px"
            borderColor={
                isDragging
                    ? 'blue.300'
                    : isDraggedOver
                    ? 'blue.200'
                    : 'gray.200'
            }
            p={3}
            mb={2}
            opacity={isDragging ? 0.5 : isExcluded ? 0.5 : 1}
            cursor="move"
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver(index);
            }}
            onDrop={() => onDrop(index)}
            _dark={{
                bg: 'gray.800',
                borderColor: isDragging
                    ? 'blue.500'
                    : isDraggedOver
                    ? 'blue.400'
                    : 'gray.600',
            }}
        >
            <HStack justify="space-between">
                <HStack opacity={isExcluded ? 0.5 : 1}>
                    <Box
                        cursor="grab"
                        _active={{ cursor: 'grabbing' }}
                        pointerEvents="none"
                    >
                        <Icon as={MdDragIndicator} color="gray.400" />
                    </Box>
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{tokenInfo.name}</Text>
                        <Text fontSize="sm" color="gray.600">
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

    return (
        <Box w="full">
            {tokens.map((token, index) => (
                <TokenPriorityItem
                    key={token}
                    token={token}
                    index={index}
                    isExcluded={excludedTokens.includes(token)}
                    onToggleExclusion={onToggleExclusion}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={draggedIndex === index}
                    isDraggedOver={dragOverIndex === index}
                />
            ))}
        </Box>
    );
};
