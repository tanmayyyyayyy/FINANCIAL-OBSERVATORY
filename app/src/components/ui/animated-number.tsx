import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

function AnimatedNumber({ value, className }: { value: number | string, className?: string }) {
    const stringVal = value !== undefined && value !== null ? value.toString() : "";
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        return (
            <span
                className={cn("inline-block whitespace-nowrap tabular-numbers", className)}
                style={{ display: "inline-block", whiteSpace: "nowrap", maxWidth: "100%", overflowX: "visible" }}
            >
                {stringVal}
            </span>
        )
    }

    return (
        <span
            className={cn("inline-block whitespace-nowrap tabular-numbers", className)}
            style={{ display: "inline-block", whiteSpace: "nowrap", maxWidth: "100%", overflowX: "visible" }}
        >
            <motion.span
                key={stringVal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="inline-block whitespace-nowrap"
                style={{ display: "inline-block", whiteSpace: "nowrap" }}
            >
                {stringVal}
            </motion.span>
        </span>
    )
}

// Score-style animated number with color feedback
function AnimatedScore({ value, duration = 0.2, className }: { value: number, duration?: number, className?: string }) {
    const prevValueRef = useRef(value)

    useEffect(() => {
        prevValueRef.current = value
    }, [value])

    const colors = {
        negative: "#37ff1a",
        positive: "#ff1a4b",
        neutral: "#fff"
    }

    const transforVal = 80
    const forwards = {
        init: { y: transforVal * -1, opacity: 0, scale: 0.5, color: colors.negative },
        animate: {
            y: 0,
            opacity: 1,
            scale: [1.7, 1],
            color: [colors.negative, colors.negative, colors.neutral],
            transition: { duration: 0.4, times: [0, 0.7, 1], color: { times: [0, 0.75, 0.9] } },
        },
        exit: {
            y: transforVal,
            opacity: 0,
            scale: 0.5,
            color: colors.positive
        },
    }

    const backwards = {
        init: { y: transforVal, opacity: 0, scale: 0.5, color: colors.positive },
        animate: {
            y: 0,
            opacity: 1,
            scale: [1.7, 1],
            color: [colors.positive, colors.positive, colors.neutral],
            transition: { duration: 0.4, times: [0, 0.7, 1], color: { times: [0, 0.75, 0.9] } },
        },
        exit: {
            y: transforVal * -1,
            opacity: 0,
            scale: 0.5,
            color: colors.negative
        }
    }

    const variants = value >= prevValueRef.current ? forwards : backwards
    const direction = value >= prevValueRef.current ? "forwards" : "backwards"

    return (
        <div className={cn("relative flex justify-center items-center py-1 px-2 w-full rounded-md", className)}>
            <motion.div layout="size" className='w-fit flex justify-center items-center'>
                {value.toString().split("").map((number, index) => (
                    <ScoreContainer
                        direction={direction}
                        duration={duration}
                        variants={variants}
                        number={number}
                        key={index}
                    />
                ))}
            </motion.div>
        </div>
    )
}

function ScoreContainer({ number, variants, duration = 0.7, direction }: {
    number: string,
    variants: any,
    duration?: number,
    direction: string
}) {
    const cached = React.useMemo(() => (
        <div className='relative'>
            <AnimatePresence mode='popLayout'>
                <motion.div
                    animate="animate"
                    className='flex justify-center items-center'
                    initial="init"
                    exit="exit"
                    variants={variants}
                    key={number.toString()}
                    layout="size"
                    transition={{ duration, ease: "backInOut" }}
                >
                    {number}
                </motion.div>
            </AnimatePresence>
        </div>
    ), [number, direction, variants, duration])

    return <React.Fragment>{cached}</React.Fragment>
}

export { AnimatedNumber, AnimatedScore }
