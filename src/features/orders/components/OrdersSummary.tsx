 
import BoxCard from "@/components/ui/BoxCard";
import { statuses } from "@/features/orders/constants/ordersStatusIcons";
import type { orders } from "@/types";
 import { useTranslation } from 'react-i18next'



const OrdersSummary = ({ Allorders = [] }: {Allorders: orders[] | []}) => {
    const { t } = useTranslation("order");
    
    const getStatusData = (statusKey: string) => {
        const filtered = Allorders.filter(order => order.status === statusKey)
        const total = filtered.length
        return { total }
    }
    return (
        <BoxCard
            about={t("OrdersSummary")}
        >
            <div
                className='flex flex-wrap gap-4'
            >
                {statuses.map((status, i) => {
                    const { total } = getStatusData(status.key)
                    return (
                        <div
                            key={i}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 md:px-3 md:py-1.5 text-xs font-medium rounded-lg border ${status.color} ring-2 ring-offset-2`}>
                            {status.icon}
                            ( {total} ) {t(status.label)}
                        </div>
                    )
                })}
            </div>
        </BoxCard>

    )
}

export default OrdersSummary