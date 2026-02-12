import { useState, useEffect, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { 
  Loader2, 
  Phone, 
  Facebook, 
  Instagram, 
  MessageCircle, // For WhatsApp
  Music2, // For TikTok (Substitute)
} from 'lucide-react';

// Components & Hooks
import BoxCard from '@/components/ui/BoxCard';
import { useStore } from '@/features/store/hooks/UseStore';
import { useUpdateStore } from '@/features/admin/hook/useStoreManagement';
import type { Store } from '@/types';
import SaveModal from '@/components/ui/SaveModal';

// Interface for local state
interface ContactInfoState {
  phone: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  whatsapp: string;
}

const UpdateContactInfo = () => {
  const { t } = useTranslation("store"); // 👈 load dashboard.json
  const { id } = useParams();

  // 1. Fetch Store Data
  const { data: store, isLoading: isStoreLoading } = useStore(id);

  // 2. Mutation Hook
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  // 3. Local State
  const [contactInfo, setContactInfo] = useState<ContactInfoState>({
    phone: "",
    instagram: "",
    tiktok: "",
    facebook: "",
    whatsapp: ""
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  // 4. ✅ SYNC LOGIC: Update local state when API data arrives
  useEffect(() => {
    if (store?.contacts) {
      setContactInfo({
        phone: store.contacts.phone || "",
        instagram: store.contacts.instagram || "",
        tiktok: store.contacts.tiktok || "",
        facebook: store.contacts.facebook || "",
        whatsapp: store.contacts.whatsapp || ""
      });
    }
  }, [store]);

  // Handle Input Changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  // Handle Save
  const handleSave = () => {
    if (!store || !id) return;

    if (!hasChanges) {
      toast(t("No changes detected"), { icon: "ℹ️" });
      return;
    }

    // Construct Payload
    const payload: Store = {
      ...store,
      contacts: contactInfo
    };

    updateStore(
      { id: id, data: payload },
      {
        onSuccess: () => {
          toast.success(t("Contact info updated successfully"));
          setHasChanges(false);
        },
        onError: () => {
          toast.error(t("Failed to update contact info"));
        }
      }
    );
  };

  if (isStoreLoading) {
    return (
      <BoxCard about={t("ContactInfo")} small={true} className="py-1">
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      </BoxCard>
    );
  }

  return (
    <BoxCard about={t("ContactInfo")} small={true} className="py-1">
      <div className="space-y-6">
        
        {/* Helper Text */}
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t("contactInfoDesc") || "Manage how your customers can reach you via social media and phone."}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* 1. Phone Number */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Phone className="w-4 h-4 text-gray-400" />
              {t("PhoneNumber")}
            </label>
            <input
              type="tel"
              name="phone"
              value={contactInfo.phone}
              onChange={handleChange}
              placeholder="+213 555 ..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* 2. WhatsApp */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MessageCircle className="w-4 h-4 text-green-500" />
              {t("WhatsApp")}
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={contactInfo.whatsapp}
              onChange={handleChange}
              placeholder="WhatsApp Number"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* 3. Facebook */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Facebook className="w-4 h-4 text-blue-600" />
              {t("Facebook")}
            </label>
            <input
              type="text"
              name="facebook"
              value={contactInfo.facebook}
              onChange={handleChange}
              placeholder="Facebook Username / URL"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* 4. Instagram */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Instagram className="w-4 h-4 text-pink-600" />
              {t("Instagram")}
            </label>
            <input
              type="text"
              name="instagram"
              value={contactInfo.instagram}
              onChange={handleChange}
              placeholder="Instagram Username"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* 5. TikTok */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Music2 className="w-4 h-4 text-black" />
              {t("TikTok")}
            </label>
            <input
              type="text"
              name="tiktok"
              value={contactInfo.tiktok}
              onChange={handleChange}
              placeholder="TikTok Username"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

        </div>

        {/* Action Button */}
       <SaveModal
     isDirty={hasChanges}
     handleSave={handleSave}
     isSaving={isPending}
     />

      </div>
    </BoxCard>
  );
};

export default UpdateContactInfo;