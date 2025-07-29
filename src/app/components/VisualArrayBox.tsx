
import { motion } from "framer-motion";
import {ArrayElement} from "@/app/types/VisualArrayTypes";

type VisualArrayBoxProps = {
    value: string | number,
}

export default function VisualArrayBox({value}: VisualArrayBoxProps) {
    return (
        <motion.div
            layout
            className="w-12 h-12 rounded flex items-center justify-center text-white bg-blue-500 "
            initial={{opacity: 0, scale: 0.5}}
            animate={{opacity:1 , scale: 1}}
            exit={{opacity: 0, scale: 0.7, backgroundColor: "#ef4444" }}
            transition={{
                duration: 0.3,
            }}
        >
            {value}
        </motion.div>
    )
}