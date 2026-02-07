import type { orders } from '@/types';
import { useTranslation } from 'react-i18next';
import { ActionAlert, AlertItemPreview } from '@/components/ui/ActionAlert';

interface OrderDeleteConfirmationProps {
    showDeleteModal: boolean;
    order: orders;
    onConfirm: () => void;
    onCancel: () => void;
}

const OrderDeleteConfirmation = ({ order, onConfirm, onCancel, showDeleteModal }: OrderDeleteConfirmationProps) => {
        const { t } = useTranslation("order");
    
    return (
        <ActionAlert
                  isOpen={showDeleteModal}
                  onClose={onCancel}
                  onConfirm={onConfirm}
                  title={t("Delete order?")}
                  variant="danger" // Makes it Red
                  confirmText={t("Yes, Delete")}
                  description={
                    <span>
                      {t("Are you sure you want to delete the order for:")} <span className="font-bold text-gray-800">"{order?.name}"</span>. 
                      {t("This action involves permanent data loss and")} <span className="text-red-600 font-semibold">{t("cannot be undone")}</span>.
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

export default OrderDeleteConfirmation;