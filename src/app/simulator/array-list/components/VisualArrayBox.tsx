
import { motion, MotionNodeAnimationOptions } from "framer-motion";
import { ArrayElementAnimationState } from "@/app/simulator/array-list/components/types";

type VisualArrayBoxProps = {
  value: string | number,
  animationState: ArrayElementAnimationState,
}

const animationVariants: Record<ArrayElementAnimationState, MotionNodeAnimationOptions> = {
  [ArrayElementAnimationState.Default]: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: [1, 1.1, 0.7], backgroundColor: "#ef4444" },
  },
  [ArrayElementAnimationState.Invisible]: {
    initial: { opacity: 0, scale: 1 },
  },
  [ArrayElementAnimationState.RemovedInvisible]: {
    animate: { opacity: 0, scale: [1, 1.1, 0.7], backgroundColor: "#ef4444" },
    exit: { opacity: 0, scale: 0, visibility: "hidden" },
  },
  [ArrayElementAnimationState.NewInserted]: {
    initial: { opacity: 0, scale: 1 },
    animate: { opacity: 1, scale: [1, 1.2, 0.95, 1], backgroundColor: "#4ADE80" },
    transition: { duration: 0.5 }
  },
  [ArrayElementAnimationState.HighlightedOrange]: {
    initial: { opacity: 0, scale: 1 },
    animate: { opacity: 1, scale: 1.3, backgroundColor: "#FDBA74" },
    transition: { duration: 0.5 }
  },
  [ArrayElementAnimationState.HighlightedGreen]: {
    initial: { opacity: 0, scale: 1 },
    animate: { opacity: 1, scale: 1.3, backgroundColor: "#4ADE80" },
    transition: { duration: 0.5 }
  },
  [ArrayElementAnimationState.Comparing]: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1.1, backgroundColor: "#7C3AED" },
    transition: { duration: 0.3 }
  },
  [ArrayElementAnimationState.MinElement]: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1.2, backgroundColor: "#F87171" },
    transition: { duration: 0.3 }
  },
  [ArrayElementAnimationState.Sorted]: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1, backgroundColor: "#34D399" },
    transition: { duration: 0.5 }
  },
  [ArrayElementAnimationState.HighlightedGray]: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1.1, backgroundColor: "#9CA3AF" },
    transition: { duration: 0.3 }
  },
}

export default function VisualArrayBox({ value, animationState }: VisualArrayBoxProps) {
  const { initial, animate, exit, transition } = animationVariants[animationState];

  return (
    <motion.div
      layout
      className="flex w-12 h-12 rounded items-center justify-center text-white bg-[#94A6FF] border-[1.8px] border-black"
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition ?? { duration: 0.4 }}
    >
      <span className={"text-center truncate px-1 text-xl text-white font-bold"}>
        {value}
      </span>
    </motion.div>
  )
}
