import React from 'react';
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

// --- Types ---
interface Offer {
  id: number;
  name: string;
  Quantity: string;
  price: string;
  freedelevry: boolean;
  topOffer: boolean;
}

interface OffersContainerProps {
  Offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  err?: boolean;
}

const OffersContainer: React.FC<OffersContainerProps> = ({ Offers, setOffers, err }) => {
    const { t } = useTranslation("ProductsAndCategories");

    // Helper to update a specific field
    const updateOffer = (index: number, field: keyof Offer, value: any) => {
        const newOffers = [...Offers];
        newOffers[index] = { ...newOffers[index], [field]: value };
        setOffers(newOffers);
    };

    // Helper to remove an offer
    const removeOffer = (index: number) => {
        setOffers(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 w-full">
            {Offers.map((offer, index) => (
                <div
                    key={offer.id || index}
                    className="flex flex-col gap-4 border-b border-gray-100 pb-6 last:border-0"
                >
                    {/* Header: Title & Delete Button */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            {t("Offer")} #{index + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeOffer(index)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title={t("DeleteOffer")}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    {/* Inputs Column */}
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-slate-500">{t("OfferName")}</label>
                            <input
                                type="text"
                                placeholder={t("Ex: Buy 2 Get 1")}
                                value={offer.name}
                                onChange={(e) => updateOffer(index, 'name', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${err && !offer.name ? "border-red-500 bg-red-50" : "border-slate-200 bg-white"}`}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-slate-500">{t("OfferQuantity")}</label>
                                <input
                                    type="text"
                                    placeholder="Qty"
                                    value={offer.Quantity}
                                    onChange={(e) => updateOffer(index, 'Quantity', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${err && !offer.Quantity ? "border-red-500 bg-red-50" : "border-slate-200 bg-white"}`}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-slate-500">{t("OfferPrice")}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={offer.price}
                                        onChange={(e) => updateOffer(index, 'price', e.target.value)}
                                        className={`w-full pl-6 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${err && !offer.price ? "border-red-500 bg-red-50" : "border-slate-200 bg-white"}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toggles Column */}
                    <div className="flex flex-col gap-3 pt-2">
                        <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={offer.topOffer}
                                onChange={(e) => updateOffer(index, 'topOffer', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700 font-medium">{t("MarkAsTopOffer")}</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={offer.freedelevry}
                                onChange={(e) => updateOffer(index, 'freedelevry', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700 font-medium">{t("EnableFreeDelivery")}</span>
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OffersContainer;