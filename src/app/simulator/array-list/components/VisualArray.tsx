import VisualArrayBox from "@/app/simulator/array-list/components/VisualArrayBox";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

import { ArrayElement } from "./types";

type VisualArrayProps = {
  array: ArrayElement[];
}

export default function VisualArray({ array }: VisualArrayProps) {
  return (
    <div>
      <LayoutGroup>
        <motion.div
          layout
          transition={{ layout: { duration: 0.5 } }}
          className="flex flex-wrap max-w-[308px] md:max-w-[587px] gap-2 px-4 py-4 border-[1.8px] rounded-xl border-[#94A6FF]">
          <AnimatePresence>
            {
              array.map((arrayElem) => (
                <VisualArrayBox key={arrayElem.id} value={arrayElem.value} animationState={arrayElem.animationState} />
              ))
            }
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
