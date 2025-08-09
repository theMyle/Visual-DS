"use client";
import { motion, Variants } from "framer-motion";
import HomeItem from "@/app/components/HomeItem";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function App() {
  return (
    <motion.div
      className="flex flex-col gap-12 justify-center items-center py-12 mx-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.h1
        className="text-[28px] leading-tight text-center font-bold"
        variants={itemVariants}
      >
        Learn Data Structures Interactively
      </motion.h1>

      <motion.p
        className="text-center text-[17px] text-gray-600 leading-relaxed"
        variants={itemVariants}
      >
        Explore, experiment, and master concepts through our interactive
        simulator and bite-sized lessons.
      </motion.p>

      <motion.div className="flex flex-col gap-12 w-full max-w-3xl" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <HomeItem
            title="Lessons"
            description="Dive deep into the core of data structures with clear, structured lessons. Learn about the fundamental properties and operations of various structures, forming the essential foundation for your understanding."
            path="/lesson"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <HomeItem
            title="Simulator"
            description="Experience data structures in action! Our dedicated simulator allows you to interact directly with different data structures, performing operations and see instant visual feedback."
            path="/simulator"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <HomeItem
            title="Assessment"
            description="Test your knowledge and track your progress. Our self-assessment modules are built to check your understanding and help you move forward with confidence."
            path="/assessment"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
