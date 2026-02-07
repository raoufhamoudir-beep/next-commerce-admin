import { ActionAlert, AlertItemPreview } from '@/components/ui/ActionAlert';
import type { orders } from '@/types';
import { useTranslation } from 'react-i18next';

interface DeliverySendConfirmationProps {
    onConfirm: () => void;
    onCancel: () => void;
    showSendConfirm: boolean
    order: orders
}


 
const DeliverySendConfirmation = ({ onConfirm, onCancel, showSendConfirm, order }: DeliverySendConfirmationProps) => {
        const { t } = useTranslation("order");

    return (
         <ActionAlert
                          isOpen={showSendConfirm}
                          onClose={onCancel}
                          onConfirm={onConfirm}
                          title={t("send order?")}
                          variant="success" // Makes it Red
                          confirmText={t("Yes, send")}
                          description={
                            <span>
                              {t("Send to Delivery")} <span className="font-bold text-gray-800">"{order?.name}"</span>. 
                              {t("Are you sure you want to send this order to the delivery service?")} <span className="text-red-600 font-semibold">{t("cannot be undone")}</span>.
                            </span>
                          }
                        >
                          {/* The Visual Cue */}
                          <AlertItemPreview 
                             title={order.productData?.name || ""}
                             subtitle={`ID: ${order._id}`}
                             image={order.productData?.images[0]}
                          />
                        </ActionAlert>
        
    );
};

export default DeliverySendConfirmation;