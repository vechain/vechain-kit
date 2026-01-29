/**
 * AccountModal type definitions.
 *
 * This file re-exports types from the centralized types/modal.ts to avoid
 * circular dependencies. The types are defined in types/modal.ts without
 * importing from component files.
 */

// Re-export all types from centralized location
export type {
    AccountModalContentTypes,
    SwitchFeedback,
    SetContentDispatcher,
    AllowedCategories,
    CategoryFilter,
} from '../../../types/modal';
