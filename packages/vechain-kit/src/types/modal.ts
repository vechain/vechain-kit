/**
 * Shared modal-related types used by both hooks and components.
 * These types are defined here to avoid circular dependencies between
 * hooks and components modules.
 */

/**
 * Allowed categories for App Hub apps displayed in the Ecosystem modal.
 */
export type AllowedCategories =
    | 'defi'
    | 'games'
    | 'collectibles'
    | 'marketplaces'
    | 'utilities'
    | 'vebetter';
