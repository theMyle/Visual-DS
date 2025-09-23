"use client";
import { motion, AnimatePresence } from "framer-motion";
import { StackElement } from "@/app/simulator/stack/components/types";
import VisualStackBox from "@/app/simulator/stack/components/VisualStackBox";

interface VisualStackProps {
  stack: StackElement[];
}

export default function VisualStack({ stack }: VisualStackProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden">
      {/* Title */}
      <div className="flex-shrink-0 mb-2 md:mb-4">
        <h1 className="text-base md:text-xl font-semibold text-gray-600 text-center">
          Stack Data Structure
        </h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-end w-full max-w-md h-full overflow-hidden relative">
        <div className="flex-1 flex flex-col justify-end items-center overflow-y-auto h-full py-2 md:py-4">
          <div className="flex flex-col gap-1 md:gap-1.5 items-center w-full">
            <AnimatePresence>
              {stack.map((element, index) => (
                <VisualStackBox
                  key={element.id}
                  element={element}
                  index={index}
                />
              ))}
            </AnimatePresence>
            {/* Invisible placeholder to prevent layout shifts - always present */}
            <div className="invisible w-32 h-[1px] md:w-48" />
          </div>
        </div>
        
        {/* Empty message - absolutely positioned to not affect layout */}
        <AnimatePresence>
          {stack.length === 0 && (
            <motion.div
              key="empty-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm md:text-lg font-medium pointer-events-none"
            >
              Stack is empty
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Base/Bottom indicator - always at the bottom */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gray-400 rounded-full"></div>
          <div className="text-gray-600 text-xs font-medium mt-1">BOTTOM</div>
        </div>
      </div>
    </div>
  );
}