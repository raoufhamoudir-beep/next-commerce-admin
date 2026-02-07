import type { TFunction } from "i18next";

 
export interface PlanDetails {
  title: string;
  value: string; // The number of months (as a string to pass to date calculators)
  price: string;
  term: string;
  savings: string | null;
  desc: string;
}

/**
 * Returns the specific details for a plan based on whether the user selected
 * the "Upsell Offer" or the "Regular" version.
 * * @param plan - The ID of the plan (e.g., 'monthly', 'quarterly')
 * @param choiceType - Either 'offer' (upsell) or 'regular'
 * @param t - The i18next translation function
 */
export const getPlanDetails = (
  plan: string, 
  choiceType: string, 
  t: TFunction
): PlanDetails | null => {
    
    const isOffer = choiceType === 'offer';

    switch (plan) {
        case 'monthly':
            return {
                title: isOffer ? t("Double_Starter_Pack") : t("Standard_Monthly"),
                value: isOffer ? "2" : "1",
                price: isOffer ? "2,500" : "1,900",
                term: isOffer ? t("2_Months") : t("1_Month"),
                savings: isOffer ? "1,300 DZD" : null,
                desc: isOffer ? t("Special_Seasonal_Offer") : t("Regular_Monthly_Plan")
            };
        case 'quarterly':
            return {
                title: isOffer ? t("Quarterly_Plus") : t("Standard_Quarterly"),
                value: isOffer ? "4" : "3",
                price: "4,900",
                term: isOffer ? t("4_Months") : t("3_Months"),
                savings: isOffer ? t("1_Month_Free") : null,
                desc: isOffer ? t("Limited_Time_Upgrade") : t("Regular_Quarterly_Plan")
            };
        case 'semi_annual':
            return {
                title: isOffer ? t("Yearly_Pro_Access") : t("Standard_Semi-Annual"),
                value: isOffer ? "7" : "6",
                price: "9,000",
                term: isOffer ? t("7_Months") : t("6_Months"),
                savings: isOffer ? t("Best_Value") : null,
                desc: isOffer ? t("VIP_Deal") : t("Regular_6_Months_Plan")
            };
        default:
            return null;
    }
};