// src/features/Upgrade/constants/plans.ts

export const plans = [
    {
        id: 'monthly',
        nameKey: 'plan_monthly_name', // We store the translation key, not the final text
        price: "2,500",
        currency: "DZD",
        value: "2 m",
        termKey: '2_Months',
        featuresKeys: [
            'unlimited_leads',
            'basic_support',
            'remove_branding'
        ],
        badgeKey: null,
        isPopular: false
    },
    {
        id: 'quarterly',
        nameKey: 'plan_quarterly_name',
        price: "4,900",
        currency: "DZD",
        value: "4 m",
        termKey: '4_Months',
        featuresKeys: [
            'priority_support',
            'analytics',
            'everything_in_monthly'
        ],
        badgeKey: 'save_700_dzd',
        isPopular: true // This will highlight the card
    },
    {
        id: 'semi_annual',
        nameKey: 'plan_semi_annual_name',
        price: "9,000",
        currency: "DZD",
        value: "7 m",
        termKey: '7_Months',
        featuresKeys: [
            'vip_support',
            'api_access',
            'everything_in_quarterly'
        ],
        badgeKey: 'best_value',
        isPopular: false
    }
];

export default plans;