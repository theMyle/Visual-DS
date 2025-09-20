"use client";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import HomeItem from "@/app/components/HomeItem";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform values for parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const cardsY = useTransform(scrollYProgress, [0.3, 1], ["100%", "0%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section - Full Viewport */}
      <motion.section
        className="sticky top-0 flex flex-col justify-center items-center h-screen px-6 lg:px-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        style={{ 
          y: heroY,
          opacity: heroOpacity
        }}
      >
        <motion.div 
          className="text-center max-w-4xl lg:max-w-6xl z-10"
          variants={heroVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="text-[32px] md:text-[48px] lg:text-[64px] xl:text-[72px] leading-tight text-center font-bold mb-6 lg:mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Learn Data Structures Interactively
          </motion.h1>

          <motion.p
            className="text-center text-[18px] md:text-[22px] lg:text-[28px] text-gray-600 leading-relaxed max-w-3xl lg:max-w-5xl mx-auto mb-8"
            variants={itemVariants}
          >
            Explore, experiment, and master concepts through our interactive
            simulator and bite-sized lessons.
          </motion.p>

          <motion.div
            className="flex justify-center"
            variants={itemVariants}
          >
            <button
              onClick={() => {
                document.getElementById('cards-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </motion.section>

      {/* Cards Section - Slides up over hero */}
      <motion.section
        id="cards-section"
        className="relative z-20 min-h-screen py-12 md:py-16 lg:py-20 px-6 lg:px-12 bg-white rounded-t-3xl shadow-2xl"
        style={{ y: cardsY }}
      >
        <motion.div 
          className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-full max-w-6xl lg:max-w-7xl md:items-stretch mx-auto" 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
        <motion.div variants={itemVariants} className="h-full">
          <HomeItem
            title="Lessons"
            description="Dive deep into the core of data structures with clear, structured lessons. Learn about the fundamental properties and operations of various structures, forming the essential foundation for your understanding."
            path="/lesson"
          />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
          <HomeItem
            title="Simulator"
            description="Experience data structures in action! Our dedicated simulator allows you to interact directly with different data structures, performing operations and see instant visual feedback."
            path="/simulator"
          />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1 h-full">
          <HomeItem
            title="Assessment"
            description="Test your knowledge and track your progress. Our self-assessment modules are built to check your understanding and help you move forward with confidence."
            path="/assessment"
          />
        </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
