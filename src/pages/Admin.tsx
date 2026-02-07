import { useUser } from '@/features/auth/hooks/useUser';
import type { UserStore } from '@/types'; // Ensure this type is defined in your project
import { Plus  } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
import toast, {Toaster} from "react-hot-toast";
import PageContainer from '@/components/ui/PageContainer';
import StoreCard from '@/features/admin/components/StoreCard';
import { useTranslation } from 'react-i18next';

const Admin = () => {
  const { data } = useUser();
    const navigate = useNavigate();
   const { t } = useTranslation("account");
 
  const userStores: UserStore[] = data?.Stores || [];
  // const userName = data?.name || "Merchant"; // Fallback name
const NewStore = () => {
  // Use ?? 0 to ensure length is at least 0 if data/Stores is missing
  const storeCount = data?.Stores?.length ?? 0;

  if (storeCount  < 2) {
    navigate('/store/new');
    return;
  }

  if (!data?.isPaid && storeCount > 1) {
    toast.error(t("you hit the max stores in free trail"));
  }
};
  return (
      
     
<PageContainer
title={t(`Dashboard`)}
about={t(`Manage your stores or launch a new venture.`)}
>
      <Toaster />

       

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Create New Store Card (Primary Action) */}
          

            {/* Existing Stores List */}
            {userStores.map((store) => (
              <StoreCard store={store} key={store.id} />
            ))}
              <div 
             onClick={NewStore} 
             className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-purple-200 hover:border-teal-400 bg-white/50 hover:bg-purple-50/30 transition-all duration-300 cursor-pointer min-h-[260px]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-50 group-hover:shadow-lg group-hover:shadow-teal-200/50 transition-all duration-300">
                <Plus className="w-8 h-8 text-purple-600 group-hover:text-teal-600 transition-colors" />
              </div>
              
              <h3 className="relative z-10 text-lg font-semibold text-gray-800 group-hover:text-purple-700">
               {t("Add New Store")}
              </h3>
              <p className="relative z-10 text-sm text-gray-400 mt-2 text-center max-w-[150px]">
                {t("Create a new brand and start selling today.")}
              </p>
            </div>
          </div>
       
    
   </PageContainer>
    
  );
};

export default Admin;