import { Box, BoxProps, useToken } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { PricePoint } from '@/hooks';

type Props = BoxProps & {
    points: PricePoint[];
    /** 'up' = green, 'down' = red, 'neutral' = muted. Defaults to 'neutral'. */
    tone?: 'up' | 'down' | 'neutral';
    /** Chart height in px. */
    chartHeight?: number;
    /** Overall opacity (useful as background underlay). Defaults to 1. */
    chartOpacity?: number;
    /** Stroke thickness in px. Defaults to 1.75. */
    strokeWidth?: number;
};

const PADDING_X = 2;
const PADDING_Y = 2;
const SVG_WIDTH = 100; // viewBox width; height matches chartHeight via preserveAspectRatio

export const PriceChart = ({
    points,
    tone = 'neutral',
    chartHeight = 56,
    chartOpacity = 1,
    strokeWidth = 1.75,
    ...boxProps
}: Props) => {
    const success = useToken('colors', 'vechain-kit-success');
    const error = useToken('colors', 'vechain-kit-error');
    const muted = useToken('colors', 'vechain-kit-text-tertiary');

    const stroke =
        tone === 'up' ? success : tone === 'down' ? error : muted;

    const path = useMemo(() => {
        if (points.length < 2) return null;
        const xs = points.map((p) => p.timestamp);
        const ys = points.map((p) => p.value);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const rangeX = Math.max(1, maxX - minX);
        const rangeY = Math.max(1e-12, maxY - minY);
        const innerW = SVG_WIDTH - PADDING_X * 2;
        const innerH = chartHeight - PADDING_Y * 2;

        const coords = points.map((p) => {
            const x = PADDING_X + ((p.timestamp - minX) / rangeX) * innerW;
            // Flip Y: SVG origin is top-left.
            const y =
                PADDING_Y +
                innerH -
                ((p.value - minY) / rangeY) * innerH;
            return [x, y] as const;
        });

        // Fritsch–Carlson monotone cubic interpolation. Produces a smooth
        // curve that passes through every point and is guaranteed not to
        // overshoot or backtrack between adjacent observations — important
        // for sparse oracle data with sudden jumps.
        const fmt = (n: number) => n.toFixed(2);
        const xs2 = coords.map((c) => c[0]);
        const ys2 = coords.map((c) => c[1]);
        const n = coords.length;
        const dxs: number[] = new Array(n - 1);
        const slopes: number[] = new Array(n - 1);
        for (let i = 0; i < n - 1; i++) {
            dxs[i] = xs2[i + 1] - xs2[i];
            slopes[i] = dxs[i] === 0 ? 0 : (ys2[i + 1] - ys2[i]) / dxs[i];
        }
        const tan: number[] = new Array(n).fill(0);
        tan[0] = slopes[0];
        tan[n - 1] = slopes[n - 2];
        for (let i = 1; i < n - 1; i++) {
            tan[i] =
                slopes[i - 1] * slopes[i] <= 0
                    ? 0
                    : (slopes[i - 1] + slopes[i]) / 2;
        }
        // Enforce monotonicity (Fritsch–Carlson).
        for (let i = 0; i < n - 1; i++) {
            if (slopes[i] === 0) {
                tan[i] = 0;
                tan[i + 1] = 0;
                continue;
            }
            const a = tan[i] / slopes[i];
            const b = tan[i + 1] / slopes[i];
            const h = Math.hypot(a, b);
            if (h > 3) {
                const tau = 3 / h;
                tan[i] = tau * a * slopes[i];
                tan[i + 1] = tau * b * slopes[i];
            }
        }
        const segments: string[] = [`M${fmt(xs2[0])} ${fmt(ys2[0])}`];
        for (let i = 0; i < n - 1; i++) {
            const h = dxs[i];
            const c1x = xs2[i] + h / 3;
            const c1y = ys2[i] + (h * tan[i]) / 3;
            const c2x = xs2[i + 1] - h / 3;
            const c2y = ys2[i + 1] - (h * tan[i + 1]) / 3;
            segments.push(
                `C${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(
                    xs2[i + 1],
                )} ${fmt(ys2[i + 1])}`,
            );
        }
        const line = segments.join(' ');
        const fill = `${line} L${fmt(coords[coords.length - 1][0])} ${chartHeight} L${fmt(
            coords[0][0],
        )} ${chartHeight} Z`;
        return { line, fill };
    }, [points, chartHeight]);

    if (!path) return null;

    const gradientId = `pricechart-gradient-${tone}`;

    return (
        <Box
            opacity={chartOpacity}
            pointerEvents="none"
            {...boxProps}
        >
            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${chartHeight}`}
                width="100%"
                height={chartHeight}
                preserveAspectRatio="none"
                style={{ display: 'block' }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <path d={path.fill} fill={`url(#${gradientId})`} stroke="none" />
                <path
                    d={path.line}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </Box>
    );
};
