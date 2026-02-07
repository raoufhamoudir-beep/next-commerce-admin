import { motion } from "framer-motion";
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Bell, XCircle, CheckCircle2, Package, Clock, PhoneOff, Ban,
    Pencil, Truck, StickyNote, Edit, Trash
} from "lucide-react";
import Modal from "@/components/ui/Madel";
import OrderDeleteConfirmation from "./OrderDeleteConfirmation";
import OrderNoteEditor from "./OrderNoteEditor";
import DeliverySendConfirmation from "./DeliverySendConfirmation";
import OrderStatusSelector from "./OrderStatusSelector";
import {
    OrderCardHeader,
    OrderProductImage,
    OrderVariants,
    OrderOfferBadge,
    OrderCustomerInfo,
    OrderPricing,
    OrderStatusBadge
} from "./Ordercardcomponents";
import type { deliveryCompany, orders } from "@/types";

interface OrderCardProps {
    order: orders;
    index: number;
    deleteOrder: (id: string) => void;
    updateOrder: (data: { id: string; data: orders }) => void;
    openEdit: (order: orders) => void;
    ShowAddOrder: () => void;
    isPaid?: boolean;
    companyLiv?: deliveryCompany | null;
    edite: (orderId: string, status: string, note: string) => void;
}

const OrderCard = ({ 
    order, 
    index, 
    deleteOrder, 
    isPaid, 
    companyLiv, 
    openEdit, 
    edite
}: OrderCardProps) => {
    const { t } = useTranslation("order");

    // Local state
    const [myorder, setMyOrder] = useState(order);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSendConfirm, setShowSendConfirm] = useState(false);
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [note, setNote] = useState(order?.note || "");

    useEffect(() => {
        setMyOrder(order);
        setNote(order?.note || "");
    }, [order]);

    // Status configuration
    const statuses = useMemo(() => [
        { key: "pending", label: t("pending"), color: "bg-blue-50 text-blue-600 border-blue-200", icon: <Bell className="w-3.5 h-3.5" /> },
        { key: "Connection failed 1", label: t("Connectionfailed1"), color: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: <PhoneOff className="w-3.5 h-3.5" /> },
        { key: "Connection failed 2", label: t("Connectionfailed2"), color: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: <PhoneOff className="w-3.5 h-3.5" /> },
        { key: "Connection failed 3", label: t("Connectionfailed3"), color: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: <PhoneOff className="w-3.5 h-3.5" /> },
        { key: "confirmed", label: t("confirmed"), color: "bg-green-50 text-green-600 border-green-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        { key: "ready", label: t("ready"), color: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: <Package className="w-3.5 h-3.5" /> },
        { key: "Postponed", label: t("Postponed"), color: "bg-purple-50 text-purple-600 border-purple-200", icon: <Clock className="w-3.5 h-3.5" /> },
        { key: "cancelled", label: t("cancelled"), color: "bg-gray-50 text-gray-500 border-gray-200", icon: <XCircle className="w-3.5 h-3.5" /> },
        { key: "failed", label: t("failed"), color: "bg-red-50 text-red-600 border-red-200", icon: <Ban className="w-3.5 h-3.5" /> },
        { key: "in company", label: t("InDelivery"), color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: <Truck className="w-3.5 h-3.5" /> },
    ], [t]);

    // Helper functions
    const getSocialTime = (date: Date | undefined) => {
        if (!date) return "N/A";
        const now = new Date();
        const past = new Date(date);
        const minutes = differenceInMinutes(now, past);
        if (minutes < 60) return `${minutes}m`;
        const hours = differenceInHours(now, past);
        if (hours < 24) return `${hours}h`;
        const days = differenceInDays(now, past);
        if (days < 7) return `${days}d`;
        const weeks = differenceInWeeks(now, past);
        if (weeks < 4) return `${weeks}w`;
        const months = differenceInMonths(now, past);
        if (months < 12) return `${months}mo`;
        const years = differenceInYears(now, past);
        return `${years}y`;
    };

    const showPhoneNumber = (phoneNumber: string | undefined) => {
        if (!phoneNumber) return "N/A";
        if (myorder.show) return phoneNumber;
        if (!myorder.show && !isPaid) return "**********";
        if (!myorder.show && isPaid) return phoneNumber;
        return phoneNumber;
    };

    // Event handlers
    const handleStatusChange = (newStatus: string) => {
        const updatedOrder = { ...myorder, status: newStatus };
        setMyOrder(updatedOrder);
        setShowStatusDropdown(false);
        edite(order._id || "", newStatus, note);
    };

    const handleSaveNote = () => {
        edite(myorder._id || "", myorder.status || "", note);
        setMyOrder(prev => ({ ...prev, note }));
        setShowNoteEditor(false);
    };

    const handleDeleteConfirm = () => {
        deleteOrder(myorder._id || "");
        setShowDeleteModal(false);
    };

    const handleSendToDelivery = () => {
        setShowSendConfirm(false);
        handleStatusChange('in company');
    };

    // Computed values
    const currentStatus = statuses.find((s) => s.key === myorder.status) || statuses[0];
    const borderClass = currentStatus?.color.split(" ").find(c => c.startsWith("border-")) || "border-gray-200";
    const isLocked = myorder.status === 'in company';
    const canSendToDelivery = companyLiv?.name && myorder.status === "ready" && !isLocked;

    return (
        <>
            {/* Modals */}
            {showStatusDropdown && !isLocked && (
                <Modal onClose={() => setShowStatusDropdown(false)}>
                    <OrderStatusSelector
                        statuses={statuses}
                        currentStatus={myorder.status || ""}
                        onStatusChange={handleStatusChange}
                        title={t("changeOrderStatus")}
                    />
                </Modal>
            )}

            {showDeleteModal && (
                <Modal onClose={() => setShowDeleteModal(false)}>
                    <OrderDeleteConfirmation
                        order={myorder}
                        showDeleteModal={showDeleteModal}
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                </Modal>
            )}

            {showSendConfirm && (
                <Modal onClose={() => setShowSendConfirm(false)}>
                    <DeliverySendConfirmation
                        order={myorder}
                        showSendConfirm={showSendConfirm}
                        onConfirm={handleSendToDelivery}
                        onCancel={() => setShowSendConfirm(false)}
                    />
                </Modal>
            )}

            {showNoteEditor && (
                <Modal onClose={() => setShowNoteEditor(false)}>
                    <OrderNoteEditor
                        note={note}
                        status={myorder.status || ""}
                        onNoteChange={setNote}
                        onSave={handleSaveNote}
                        onCancel={() => setShowNoteEditor(false)}
                    />
                </Modal>
            )}

            {/* CARD DESIGN */}
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`group bg-white border ${borderClass} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
            >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentStatus?.color.replace('text-', 'bg-').split(' ')[0]}`} />

                {/* Header */}
                <OrderCardHeader
                    orderId={order._id || ""}
                    timeAgo={getSocialTime(myorder.createdAt)}
                    t={t}
                />

                {/* Main Content */}
                <div className="flex gap-4 mb-4 pl-2">
                    <OrderProductImage
                        imageUrl={myorder?.productData?.images?.[0] || ''}
                        productName={myorder?.productData?.name || ''}
                        quantity={myorder.quantity}
                     />

                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate mb-1">
                            {myorder?.productData?.name || 'N/A'}
                        </h4>

                        <OrderOfferBadge offerName={myorder.Offers ? myorder.offerNmae : undefined} />
                        <OrderVariants size={myorder.size} color={myorder.color} />
                        <OrderCustomerInfo
                            name={myorder.name}
                            city={myorder.city}
                            state={myorder.state}
                            isHomeDelivery={myorder.home ?? true}
                            phone={myorder.phone}
                            showPhone={showPhoneNumber}
                            t={t}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200 my-3 ml-2"></div>

                {/* Pricing & Status */}
                <div className="flex justify-between items-end mb-4 pl-2">
                    <OrderPricing
                        productPrice={myorder.price}
                        deliveryPrice={myorder.DelevryPrice}
                        totalPrice={myorder.total}
                        t={t}
                    />

                    <OrderStatusBadge
                        status={currentStatus}
                        isLocked={isLocked}
                        onClick={() => !isLocked && setShowStatusDropdown(true)}
                    />
                </div>

                {/* Display Note */}
                {myorder.note && (
                    <div className="mb-4 pl-2 px-1">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-xs text-gray-700 flex items-start gap-2">
                            <div className="mt-0.5 min-w-[14px]">
                                <StickyNote size={12} className="text-amber-500" />
                            </div>
                            <p className="leading-relaxed break-words">{myorder.note}</p>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="bg-gray-50 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl border-t border-gray-100 flex justify-between items-center mt-auto pl-6">
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors"
                        onClick={() => setShowNoteEditor(true)}
                    >
                        <Pencil size={14} className={myorder.note ? "text-amber-500" : "text-gray-400"} />
                        <span className={`text-xs max-w-[120px] truncate ${myorder.note ? "text-gray-700 font-medium" : "text-gray-400 italic"}`}>
                            {myorder.note ? t("EditNote") : t("AddNote")}....
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => openEdit(myorder)}
                            className="p-2 rounded-full hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Order"
                        >
                            <Edit size={16} />
                        </button>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Order"
                        >
                            <Trash size={16} />
                        </button>

                        {canSendToDelivery && (
                            <button
                                onClick={() => setShowSendConfirm(true)}
                                className="p-2 rounded-full hover:bg-green-100 text-gray-400 hover:text-green-600 transition-colors"
                                title="Send to Delivery"
                            >
                                <Truck size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default OrderCard;