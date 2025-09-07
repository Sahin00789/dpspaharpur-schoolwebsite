import { motion } from 'framer-motion';
import { FaSchool } from 'react-icons/fa';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-block relative">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="text-6xl text-teal-400 mb-4"
          >
            <FaSchool />
          </motion.div>
          
          <motion.div
            className="absolute -inset-2 border-4 border-teal-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1.5, 1],
              opacity: [0.5, 1, 0.5, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </div>
        
        <motion.h1 
          className="text-2xl font-bold text-white mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Dina Public School
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 mt-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading...
        </motion.p>
        
        <motion.div 
          className="h-1 bg-gray-800 rounded-full mt-6 w-48 mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div 
            className="h-full bg-teal-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
