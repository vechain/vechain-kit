'use client';

// Use static import to ensure we use the same module instance as LazyPrivyProvider
// This avoids ESM/CJS interop issues that can occur with require() in bundled contexts
import { useMfaEnrollment } from '@privy-io/react-auth';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';

/**
 * Type for the optional MFA enrollment hook return value.
 */
export type UseOptionalMfaEnrollmentReturnType = {
    showMfaEnrollmentModal: () => void;
};

// Default return value when Privy is not available
const DEFAULT_MFA_ENROLLMENT_STATE: UseOptionalMfaEnrollmentReturnType = {
    showMfaEnrollmentModal: () => {
        console.warn(
            'Privy is not configured. Add privy prop to VeChainKitProvider to enable MFA enrollment.',
        );
    },
};

/**
 * Optional hook to access Privy MFA enrollment.
 * Returns default values when Privy is not configured.
 *
 * Uses static import to ensure the same module instance as LazyPrivyProvider,
 * avoiding ESM/CJS interop issues that can occur with require().
 *
 * @returns MFA enrollment functions, or defaults if Privy is not configured
 */
export const useOptionalMfaEnrollment =
    (): UseOptionalMfaEnrollmentReturnType => {
        const config = useVeChainKitConfig();
        const isPrivyConfigured = !!config.privy;

        // Always call hooks unconditionally to satisfy React's rules of hooks
        let mfaResult: ReturnType<typeof useMfaEnrollment> | null = null;
        try {
            mfaResult = useMfaEnrollment();
        } catch {
            // Hook threw (no PrivyProvider in tree), will use defaults
        }

        // If Privy is not configured, return defaults immediately
        if (!isPrivyConfigured) {
            return DEFAULT_MFA_ENROLLMENT_STATE;
        }

        // Privy is configured, return actual values (or defaults if hook threw)
        if (!mfaResult) {
            return DEFAULT_MFA_ENROLLMENT_STATE;
        }

        return {
            showMfaEnrollmentModal:
                mfaResult.showMfaEnrollmentModal ?? (() => {}),
        };
    };
