import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Phone as PhoneIcon } from 'lucide-react';

// UI Components
import BoxCard from '@/components/ui/BoxCard';
import PageContainer from '@/components/ui/PageContainer';

// Hooks
import { useUser } from '@/features/auth/hooks/useUser';
import { useUpdateUser } from '@/features/auth/hooks/useAuthMutations';

const UpdatePhone = () => {
const { t, i18n } = useTranslation("account");
  const isRtl = i18n.language === 'ar';  const { data: user } = useUser();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const [newPhone, setNewPhone] = useState("");

  // Validation: Button is disabled if input is empty, matching current phone, or saving
  const isButtonDisabled = !newPhone || newPhone === user?.phone || isPending;

  const handleSubmit = () => {
    if (!user) return;
    
    // Merge current user data with the new phone number
    updateUser({ 
      data: { ...user, phone: newPhone } 
    });
  };

 return (
    <PageContainer  title={t("Modify")} about={t("phonenumber")}>
      <BoxCard 
      about=''
      className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            {t("Currentphonenumber")}
          </label>
          <div className="relative">
            <input
              type="tel"
              disabled
              value={user?.phone || ""}
              className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
            />
            <PhoneIcon className={`absolute top-2.5 h-5 w-5 text-gray-400 ${isRtl ? "left-3" : "right-3"}`} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            {t("newphonenumber")}
          </label>
          <input
            type="tel"
            name="newPhone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder={t("EnterNewPhone")}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-start"
          />
        </div>

        <button
          disabled={isButtonDisabled}
          onClick={handleSubmit}
          className={`w-full flex justify-center items-center py-2.5 rounded-xl text-white font-medium
            ${isButtonDisabled ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700 shadow-md"}
          `}
        >
          {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : t("Confirm")}
        </button>
      </BoxCard>
    </PageContainer>
  );
};

export default UpdatePhone;