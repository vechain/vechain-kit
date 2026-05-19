import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaDiscord, FaGithub, FaLine, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiFarcaster } from 'react-icons/si';
import { LuPhone } from 'react-icons/lu';
import type { IconType } from 'react-icons';

export const OAUTH_PROVIDERS = [
    { id: 'google', label: 'Google', Icon: FcGoogle, tier: 'primary' },
    { id: 'apple', label: 'Apple', Icon: FaApple, tier: 'primary' },
    { id: 'twitter', label: 'X', Icon: FaXTwitter, tier: 'primary' },
    { id: 'discord', label: 'Discord', Icon: FaDiscord, tier: 'other' },
    { id: 'github', label: 'GitHub', Icon: FaGithub, tier: 'other' },
    { id: 'tiktok', label: 'TikTok', Icon: FaTiktok, tier: 'other' },
    { id: 'line', label: 'LINE', Icon: FaLine, tier: 'other' },
] as const satisfies ReadonlyArray<{
    id: string;
    label: string;
    Icon: IconType;
    tier: 'primary' | 'other';
}>;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]['id'];

// Brand hexes for providers whose glyph reads better in their official
// color rather than monochrome. Discord blurple, TikTok pink, LINE green.
// Phone (not OAuth) uses iMessage-style green. Apple, GitHub, X stay
// monochrome -- their wordmarks are black/white by brand.
export const BRAND_GLYPH_COLOR: Partial<Record<OAuthProvider, string>> = {
    discord: '#5865F2',
    tiktok: '#FE2C55',
    line: '#06C755',
};
export const PHONE_GLYPH_COLOR = '#34C759';
export const FARCASTER_GLYPH_COLOR = '#8A63D2';

export type LinkedSocialBadge = {
    id: string;
    label: string;
    Icon: IconType;
    color?: string;
};

/**
 * Build the list of social-icon badges the user has linked to their Privy
 * account. Reads each known OAuth provider key off the user object plus the
 * phone and farcaster top-level fields.
 */
export function linkedSocials(
    user: { phone?: unknown; farcaster?: unknown } | null | undefined,
): LinkedSocialBadge[] {
    if (!user) return [];
    const u = user as unknown as Record<string, unknown>;
    const badges: LinkedSocialBadge[] = [];
    for (const p of OAUTH_PROVIDERS) {
        if (u[p.id]) {
            badges.push({
                id: p.id,
                label: p.label,
                Icon: p.Icon,
                color: BRAND_GLYPH_COLOR[p.id],
            });
        }
    }
    if (u.phone) {
        badges.push({
            id: 'phone',
            label: 'Phone',
            Icon: LuPhone,
            color: PHONE_GLYPH_COLOR,
        });
    }
    if (u.farcaster) {
        badges.push({
            id: 'farcaster',
            label: 'Farcaster',
            Icon: SiFarcaster,
            color: FARCASTER_GLYPH_COLOR,
        });
    }
    return badges;
}
