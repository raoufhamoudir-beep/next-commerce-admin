import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, User as UserIcon } from 'lucide-react';

import BoxCard from '@/components/ui/BoxCard';
import PageContainer from '@/components/ui/PageContainer';
import { useUser } from '@/features/auth/hooks/useUser';
import { useUpdateUser } from '@/features/auth/hooks/useAuthMutations';

const UpdateName = () => {
  const { t, i18n } = useTranslation("account");
  const isRtl = i18n.language === 'ar';
  
  const { data: user } = useUser();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const [newName, setNewName] = useState("");

  const isButtonDisabled = !newName || newName === user?.name || isPending;

  const handleSubmit = () => {
    if (!user) return;
    updateUser({ 
      data: { ...user, name: newName } 
    });
  };

  return (
    <PageContainer
      title={t("modify_title")}
      about={t("name_attribute")}
    >
      <BoxCard
      about=''
      className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        
        {/* Current Name Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            {t("current_name_label")}
          </label>
          <div className="relative">
            <input
              type="text"
              disabled
              value={user?.name || ""}
              className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
            />
            {/* Logic to flip icon position */}
            <UserIcon className={`absolute top-2.5 h-5 w-5 text-gray-400 ${isRtl ? "left-3" : "right-3"}`} />
          </div>
        </div>

        {/* New Name Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            {t("new_name_label")}
          </label>
          <input
            type="text"
            name="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("enter_name_placeholder")}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Action Button */}
        <button
          disabled={isButtonDisabled}
          onClick={handleSubmit}
          className={`
            w-full flex justify-center items-center py-2.5 rounded-xl text-white font-medium transition-all duration-200
            ${isButtonDisabled 
              ? "bg-gray-400 cursor-not-allowed opacity-70" 
              : "bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
            }
          `}
        >
          {isPending ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            t("confirm_button")
          )}
        </button>

      </BoxCard>
    </PageContainer>
  );
};

export default UpdateName;