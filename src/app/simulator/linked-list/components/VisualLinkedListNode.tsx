import { motion, MotionNodeAnimationOptions } from "framer-motion";
import { LinkedListNode, NodeAnimationState } from "./types";

const animationVariants: Record<NodeAnimationState, MotionNodeAnimationOptions> = {
    [NodeAnimationState.Default]: {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1, backgroundColor: "#94A6FF" },
        exit: { opacity: 0, scale: [1, 1.1, 0.7], backgroundColor: "#ef4444" },
    },
    [NodeAnimationState.Invisible]: {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 0, scale: 1, backgroundColor: "#94A6FF" },
        exit: { opacity: 0, scale: 0.5 },
    },
    [NodeAnimationState.NewInserted]: {
        initial: { opacity: 0, scale: 0.5 },
        animate: {
            opacity: 1,
            scale: [1, 1.2, 0.95, 1],
            backgroundColor: "#4ADE80"
        },
        exit: { opacity: 0, scale: 0.5 },
    },
    [NodeAnimationState.BeingRemoved]: {
        initial: { opacity: 1, scale: 1 },
        animate: {
            opacity: 0.5,
            scale: 1.2,
            backgroundColor: "#ef4444"
        },
        exit: { opacity: 0, scale: [1, 1.1, 0.7], backgroundColor: "#ef4444" },
    },
    [NodeAnimationState.Traversing]: {
        initial: { opacity: 1, scale: 1 },
        animate: {
            opacity: 1,
            scale: 1.1,
            backgroundColor: "#7C3AED"
        },
        exit: { opacity: 0, scale: 0.5 },
    },
    [NodeAnimationState.HighlightedGreen]: {
        initial: { opacity: 1, scale: 1 },
        animate: {
            opacity: 1,
            scale: 1.3,
            backgroundColor: "#10B981"
        },
        exit: { opacity: 0, scale: 0.5 },
    },
    [NodeAnimationState.HighlightedOrange]: {
        initial: { opacity: 1, scale: 1 },
        animate: {
            opacity: 1,
            scale: 1.3,
            backgroundColor: "#FDBA74"
        },
        exit: { opacity: 0, scale: 0.5 },
    },
};

interface VisualLinkedListNodeProps {
    node: LinkedListNode;
    isHead: boolean;
    isTail: boolean;
}

const VisualLinkedListNode = ({ node, isHead, isTail }: VisualLinkedListNodeProps) => {
    const variant = animationVariants[node.animationState];

    return (
        <motion.div
            layout
            className="flex items-center gap-0.5 md:gap-1"
            transition={{ layout: { duration: 0.5, type: "spring", stiffness: 300, damping: 30 } }}
        >
            {/* Node container with inline label */}
            <div className="flex flex-col items-center justify-center">
                {/* HEAD/TAIL label inline above */}
                <div className="h-3 md:h-4 mb-0.5">
                    {isHead && (
                        <span className="text-[8px] md:text-[10px] font-bold text-blue-600">
                            HEAD
                        </span>
                    )}
                    {isTail && !isHead && (
                        <span className="text-[8px] md:text-[10px] font-bold text-gray-600">
                            TAIL
                        </span>
                    )}
                </div>

                {/* Circular value box - smaller */}
                <motion.div
                    layout
                    key={node.id}
                    initial={variant.initial}
                    animate={variant.animate}
                    exit={variant.exit}
                    transition={{
                        duration: 0.4,
                        layout: { duration: 0.5, type: "spring", stiffness: 300, damping: 30 }
                    }}
                    className="flex w-10 h-10 md:w-14 md:h-14 rounded-full items-center justify-center border-[1.5px] md:border-2 border-black text-[10px] md:text-sm font-bold text-white"
                >
                    {node.value}
                </motion.div>
            </div>

            {/* Arrow or X - vertically centered with layout animation */}
            {!isTail ? (
                <motion.svg
                    layout
                    className="w-6 h-4 md:w-10 md:h-6 flex-shrink-0"
                    viewBox="0 0 40 24"
                    fill="none"
                    transition={{ layout: { duration: 0.5, type: "spring", stiffness: 300, damping: 30 } }}
                >
                    <line
                        x1="0"
                        y1="12"
                        x2="32"
                        y2="12"
                        stroke="#94A6FF"
                        strokeWidth="2"
                    />
                    <polygon
                        points="32,8 40,12 32,16"
                        fill="#94A6FF"
                    />
                </motion.svg>
            ) : (
                <motion.div
                    layout
                    className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm font-bold text-red-500"
                    transition={{ layout: { duration: 0.5, type: "spring", stiffness: 300, damping: 30 } }}
                >
                    ✕
                </motion.div>
            )}
        </motion.div>
    );
};

export default VisualLinkedListNode;
