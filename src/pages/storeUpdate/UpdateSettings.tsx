import { useState, useEffect, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Loader2, Settings, Globe, Truck } from 'lucide-react';
import { useParams } from 'react-router-dom';

// UI Components
import BoxCard from '@/components/ui/BoxCard';

// Hooks
import { useUpdateStore } from '@/features/admin/hook/useStoreManagement';
import { useStore } from '@/features/store/hooks/UseStore';
import SaveModal from '@/components/ui/SaveModal';

interface StoreSettingsState {
    storeName: string;
    language: string;
    enableBureau: boolean;
}

const UpdateSettings = () => {
    const { t } = useTranslation("store");
    const { id } = useParams();

    // 1. Fetch Store Data
    const { data: store, isLoading: isStoreLoading } = useStore(id);
  
    // 2. Mutation Hook
    const { mutate: updateStore, isPending } = useUpdateStore(id || "");

    // 3. Local State
    const [settings, setSettings] = useState<StoreSettingsState>({
        storeName: "",
        language: "ar",
        enableBureau: false,
    });
    
    const [hasChanges, setHasChanges] = useState(false);

    // 4. ✅ SYNC LOGIC: Update local state when API data arrives
    useEffect(() => {
        if (store) {
            setSettings({
                // Handle naming differences between Backend (snake_case) and Frontend (camelCase)
                storeName: store.storeName || "", 
                language: store.language || "ar",
                // Ensure boolean fallback
                enableBureau: store.enableBureau ?? false, 
            });
        }
    }, [store]);

    // Handle Text/Select Changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
        setHasChanges(true);
    };

    // Handle Checkbox Changes
    const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSettings((prev) => ({ ...prev, [name]: checked }));
        setHasChanges(true);
    };

    // Handle Save
    const handleSave = () => {
        if (!store || !id) return;

        if (!hasChanges) {
            toast("No changes detected", { icon: "ℹ️" });
            return;
        }

        // Construct Payload (Map back to Backend format)
        const payload = {
            ...store,
            storeName: settings.storeName,   // Backend expects store_name
            language: settings.language,
            enableBureau: settings.enableBureau, // Backend expects EnableBerue
        };

        updateStore(
            { id: id, data: payload },
            {
                onSuccess: () => {
                    toast.success(t("Settings updated successfully"));
                    setHasChanges(false);
                },
                onError: () => {
                    toast.error(t("Failed to update settings"));
                }
            }
        );
    };

    if (isStoreLoading) {
        return (
            <BoxCard about={t("StoreSettings")} small={true} className="py-1">
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
                </div>
            </BoxCard>
        );
    }

    return (
        <BoxCard 
            about={t("StoreSettings")} 
            small={true} 
            className="py-1"
        >
            <div className="space-y-4">
                <div className="border-t border-gray-100 pt-5 space-y-5">
                    
                    {/* 1. Store Name */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Settings className="w-4 h-4 text-gray-400" />
                            {t("StoreName")}
                        </label>
                        <input
                            type="text"
                            name="storeName" 
                            value={settings.storeName}
                            onChange={handleChange}
                            placeholder="Enter store name"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        />
                    </div>

                    {/* 2. Language Select */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Globe className="w-4 h-4 text-gray-400" />
                            {t("ChooseStoreLanguage")}
                        </label>
                        <div className="relative">
                            <select
                                name="language"
                                value={settings.language}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none bg-white"
                            >
                                <option value="ar">Arabic (العربية)</option>
                                <option value="en">English</option>
                                <option value="fr">French (Français)</option>
                            </select>
                            {/* Custom Arrow for select */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* 3. Delivery Toggle */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                <Truck className="w-4 h-4 text-gray-400" />
                                <span>
                                    {t("Enable")} <span className="text-teal-600 font-bold">{t("Delevryto")}</span> {t("Theberue")}
                                </span>
                            </span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enableBureau"
                                    checked={settings.enableBureau}
                                    onChange={handleToggle}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                            </div>
                        </label>
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

export default UpdateSettings;