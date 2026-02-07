import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatusOption {
    key: string;
    label: string;
    color: string;
    icon: ReactNode;
}

interface OrderStatusSelectorProps {
    statuses: StatusOption[];
    currentStatus: string;
    onStatusChange: (status: string) => void;
    title?: string;
}

/**
 * OrderStatusSelector Component
 * A modal for selecting order status from available options
 * 
 * @param statuses - Array of available status options
 * @param currentStatus - Currently selected status key
 * @param onStatusChange - Callback when user selects a new status
 * @param title - Optional custom title for the modal
 */
const OrderStatusSelector = ({ 
    statuses, 
    currentStatus, 
    onStatusChange,
    title = "Change Order Status" 
}: OrderStatusSelectorProps) => {
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full   overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            </div>
            
            {/* Status Options List */}
            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {statuses.map((status) => (
                    <motion.div
                        key={status.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 py-2.5 text-sm cursor-pointer rounded-xl flex items-center justify-between transition-all ${
                            currentStatus === status.key 
                                ? "bg-gray-100 font-semibold ring-1 ring-gray-200" 
                                : "hover:bg-gray-50"
                        }`}
                        onClick={() => onStatusChange(status.key)}
                    >
                        <div className="flex items-center gap-3">
                            {/* Status Icon with background */}
                            <div className={`p-1.5 rounded-full ${status.color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-20`}>
                                {status.icon}
                            </div>
                            {/* Status Label */}
                            {status.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatusSelector;