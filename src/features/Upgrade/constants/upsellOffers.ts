// src/features/Upgrade/constants/upsellOffers.ts

export const upsellOffers = {
  monthly: {
    offer: {
      titleKey: "Double_Starter_Pack",
      price: "2,500",
      termKey: "2_Months",
      value: "2 m",
      saveKey: "1,300 DZD", // Raw string, t() will return it as-is if no key exists
      descKey: "Save_35%_by_grabbing_the_seasonal double_pack",
      tagKey: "Recommended"
    },
    regular: {
      titleKey: "Standard_Monthly",
      price: "1,900",
      value: "1 m",
      termKey: "1_Month",
      descKey: "Pay_full_price_for_a_single_month"
    },
    scarcityKey: "Seasonal_offer"
  },
  quarterly: {
    offer: {
      titleKey: "Quarterly_Plus",
      price: "4,900",
      termKey: "4_Months",
      value: "4 m",
      saveKey: "1_Month_Free",
      descKey: "Get_1_extra_month_completely_free",
      tagKey: "Best_Seller"
    },
    regular: {
      titleKey: "Standard_Quarterly",
      price: "4,900",
      value: "4 m",
      termKey: "3_Months",
      descKey: "Standard_3_months_access"
    },
    scarcityKey: "Seasonal_offer"
  },
  semi_annual: {
    offer: {
      titleKey: "Yearly_Pro_Access",
      price: "9,000",
      termKey: "7_Months",
      value: "7 m",
      saveKey: "Best_Value",
      descKey: "Get_7_months_for_the_price_of_6",
      tagKey: "Rare_Deal"
    },
    regular: {
      titleKey: "Standard_Semi-Annual",
      price: "9,000",
      value: "6 m",
      termKey: "6_Months",
      descKey: "Standard_6_months_access"
    },
    scarcityKey: "Seasonal_offer"
  }
};