import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { upsellOffers } from '@/features/Upgrade/constants/upsellOffers'; // Ensure path is correct

interface UpsellModalProps {
  plan: string;
  onClose: () => void;
}

const UpsellModal: React.FC<UpsellModalProps> = ({ plan, onClose }) => {
  const navigate = useNavigate();
    const { t } = useTranslation("subscriptions");

  // Type assertion to ensure 'plan' matches the keys in upsellOffers
  const content = upsellOffers[plan as keyof typeof upsellOffers];

  if (!content) return null;

  const handleSelect = (choiceType: 'offer' | 'regular') => {
    // 1. Determine the correct price based on the user's choice
    const selectedPrice = choiceType === 'offer' 
      ? content.offer.price 
      : content.regular.price;

    // 2. Save plan, choiceType, AND price to localStorage
    localStorage.setItem('selectedPlanOption', JSON.stringify({
      plan: plan,
      choiceType: choiceType,
      price: selectedPrice
    }));

    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/80 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 border border-gray-100">

        {/* 🔴 Scarcity Header */}
        <div className="bg-red-50 border-b border-red-100 px-4 py-2 text-center">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t(content.scarcityKey)}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-10 right-4 text-gray-300 hover:text-gray-500 z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">{t("ChooseYourDeal")}</h3>
            <p className="text-gray-500 text-sm mt-1">{t("Selectthebestoptionforyourbusiness")}</p>
          </div>

          <div className="space-y-4">

            {/* ⭐ OPTION 1: THE MAGIC OFFER */}
            <div
              onClick={() => handleSelect('offer')}
              className="relative group cursor-pointer rounded-xl border-2 border-purple-500 bg-purple-50 p-1 shadow-lg transition-all hover:scale-[1.02] hover:shadow-purple-200"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-500 to-purple-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                {t(content.offer.tagKey)}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/60 p-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-purple-900 text-lg">{t(content.offer.titleKey)}</h4>
                    <span className="inline-block rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-700 uppercase tracking-wide">
                      {t("Save")} {t(content.offer.saveKey)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-purple-700 font-medium">
                    {t(content.offer.descKey)}
                  </p>
                </div>
                <div className="text-right pl-4">
                  <div className="text-2xl font-black text-purple-700">{content.offer.price}</div>
                  <div className="text-xs font-bold text-teal-600 uppercase">{t(content.offer.termKey)}</div>
                </div>
              </div>

              {/* Selection Indicator */}
              <div className="absolute top-1/2 right-0 -mr-2 h-4 w-4 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-purple-500 bg-purple-50 opacity-0 group-hover:opacity-100"></div>
            </div>


            {/* ⚪ OPTION 2: THE REGULAR PLAN */}
            <div
              onClick={() => handleSelect('regular')}
              className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity">
                <div>
                  <h4 className="font-semibold text-gray-700">{t(content.regular.titleKey)}</h4>
                  <p className="mt-1 text-sm text-gray-500">{t(content.regular.descKey)}</p>
                </div>
                <div className="text-right pl-4">
                  <div className="text-xl font-bold text-gray-900">{content.regular.price}</div>
                  <div className="text-xs text-gray-500 uppercase">{t(content.regular.termKey)}</div>
                </div>
              </div>
            </div>

          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            {t("You_can_upgrade_or_cancel_anytime_from_your_account_settings")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpsellModal;