"use client";
import { motion } from "framer-motion";
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
      
      <div className="flex-1 flex flex-col items-center justify-end w-full max-w-md h-full overflow-hidden">
        <div className="flex-1 flex flex-col justify-end items-center overflow-y-auto h-full py-2 md:py-4">
          {stack.length === 0 ? (
            <div className="text-gray-500 text-sm md:text-lg font-medium mb-4 md:mb-8">
              Stack is empty
            </div>
          ) : (
            <motion.div 
              className="flex flex-col gap-1 md:gap-1.5 items-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {stack.map((element, index) => (
                <VisualStackBox
                  key={element.id}
                  element={element}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Base/Bottom indicator - always at the bottom */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gray-400 rounded-full"></div>
          <div className="text-gray-600 text-xs font-medium mt-1">BOTTOM</div>
        </div>
      </div>
    </div>
  );
}