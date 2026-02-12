import { Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom'; // 1. استيراد البورتال
import { useEffect, useState } from 'react';

interface SaveModalProps {
  isDirty: boolean;
  isSaving: boolean;
  handleSave: () => void;
  onReset?: () => void;
}

const SaveModal = ({ isDirty, isSaving, handleSave, onReset }: SaveModalProps) => {
  const { t } = useTranslation("Delivery");
  const [mounted, setMounted] = useState(false);

  // التأكد من أن المكون مرسوم على المتصفح لتجنب مشاكل الـ SSR
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  // 2. استخدام createPortal لنقل المحتوى إلى نهاية الـ body
  return createPortal(
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          // القيمة fixed هنا ستعمل الآن بالنسبة للشاشة بالكامل
          className="fixed bottom-8 left-0 right-0 z-[999999] flex justify-center pointer-events-none px-4"
        >
          <div className="pointer-events-auto flex items-center gap-6 bg-gray-950/90 backdrop-blur-2xl text-white pl-6 pr-2 py-2.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
            
            {/* Status Section */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </div>
              <p className="text-sm font-bold text-gray-100 uppercase tracking-wider">
                {t("Unsaved Changes")}
              </p>
            </div>

            {/* Separator Line */}
            <div className="h-6 w-[1px] bg-white/10" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              {onReset && (
                <button
                  onClick={onReset}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors disabled:opacity-0"
                >
                  {t("Discard")}
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-xl font-black text-sm transition-all
                  ${isSaving 
                    ? "bg-gray-800 text-gray-500" 
                    : "bg-white text-black hover:bg-teal-400 hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"}
                `}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? t("Saving...") : t("Save")}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body // يتم الحقن هنا
  );
};

export default SaveModal;