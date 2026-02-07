import { useTranslation } from 'react-i18next';
import type { PlanOffer } from '@/types';
import StatusBadge from '@/features/Upgrade/components/StatusBadge';

interface SubscriptionTableProps {
  offers?: PlanOffer[];
}

const SubscriptionTable = ({ offers }: SubscriptionTableProps) => {
    const { t } = useTranslation("subscriptions");

  return (
     

    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-800">{t('subscriptions.history.title')}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium text-right">{t('subscriptions.history.table.status')}</th>
              <th className="px-6 py-4 font-medium">{t('subscriptions.history.table.duration')}</th>
              <th className="px-6 py-4 font-medium">{t('subscriptions.history.table.date')}</th>
              <th className="px-6 py-4 font-medium">{t('subscriptions.history.table.amount')}</th>
              <th className="px-6 py-4 font-medium">{t('subscriptions.history.table.details')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {offers && offers.length > 0 ? (
              offers.map((offer) => (
                <tr key={offer._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-right">
                    <StatusBadge status={offer.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {offer.offerTitle}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(offer.createdAt).toLocaleDateString()}
                    <span className="block text-xs text-gray-400">
                      {new Date(offer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {offer.price.toLocaleString()} DZD
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{offer.offerTitle}</div>
                    <div className="text-xs text-gray-400">
                      {t('subscriptions.history.table.id_label')} {offer._id.slice(-6)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  {t('subscriptions.history.table.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionTable;