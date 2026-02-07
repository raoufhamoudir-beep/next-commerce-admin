import { IoMdClose } from "react-icons/io";
import { Plus, Search, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import BoxCard from "@/components/ui/BoxCard";
import OrderCard from "./OrderCard";
import type { deliveryCompany, orders } from "@/types";

interface OrdersGridProps {
    orders: orders[];
    loading: boolean;
    filters: any;
    setFilters: (filters: any) => void;
    deleteOrder: (id: string) => void;
    updateOrder: (data: { id: string; data: orders }) => void;
    openEdit: (order: orders) => void;
    ShowAddOrder: () => void;
    hasMore: boolean;
    loadMore: () => void;
    isPaid?: boolean;
    companyLiv?: deliveryCompany;
    emptyMessage?: string;
    edite: (orderId: string, status: string, note: string) => void;
}

/**
 * OrdersGrid Component
 * Displays a grid of order cards with search functionality
 */
const OrdersGrid = ({
    openEdit,
    orders,
    loading,
    deleteOrder,
    setFilters,
    filters,
    hasMore,
    loadMore,
    isPaid,
    ShowAddOrder,
    companyLiv,
    edite,
    updateOrder,
}: OrdersGridProps) => {
    const { t } = useTranslation("order");

    return (
        <BoxCard about={t("Orders")}>
            {/* Search and Add Order Controls */}
            <div className="flex w-full items-center gap-3 mb-6 mt-2">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder={t("ShearchBy")}
                        onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                        value={filters.customer || ""}
                    />
                </div>

                <div className="flex items-center gap-2">
                    {filters.customer && (
                        <button
                            onClick={() => setFilters({ ...filters, customer: "" })}
                            className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            aria-label="Clear search"
                        >
                            <IoMdClose size={20} />
                        </button>
                    )}

                    <button
                        onClick={ShowAddOrder}
                        className="flex items-center bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-5 rounded-xl font-medium gap-2 transition-colors"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">{t("NewOrder")}</span>
                    </button>
                </div>
            </div>

            {/* Orders Display */}
            <div className="min-h-[200px]">
                {loading && orders.length === 0 ? (
                    // Loading skeleton
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div 
                                key={i} 
                                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 h-64 animate-pulse" 
                            />
                        ))}
                    </div>
                ) : orders.length > 0 ? (
                    // Orders grid
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {orders.map((item, index) => (
                            <OrderCard
                                key={item._id || index}
                                order={item}
                                index={index}
                                openEdit={openEdit}
                                companyLiv={companyLiv || null}
                                isPaid={isPaid || false}
                                deleteOrder={deleteOrder}
                                updateOrder={updateOrder}
                                edite={edite}
                                ShowAddOrder={ShowAddOrder}
                            />
                        ))}
                    </div>
                ) : (
                    // Empty state
                    <div className="text-center py-10 text-gray-500">
                        {t("NoOrdersFound")}
                    </div>
                )}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 text-teal-700 bg-white border border-teal-200 rounded-full hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="animate-spin h-4 w-4" />}
                        {t("LoadMoreOrders")}
                    </button>
                </div>
            )}
        </BoxCard>
    );
};

export default OrdersGrid;