import PageContainer from "@/components/ui/PageContainer";
import PlanCard from "@/features/Upgrade/components/PlanCard";
import UpsellModal from "@/features/Upgrade/components/UpsellModal";
import plans from "@/features/Upgrade/constants/plans";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Upgrade = () => {
  const { t } = useTranslation("subscriptions");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <PageContainer
      title={t('upgrade')} // I corrected 'titel' to 'title' assuming standard naming
      about={t("Choosetheplan")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              name={t(plan.nameKey)}
              price={plan.price}
              currency={plan.currency}
              term={t(plan.termKey)}
              // Only translate badge if it exists
              badge={plan.badgeKey ? t(plan.badgeKey) : undefined}
              isPopular={plan.isPopular}
              // Map through feature keys to translate them one by one
              features={plan.featuresKeys.map(featureKey => t(featureKey))}
              buttonText={t('see_details')}
              onClick={() => setSelectedPlan(plan.id)}
            />
          ))}

        </div>
      </div>

      {/* Modal Logic */}
      {selectedPlan && (
        <UpsellModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </PageContainer>
  );
};

export default Upgrade;