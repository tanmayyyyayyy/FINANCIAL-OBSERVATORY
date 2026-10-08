'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the GlowBorderCard component
 */
export interface GlowBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Content to display inside the card
     */
    children?: React.ReactNode;

    /**
     * Width of the card (CSS value)
     * @default "320px"
     */
    width?: string;

    /**
     * Height of the card (CSS value). If not provided, uses aspect-ratio.
     */
    height?: string;

    /**
     * Aspect ratio of the card (e.g., "1", "16/9", "4/3")
     * @default "1"
     */
    aspectRatio?: string;

    /**
     * Corner radius of the card
     * @default "0.75rem"
     */
    borderRadius?: string;

    /**
     * Animation duration in seconds
     * @default 4
     */
    animationDuration?: number;

    /**
     * Gradient colors array (up to 10 colors)
     */
    gradientColors?: string[];

    /**
     * Border width for the glow effect
     * @default "1.25em"
     */
    borderWidth?: string;

    /**
     * Blur amount for the glow effect
     * @default "0.75em"
     */
    blurAmount?: string;

    /**
     * Inset distance (negative values push the border outside)
     * @default "-1em"
     */
    inset?: string;

    /**
     * Preset color themes
     */
    colorPreset?: 'nature' | 'ocean' | 'sunset' | 'aurora' | 'custom';

    /**
     * Whether animation is paused
     * @default false
     */
    paused?: boolean;
}

// Preset gradient colors (10 colors each for smooth transitions)
const colorPresets: Record<string, string[]> = {
    observatory: ['rgba(99, 102, 241, 0.45)', 'rgba(168, 85, 247, 0.35)', 'rgba(59, 130, 246, 0.35)', 'rgba(16, 185, 129, 0.25)', 'rgba(99, 102, 241, 0.45)'],
    nature: ['#669900', '#88bb22', '#99cc33', '#aaddaa', '#ccee66', '#006699', '#228888', '#3399cc', '#55aacc', '#669900'],
    ocean: ['#006699', '#1177aa', '#2288bb', '#3399cc', '#44aadd', '#55bbee', '#66ccff', '#44bbee', '#2299cc', '#006699'],
    sunset: ['#ff6600', '#ff7711', '#ff8822', '#ff9900', '#ffaa22', '#ffbb44', '#ffcc00', '#ff9933', '#ff7722', '#ff6600'],
    aurora: ['#00ff87', '#22ffaa', '#44ffcc', '#60efff', '#88ddff', '#bb99ff', '#dd77ee', '#ff68f0', '#ff55cc', '#00ff87'],
    custom: ['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#6366f1'],
};

export const GlowBorderCard = React.forwardRef<HTMLDivElement, GlowBorderCardProps>(
    (
        {
            children,
            className,
            width = '100%',
            height,
            aspectRatio = 'unset',
            borderRadius = '12px',
            animationDuration = 6,
            gradientColors,
            borderWidth = '1.5px',
            blurAmount = '0.5rem',
            inset = '-2px',
            colorPreset = 'observatory',
            paused = false,
            style,
            ...props
        },
        ref
    ) => {
        const colors = gradientColors || colorPresets[colorPreset] || colorPresets.observatory;
        const colorVars: Record<string, string> = {};
        for (let i = 0; i < 10; i++) {
            colorVars[`--glow-color-${i + 1}`] = colors[i % colors.length];
        }

        return (
            <>
                <style>{`
                    @keyframes glow-conic-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .glow-conic-el {
                            animation: none !important;
                            opacity: 0.3 !important;
                        }
                    }
                `}</style>
                <div
                    ref={ref}
                    className={cn(
                        "relative overflow-hidden isolate rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 backdrop-blur-md",
                        className
                    )}
                    style={{
                        width: width,
                        height: height || 'auto',
                        aspectRatio: aspectRatio,
                        borderRadius: borderRadius,
                        ...colorVars,
                        ...style,
                    } as React.CSSProperties}
                    {...props}
                >
                    <div
                        className={cn(
                            "glow-conic-el pointer-events-none absolute -z-10 rounded-[inherit]",
                            paused && "[animation-play-state:paused]"
                        )}
                        style={{
                            inset: inset,
                            borderWidth: borderWidth,
                            filter: `blur(${blurAmount})`,
                            background: `conic-gradient(from 0deg, ${colors.join(', ')})`,
                            animation: `glow-conic-spin ${animationDuration}s linear infinite`,
                        }}
                    />

                    <div className="relative z-10 w-full h-full bg-transparent p-4">
                        {children}
                    </div>
                </div>
            </>
        );
    }
);

GlowBorderCard.displayName = 'GlowBorderCard';

export default GlowBorderCard;
