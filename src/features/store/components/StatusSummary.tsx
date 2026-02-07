import BoxCard from '@/components/ui/BoxCard';
import { statuses } from '@/features/orders/constants/ordersStatusIcons';
import type { orders } from '@/types'
 import { useTranslation } from 'react-i18next';

const StatusSummary = ({orders = []}: {orders : [] | orders[] | undefined}) => {
   const { t } = useTranslation("store"); // 👈 load dashboard.json
 
    
    const getStatusData = (statusKey: string) => {
        const filtered = orders.filter(order => order.status === statusKey)
        const total = filtered.length
        const value = filtered.reduce((sum, order) => sum + (order.price || 0), 0)
        return { total, value }
    }

    return (
        <BoxCard about={t("OrderSummary")} link={'orders'} >


            {/* Header */}


            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-gray-500 border-b border-b-[#eee]">
                        <tr>
                            <th className="px-4 py-2">{t("Status")}</th>
                            <th className="px-4 py-2">{t("Total")}</th>
                            <th className="px-4 py-2">{t("Value")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.map((status, i) => {
                            const { total, value } = getStatusData(status.key)
                            return (
                                <tr key={i} className="border-b last:border-0 border-b-[#eee]">
                                    {/* Status */}
                                    <td className="px-4 py-2">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${status.color} ring-2 ring-offset-2`}>
                                            {status.icon}
                                            {t(status.label)}
                                        </span>
                                    </td>
                                    {/* Total */}
                                    <td className="px-4 py-2">{total}</td>
                                    {/* Value */}
                                    <td className="px-4 py-2">{value} DA</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </BoxCard>

    )
}
export default StatusSummary