import BoxCard from '@/components/ui/BoxCard';
import type { orders } from '@/types';
import { useTranslation } from 'react-i18next';

interface StatsProps {
    orders: orders[]; // Simplified type
    visit: number;
}

const Stats = ({ orders = [], visit }: StatsProps) => {
    const { t } = useTranslation("store"); 
    
    // Filter Lists
  const ConfirmedOrder = orders.filter(
  e =>
    e.status !== undefined &&
    ["confirmed", "ready", "in company"].includes(e.status)
);

    
   const PendingOrder = orders.filter(
  e =>
    e.status !== undefined &&
    [
      "pending",
      "Connection failed 1",
      "Connection failed 2",
      "Connection failed 3",
      "Postponed",
    ].includes(e.status)
);
    // Calculate Earnings using reduce (Cleaner & Faster)
    const totalEarnings = ConfirmedOrder.reduce((acc, curr) => acc + (curr.price || 0), 0);

    return (
        <BoxCard about={t('Overview')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Sold Products */}
                <div className="bg-purple-100 border border-purple-200 rounded-xl p-4 ring-white text-center">
                    <p className="text-sm text-gray-600">{t("SoldProducts")}</p>
                    <p className="text-xl font-bold text-gray-800">
                        {ConfirmedOrder.length}
                    </p>
                </div>

                {/* New Orders */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">{t("NewOrders")}</p>
                    <p className="text-xl font-bold text-gray-800">
                        {PendingOrder.length}
                    </p>
                </div>

                {/* Visits */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">{t("Visits")}</p>
                    <p className="text-xl font-bold text-gray-800">
                        {visit}
                    </p>
                </div>

                {/* Earnings */}
                <div className="bg-green-100 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">{t("Earnings")}</p>
                    <p className="text-xl font-bold text-gray-800">
                        {totalEarnings} DA
                    </p>
                </div>
            </div>
        </BoxCard>
    );
};

export default Stats;