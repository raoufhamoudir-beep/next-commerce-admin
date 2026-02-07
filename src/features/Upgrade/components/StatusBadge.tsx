import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const { t } = useTranslation("subscriptions");

  const normalizedStatus = status?.toLowerCase() || "pending";

  const styles: Record<string, string> = {
    approved: "bg-teal-100 text-teal-700 border-teal-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const currentStyle = styles[normalizedStatus] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle} capitalize`}>
      {t(`subscriptions.status.${normalizedStatus}`, status)}
    </span>
  );
};

export default StatusBadge;