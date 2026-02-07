import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  imagePreview: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isPending, imagePreview }: ConfirmationModalProps) => {
  const { t } = useTranslation("subscriptions");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-scale-in">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("Receipt Uploaded Successfully!")}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {t("We have received your payment proof. Click send to finalize your subscription request.")}
          </p>

          {imagePreview && (
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              <img
                src={imagePreview}
                alt="Receipt Preview"
                className="w-full h-32 object-contain py-2"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none transition-colors"
              disabled={isPending}
            >
              {t("Cancel")}
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 focus:outline-none transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  {t("Sending...")}
                </>
              ) : (
                <>
                  {t("Send & Finish")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;