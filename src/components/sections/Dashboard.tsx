import React from 'react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="h-full flex flex-col items-center justify-center text-center px-4 md:px-20 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl relative z-10">
        {/* Top Badge */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary border border-border mb-12"
        >
          <span className="text-[10px] md:text-xs font-medium tracking-tight text-muted-foreground">
            Introducing Lexalyse: Elevating legal research and identifying critical precedents.
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-9xl font-serif font-bold tracking-tighter text-foreground mb-6"
        >
          Lexalyse
        </motion.h1>

        {/* Sub Heading */}
        <motion.h2 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-4xl font-serif italic text-muted-foreground mb-12"
        >
          AI Powered Legal Intelligence
        </motion.h2>

        {/* Motivational Text */}
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light mb-16"
        >
          Empowering law students and professors to navigate the complexities of jurisprudence with precision and speed. 
          Bridging the gap between traditional legal research and modern AI intelligence, we provide the clarity needed to master the law.
        </motion.p>
      </div>
    </motion.div>
  );
};
