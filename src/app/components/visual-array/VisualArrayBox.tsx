
import { motion, MotionNodeAnimationOptions} from "framer-motion";
import { ArrayElementAnimationState } from "@/app/components/visual-array/types";

type VisualArrayBoxProps = {
    value: string | number,
    animationState: ArrayElementAnimationState,
}

const animationVariants: Record<ArrayElementAnimationState, MotionNodeAnimationOptions> = {
    [ArrayElementAnimationState.Default]: {
        initial: {opacity: 0, scale: 0.5},
        animate: {opacity: 1, scale: 1},
        exit: {opacity: 0, scale: [1, 1.1,0.7], backgroundColor: "#ef4444"}, transition: {duration: 0.4},
    },
    [ArrayElementAnimationState.Invisible]: {
        initial: {opacity: 0, scale: 0.5},
        animate: {opacity: 0, scale: 1, visibility: "hidden"},
        exit: {opacity: 0, scale: 0, visibility: "hidden"},
    },
    [ArrayElementAnimationState.RemovedInvisible]: {
        initial: {opacity: 0, scale: 0.5},
        animate: {opacity: 0, scale: [1, 1.1,0.7], backgroundColor: "#ef4444"}, transition: {duration: 0.4},
        exit: {opacity: 0, scale: 0, visibility: "hidden"},
    }
}

export default function VisualArrayBox({value, animationState}: VisualArrayBoxProps) {
    const { initial, animate, exit, transition } = animationVariants[animationState];

    return (
        <motion.div
            layout
            className="flex w-12 h-12 rounded items-center justify-center text-white bg-[#94A6FF] border-[1.8px] border-black"
            initial={initial}
            animate={animate}
            exit={exit}
            transition={ transition ?? {duration: 0.3} }
        >
            <span className={"text-center truncate px-1 text-xl text-black font-bold"}>
                {value}
            </span>
        </motion.div>
    )
}
