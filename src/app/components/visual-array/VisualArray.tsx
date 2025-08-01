import VisualArrayBox from "@/app/components/visual-array/VisualArrayBox";
import {AnimatePresence} from "framer-motion";

import {ArrayElement} from "./types";

type VisualArrayProps = {
    array: ArrayElement[];
}

export default function VisualArray({ array }: VisualArrayProps) {
    return (
        <div className="flex flex-wrap max-w-[308px] md:max-w-[587px] gap-2 px-4 py-4 border-[1.8px] rounded-xl border-[#94A6FF]">
            <AnimatePresence>
                {
                    array.map((arrayElem) => (
                        <VisualArrayBox key={arrayElem.id} value={arrayElem.value} animationState={arrayElem.animationState}/>
                    ))
                }
            </AnimatePresence>
        </div>
    );
}
