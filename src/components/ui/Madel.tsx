import type { ModalProps } from '@/types';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom'; // 1. استيراد createPortal
import { useEffect, useState } from 'react';

const Modal = ({ children, onClose, className = "" }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // تأكد من أننا في بيئة المتصفح (client-side)
  if (!mounted || typeof document === "undefined") return null;

  // 2. استخدام createPortal لنقل العنصر إلى document.body
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
        className={`bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </motion.div>
    </div>,
    document.body // هذا سيجعل المودال ابناً مباشراً للـ body وليس للـ BoxCard
  );
};

export default Modal;