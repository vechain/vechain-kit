import { gmNfts } from '@/utils';

/**
 * Calculates the final GM level based on the starting level and the amount of B3TR donated.
 *
 * @param startingLevel - The initial GM level.
 * @param b3trDonated - The amount of B3TR donated.
 * @returns The final GM level after considering the donations, or null if invalid input.
 * @throws {Error} If startingLevel is not a positive number
 */
export const getGMLevel = (
    startingLevel: number,
    b3trDonated: number,
): number | null => {
    if (!Number.isInteger(startingLevel) || startingLevel <= 0) {
        throw new Error('Starting level must be a positive integer');
    }

    const gmLevelMap = new Map(gmNfts.map((gm) => [Number(gm.level), gm]));

    const startingGM = gmLevelMap.get(startingLevel);
    if (!startingGM) return null;

    let finalLevel = startingLevel;
    let remainingB3tr = b3trDonated;

    while (remainingB3tr > 0) {
        const b3trToUpgrade = gmLevelMap.get(finalLevel)?.b3trToUpgrade;
        if (!b3trToUpgrade) break;

        if (remainingB3tr >= b3trToUpgrade) {
            finalLevel++;
            remainingB3tr -= b3trToUpgrade;
        } else {
            break;
        }
    }

    return finalLevel;
};
