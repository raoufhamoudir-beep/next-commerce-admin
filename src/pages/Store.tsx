"use client";
import PageContainer from '@/components/ui/PageContainer';
import { useOrders } from '@/features/orders/hooks/useOrders';
import Stats from '@/features/store/components/Stats';
import StatusSummary from '@/features/store/components/StatusSummary';
import Visits from '@/features/store/components/Visits';
import { useStore } from '@/features/store/hooks/UseStore';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const Store = () => {
      const { t } = useTranslation("store"); 
    const { id } = useParams();
    // 1. Rename alias to storeData to avoid naming conflicts if needed, but 'store' is fine
    const { data: store } = useStore(id);
    
    // 2. orders will be 'orders[] | undefined'
    const { data: orders } = useOrders(id);

    return (
        <PageContainer
            about={store?.storeName}
            title={t("dashboard")}
        >
            {/* FIX: Add '|| []' to handle the undefined loading state */}
            <Stats orders={orders || []} visit={0} /> 
            
            <Visits visit={[]} />
            
            {/* FIX: Add '|| []' here too */}
            <StatusSummary orders={orders || []} />
        </PageContainer>
    );
}

export default Store;