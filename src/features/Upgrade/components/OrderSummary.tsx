import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

interface OrderDetails {
  title: string;
  value: string;
  price: string;
  term: string;
  savings: string | null;
  desc: string;
}

interface OrderSummaryProps {
  orderDetails: OrderDetails;
}

const OrderSummary = ({ orderDetails }: OrderSummaryProps) => {
  const { t } = useTranslation("subscriptions");

  // Helper function to calculate date
  const getFutureDate = (monthsToAdd: string) => {
    const date = new Date();
    date.setMonth(date.getMonth() + parseInt(monthsToAdd));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-8 overflow-hidden">
      <div className="bg-gray-900 text-white p-5 text-center">
        <h4 className="text-lg font-bold">{t("Order_Summary")}</h4>
        <p className="text-xs text-gray-400 mt-1">{t("ID")}: #{Math.floor(Math.random() * 100000)}</p>
      </div>

      <div className="p-6">
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 mb-1">{t("SelectedPlan")}</p>
          <h2 className="text-xl font-extrabold text-purple-700 leading-tight">
            {orderDetails.title}
          </h2>
          {orderDetails.savings && (
            <span className="inline-block mt-2 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100">
              {t("You_Saved")} {orderDetails.savings}
            </span>
          )}
        </div>

        <div className="border-t border-dashed border-gray-200 my-4"></div>

        <div className="space-y-3">
          <SummaryRow label={t("Billing_Cycle")} value={orderDetails.term} />
          <SummaryRow label={t("Duration")} value={getFutureDate(orderDetails.value)} />
          <SummaryRow label={t("Features")} value={t("All_Premium_Features")} />
        </div>

        <div className="mt-6 bg-purple-50 rounded-xl p-4 flex justify-between items-center border border-purple-100">
          <span className="text-sm font-bold text-purple-900">{t("Total_to_Pay")}</span>
          <span className="text-2xl font-black text-purple-700">
            {orderDetails.price} <span className="text-xs font-normal text-gray-500">DZD</span>
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-green-500" />
          {t("Secure_Payment_&_Fast_Activation")}
        </p>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between text-sm text-gray-600">
    <span>{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default OrderSummary;