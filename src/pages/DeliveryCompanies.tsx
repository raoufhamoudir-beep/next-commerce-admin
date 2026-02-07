import PageContainer from '@/components/ui/PageContainer';
import DeliveryCompaniesContainer from '@/features/DeliveryCompanies/components/DelevryComapnesContainer';
import companies from '@/features/DeliveryCompanies/constants/companies';
import { useStore } from '@/features/store/hooks/UseStore';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const DeliveryCompanies = () => {
  const { t } = useTranslation("Delivery");
  const { id } = useParams();
  const { data: store, isLoading } = useStore(id);
  const [isEditing, setIsEditing] = useState(false);

  // Find the company object that matches the user's saved company
  const savedCompanyInfo = companies.find((c) => c.name === store?.deliveryCompany?.name);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
      </div>
    );
  }

  return (
    <PageContainer
      title={t("Delivery Company")}
      about={t("Manage your delivery company settings here. Connect with popular delivery services to streamline your shipping process.")}
    >
      {/* Logic: Show details if a company is selected AND we are not in 'edit/change' mode.
         Otherwise, show the Selector Container.
      */}
      {store?.deliveryCompany?.name && !isEditing ? (
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <div className="flex items-center gap-4">
              {/* Logo Display */}
              {savedCompanyInfo ? (
                <img
                  src={savedCompanyInfo.logo}
                  alt={savedCompanyInfo.name}
                  className="w-16 h-16 object-contain rounded-full border border-gray-200 p-1"
                />
              ) : (
                <div className="w-16 h-16   rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
                  {store?.deliveryCompany?.name?.charAt(0) || "?"}
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                  {store?.deliveryCompany?.name}
                </h2>
                <p className="text-sm text-gray-500">{t("Delivery Partner")}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md active:scale-95"
            >
              <Plus size={18} />
              <span>{t("Change")}</span>
            </button>
          </div>
        </div>
      ) : (
        <DeliveryCompaniesContainer
          id={id}
          
          store={store}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </PageContainer>
  );
};

export default DeliveryCompanies;