import  { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertCircle } from 'lucide-react';
import type { faqs } from '@/types';
 
interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: faqs) => void;
  initialData: faqs | null;
}

const FaqFormModal = ({ isOpen, onClose, onSave, initialData }: FaqFormModalProps) => {
  const { t } = useTranslation("store");
  const [form, setForm] = useState({ question: "", answer: "" });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...initialData } : { question: "", answer: "" });
      setError(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (form.question.trim().length < 5 || form.answer.trim().length < 5) {
      setError(true);
      return;
    }
    const id = initialData?.id || Date.now().toString();
    onSave({ id, ...form });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800">{initialData ? t("EditFAQ") : t("AddFAQ")}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Question")}</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 transition-all ${error && form.question.length < 5 ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-teal-500"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Answer")}</label>
            <textarea
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 transition-all ${error && form.answer.length < 5 ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-teal-500"}`}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} /><span>{t("faqsErr")} (Min 5 chars)</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition">{t("Cancel")}</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm">{initialData ? t("Update") : t("Add")}</button>
        </div>
      </div>
    </div>
  );
};

export default FaqFormModal;