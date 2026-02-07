import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

// Components
import PageContainer from '@/components/ui/PageContainer';
import BoxCard from '@/components/ui/BoxCard';


// Hooks
import { useGetMyOffer } from '@/features/Upgrade/hooks/UseOffer';
import { useUser } from '@/features/auth/hooks/useUser';
import CurrentStatusCard from '@/features/Upgrade/components/CurrentStatusCard';
import SubscriptionTable from '@/features/Upgrade/components/SubscriptionTable';

const Subscriptions = () => {
    const { t } = useTranslation("subscriptions");
    const { data: offers, isLoading } = useGetMyOffer();
    const { data: user } = useUser();
    
    // Safety check: Ensure isPaid is boolean (default to false if undefined)
    const isPaid = !!user?.isPaid;

    if (isLoading) {
        return (
            <BoxCard about={t("StoreSettings")} small={true} className="py-1">
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
                </div>
            </BoxCard>
        );
    }

    return (
        <PageContainer
            title={t('subscriptions.title')}
            about={t('subscriptions.sub_title')}
        >
            <div className="w-full space-y-8">
                {/* 1. Status Section */}
                <CurrentStatusCard isPaid={isPaid} />

                {/* 2. History Section */}
                <SubscriptionTable offers={offers} />
            </div>
        </PageContainer>
    );
};

export default Subscriptions;