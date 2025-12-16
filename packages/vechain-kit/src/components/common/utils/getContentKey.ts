/**
 * Generate a unique key from modal content types.
 * For string types, returns the string directly.
 * For object types, creates a key from the type and a hash of props.
 */
export const getContentKey = <
    T extends string | { type: string; props: unknown } | null,
>(
    content: T,
): string => {
    if (content === null || content === undefined) {
        return '';
    }
    if (typeof content === 'string') {
        return content;
    }
    // For object types, create a key from the type and a hash of props
    const type = content.type;
    const propsStr = JSON.stringify(content.props ?? {});
    // Simple hash function for props
    let hash = 0;
    for (let i = 0; i < propsStr.length; i++) {
        const char = propsStr.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return `${type}-${Math.abs(hash)}`;
};
