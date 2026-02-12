import BoxCard from "@/components/ui/BoxCard";
import Modal from "@/components/ui/Madel";
import PageContainer from "@/components/ui/PageContainer";
import Tutorial from "@/components/ui/Tutorial";
import { useUpdateStore } from "@/features/admin/hook/useStoreManagement";
import { useStore } from "@/features/store/hooks/UseStore";
import type { pixel, Store } from "@/types";
import { Loader2, Trash2, Save } from "lucide-react"; 
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const Pixels = () => {
  const { t } = useTranslation("Delivery");
    const { id } = useParams();
    
    // 1. Fetch Store Data
    const { data: store, isLoading: isStoreLoading } = useStore(id);
    const { mutate: updateStore, isPending } = useUpdateStore(id || "");

    const [showTutorial, setShowTutorial] = useState(false);

    // 2. Local State for Inputs
    const [facebookPixel, setFacebookPixel] = useState<pixel>({ name: "", id: "" });
    const [tiktokPixel, setTiktokPixel] = useState<pixel>({ name: "", id: "" });

    // 3. Handlers
    const handleFacebookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFacebookPixel((prev) => ({ ...prev, [name]: value }));
    };

    const handleTiktokChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTiktokPixel((prev) => ({ ...prev, [name]: value }));
    };

    // Save Logic
    const handleSave = () => {
        if (!store) return;
        
        const newFacebook = facebookPixel.id ? facebookPixel : store.facebookPixel;
        const newTiktok = tiktokPixel.id ? tiktokPixel : store.tiktokPixel;

        const payload: Store = {
            ...store,
            facebookPixel: newFacebook,
            tiktokPixel: newTiktok,
        };

        updateStore({ id: id || "30039", data: payload }, {
            onSuccess: () => {
                setFacebookPixel({ name: "", id: "" });
                setTiktokPixel({ name: "", id: "" });
            }
        });
    };

    // Delete Logic
    const handleDelete = (type: 'facebook' | 'tiktok') => {
        if (!store) return;
        const emptyPixel = { name: "", id: "" };
        
        const payload: Store = {
            ...store,
            facebookPixel: type === 'facebook' ? emptyPixel : store.facebookPixel,
            tiktokPixel: type === 'tiktok' ? emptyPixel : store.tiktokPixel,
        };
        updateStore({ id: id || "30039", data: payload });
    };

    if (isStoreLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="animate-spin text-teal-600 w-10 h-10" />
            </div>
        );
    }

    return (
        <PageContainer
            title={t("add")}
            about={t("Pixel")}
        >
            {showTutorial && (
                <Modal onClose={() => setShowTutorial(false)}>
                    <Tutorial about={"https://firebasestorage.googleapis.com/v0/b/tawssilatrest.appspot.com/o/%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20facebook%20pixel%20%D9%84%D9%85%D9%86%D8%B5%D8%A9%20next%20comerce.mp4?alt=media&token=3bac7bd5-db6e-4a44-842d-0342b18acaa8"} />
                </Modal>
            )}

            {/* ========================================================= */}
            {/* SECTION 1: DISPLAY EXISTING PIXELS (Purple & Teal Tables) */}
            {/* ========================================================= */}
            
            {/* Facebook Pixel (Styled Purple) */}
            {store?.facebookPixel?.id && (
                <BoxCard
                    about={ t("Current Facebook Pixel")}
                    className="bg-white rounded-2xl shadow-sm border-l-4 border-purple-600 p-6"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-purple-50">
                                <tr>
                                    <th className="px-4 py-2 font-semibold text-purple-900">{t("Name")}</th>
                                    <th className="px-4 py-2 font-semibold text-purple-900">{t("PixelID")}</th>
                                    <th className="px-4 py-2 font-semibold text-purple-900 text-right">{t("Action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-purple-100">
                                    <td className="px-4 py-3 text-gray-800">{store.facebookPixel.name}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono bg-purple-50 rounded text-sm">{store.facebookPixel.id}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleDelete('facebook')}
                                            disabled={isPending}
                                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition shadow-sm disabled:opacity-50"
                                        >
                                            {isPending ? <Loader2 className="animate-spin w-4 h-4"/> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </BoxCard>
            )}

            {/* TikTok Pixel (Styled Teal) */}
            {store?.tiktokPixel?.id && (
                <BoxCard
                    about={t("Current TikTok Pixel")}
                    className="bg-white rounded-2xl shadow-sm border-l-4 border-teal-600 p-6"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-teal-50">
                                <tr>
                                    <th className="px-4 py-2 font-semibold text-teal-900">{t("Name")}</th>
                                    <th className="px-4 py-2 font-semibold text-teal-900">{t("PixelID")}</th>
                                    <th className="px-4 py-2 font-semibold text-teal-900 text-right">{t("Action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-teal-100">
                                    <td className="px-4 py-3 text-gray-800">{store.tiktokPixel.name}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono bg-teal-50 rounded text-sm">{store.tiktokPixel.id}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleDelete('tiktok')}
                                            disabled={isPending}
                                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition shadow-sm disabled:opacity-50"
                                        >
                                            {isPending ? <Loader2 className="animate-spin w-4 h-4"/> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </BoxCard>
            )}

            {/* ========================================================= */}
            {/* SECTION 2: INPUT FORMS (Themed Inputs)                    */}
            {/* ========================================================= */}

            {/* Facebook Input - Purple Focus */}
            <BoxCard 
                about={t("Add Facebook Pixel")} 
                className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-purple-100"
            >
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-purple-900 mb-1">{t("PixelName")}</label>
                        <input
                            type="text"
                            name="name"
                            value={facebookPixel.name}
                            onChange={handleFacebookChange}
                            placeholder="My FB Pixel"
                            className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-purple-900 mb-1">{t("PixelID")}</label>
                        <input
                            type="text"
                            name="id"
                            value={facebookPixel.id}
                            onChange={handleFacebookChange}
                            placeholder="e.g. 123456789"
                            className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono transition-all"
                        />
                    </div>
                </div>
            </BoxCard>

            {/* TikTok Input - Teal Focus */}
            <BoxCard 
                about={t("Add TikTok Pixel")} 
                className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-teal-100"
            >
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-teal-900 mb-1">{t("PixelName")}</label>
                        <input
                            type="text"
                            name="name"
                            value={tiktokPixel.name}
                            onChange={handleTiktokChange}
                            placeholder="My TikTok Pixel"
                            className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-teal-900 mb-1">{t("PixelID")}</label>
                        <input
                            type="text"
                            name="id"
                            value={tiktokPixel.id}
                            onChange={handleTiktokChange}
                            placeholder="e.g. C5P..."
                            className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono transition-all"
                        />
                    </div>
                </div>
            </BoxCard>

            {/* Global Save Button - Gradient Teal/Purple or Solid Teal */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleSave}
                    disabled={isPending || (!facebookPixel.id && !tiktokPixel.id)}
                    className="
                        flex items-center gap-2 
                        bg-gradient-to-r from-teal-600 to-teal-500 
                        hover:from-teal-700 hover:to-teal-600
                        text-white px-8 py-2.5 rounded-xl shadow-lg shadow-teal-500/20
                        transform transition-all active:scale-95
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                    "
                >
                    {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-4 h-4" /> {t("Save")}</>}
                </button>
            </div>

        </PageContainer>
    )
}

export default Pixels;