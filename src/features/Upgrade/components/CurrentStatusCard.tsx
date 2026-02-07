import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface CurrentStatusCardProps {
  isPaid: boolean;
}

const CurrentStatusCard = ({ isPaid }: CurrentStatusCardProps) => {
    const { t } = useTranslation("subscriptions");

  return (
    <div className={`relative my-5 overflow-hidden rounded-2xl border p-8 shadow-sm transition-all ${
      isPaid ? 'bg-teal-50 border-teal-200' : 'bg-white border-purple-100'
    }`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Status Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {t('subscriptions.current_status.title')}
          </h2>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isPaid ? 'bg-teal-100 text-teal-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {isPaid ? t('subscriptions.current_status.active') : t('subscriptions.current_status.free')}
            </span>
            
            {isPaid && (
              <span className="text-sm text-teal-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {t('subscriptions.current_status.all_set')}
              </span>
            )}
          </div>

          {!isPaid && (
            <p className="mt-2 text-gray-500 text-sm max-w-md">
              {t('subscriptions.current_status.upgrade_text')}
            </p>
          )}
        </div>

        {/* Upgrade Button (Only visible if not paid) */}
        {!isPaid && (
          <Link
            to="/upgrade"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>{t('subscriptions.current_status.upgrade_btn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default CurrentStatusCard;