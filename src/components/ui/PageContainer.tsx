import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface PageContainerProps {
  title: string;
  about?: string;
  children: ReactNode;
  action?: ReactNode;
}

const PageContainer = ({ title, about, children, action }: PageContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 pb-10">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative w-full px-4 md:px-8 pt-6 md:pt-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              {/* Title with Gradient & Icon */}
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-200/50"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {title}
                </h1>
              </div>

              {/* Subtitle */}
              {about && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-base md:text-lg max-w-2xl"
                >
                  {about}
                </motion.p>
              )}
            </div>

            {/* Action Buttons */}
            {action && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                {action}
              </motion.div>
            )}
          </div>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full mt-6 origin-left"
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default PageContainer;