import { motion } from 'framer-motion';
import { FaSchool } from 'react-icons/fa';

export default function Loading() {
  // Animation variants for the loading dots
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dot = {
    hidden: { y: '0%' },
    show: {
      y: ['0%', '-50%', '0%'],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-teal-500/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              x: [0, Math.random() * 20 - 10],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          transition: { 
            type: 'spring',
            stiffness: 100,
            damping: 10
          } 
        }}
        className="relative z-10 text-center p-8 rounded-2xl bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 shadow-2xl"
      >
        <div className="inline-block relative">
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              y: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
              rotate: {
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
            }}
            className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 mb-6"
          >
            <FaSchool />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            transition: { 
              delay: 0.2,
              type: 'spring',
              stiffness: 100
            } 
          }}
        >
          Dina Public School
        </motion.h1>
        
        <motion.p 
          className="text-gray-300 text-lg mt-4 mb-6 flex items-center justify-center gap-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span variants={dot} className="inline-block w-2 h-2 rounded-full bg-teal-400 mx-0.5"></motion.span>
          <motion.span variants={dot} className="inline-block w-2 h-2 rounded-full bg-teal-400 mx-0.5"></motion.span>
          <motion.span variants={dot} className="inline-block w-2 h-2 rounded-full bg-teal-400 mx-0.5"></motion.span>
        </motion.p>
        
        <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
            initial={{ width: '20%' }}
            animate={{ 
              width: ['20%', '80%', '20%'],
              x: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        
        <motion.p 
          className="text-sm text-gray-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 0.5 }
          }}
        >
          Preparing your experience
        </motion.p>
      </motion.div>
    </div>
  );
}