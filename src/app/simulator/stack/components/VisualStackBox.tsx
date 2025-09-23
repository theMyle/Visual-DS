"use client";
import { motion } from "framer-motion";
import { StackElement, StackElementAnimationState } from "@/app/simulator/stack/components/types";

interface VisualStackBoxProps {
  element: StackElement;
  index: number;
}

export default function VisualStackBox({ element, index }: VisualStackBoxProps) {
  const getAnimationProps = () => {
    switch (element.animationState) {
      case StackElementAnimationState.NewPushed:
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.2, ease: "easeOut" as const }
        };
      case StackElementAnimationState.Popping:
        return {
          animate: { y: -40, opacity: 0 },
          transition: { duration: 0.5, ease: "easeInOut" as const }
        };
      case StackElementAnimationState.HighlightedGreen:
        return {
          animate: { y: -8 },
          transition: { duration: 0.3, ease: "easeInOut" as const }
        };
      case StackElementAnimationState.HighlightedOrange:
        return {
          animate: { y: -6 },
          transition: { duration: 0.3, ease: "easeInOut" as const }
        };
      default:
        return {
          animate: { scale: 1, y: 0, opacity: 1 },
          transition: { duration: 0.3, ease: "easeInOut" as const }
        };
    }
  };

  const getBackgroundColor = () => {
    switch (element.animationState) {
      case StackElementAnimationState.HighlightedOrange:
        return "bg-orange-300";
      case StackElementAnimationState.HighlightedGreen:
        return "bg-green-300";
      case StackElementAnimationState.Popping:
        return "bg-red-400";
      default:
        return "bg-[#94A6FF]";
    }
  };

  return (
    <motion.div
      key={element.id}
      className={`
        w-24 h-6 md:w-48 md:h-12 
        ${getBackgroundColor()}
        text-white font-bold text-xs md:text-lg
        rounded items-center justify-center
        border-[1.8px] border-black
        flex
        relative
      `}
      {...getAnimationProps()}
    >
      {element.value}
    </motion.div>
  );
}