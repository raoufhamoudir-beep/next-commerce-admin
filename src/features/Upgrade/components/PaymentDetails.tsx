import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, CreditCard } from 'lucide-react'; // Or use your specific icons

interface PaymentDetailsProps {
  paymentInfo: {
    ccp: string;
    rip: string;
    name: string;
  };
}

const PaymentDetails = ({ paymentInfo }: PaymentDetailsProps) => {
  const { t } = useTranslation("subscriptions");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex justify-between items-center">
        <h3 className="font-bold text-purple-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          {t("Payment_Information")}
        </h3>
        <span className="px-3 py-1 bg-white text-teal-600 text-xs font-bold rounded-full border border-teal-100 shadow-sm">
          {t("Manual_Verification")}
        </span>
      </div>

      <div className="p-6 space-y-6">
        <p className="text-sm text-gray-600">
          {t("Please_transfer_the_total_amount_to_the_account_below_using_Algérie_Poste_or_Baridimob_app")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CCP Box */}
          <InfoBox 
            label={t("CCP_Number")} 
            value={paymentInfo.ccp} 
            fieldKey="ccp" 
            copiedField={copiedField} 
            onCopy={handleCopy} 
          />
          
          {/* RIP Box */}
          <InfoBox 
            label={t("RIP_Number")} 
            value={paymentInfo.rip} 
            fieldKey="rip" 
            copiedField={copiedField} 
            onCopy={handleCopy} 
          />
        </div>

        <div className="text-center">
          <span className="text-xs text-gray-400">{t("Account_Holder_Name")}: </span>
          <span className="font-bold text-gray-700">{paymentInfo.name}</span>
        </div>
      </div>
    </div>
  );
};

// Sub-component for the Copy Boxes
const InfoBox = ({ label, value, fieldKey, copiedField, onCopy }: any) => {
  const { t } = useTranslation("Account");
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group hover:border-purple-300 transition-colors">
      <span className="text-xs font-bold text-gray-400 uppercase">{label}</span>
      <div className="text-lg font-mono font-bold text-gray-800 mt-1 tracking-wider break-all">{value}</div>
      <button
        onClick={() => onCopy(value, fieldKey)}
        className="absolute top-4 right-4 text-purple-600 hover:text-purple-800"
      >
        {copiedField === fieldKey ? (
          <span className="text-xs font-bold text-teal-500 flex items-center gap-1">
            <Check className="w-4 h-4" /> {t("Copied")}
          </span>
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default PaymentDetails;