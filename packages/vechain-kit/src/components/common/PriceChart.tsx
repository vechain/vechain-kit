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

        const line = coords
            .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
            .join(' ');
        const fill = `${line} L${coords[coords.length - 1][0].toFixed(
            2,
        )} ${chartHeight} L${coords[0][0].toFixed(2)} ${chartHeight} Z`;
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
