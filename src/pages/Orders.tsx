import PageContainer from "@/components/ui/PageContainer";
import Tutorial from "@/components/ui/Tutorial";
import { useUser } from "@/features/auth/hooks/useUser";
import UpgradeYourPlan from "@/features/orders/components/UpgradeYourPlan";
import useOrderFilters from "@/features/orders/hooks/useOrderFilters";
import { useOrders } from "@/features/orders/hooks/useOrders";
import usePagination from "@/features/orders/hooks/usePagination";
import FilterPanel from "@/features/orders/components/FilterPanel";
import OrdersGrid from "@/features/orders/components/OrdersGrid";
import OrdersSummary from "@/features/orders/components/OrdersSummary";
import type { orders } from "@/types";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFilter } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useProducts } from "@/features/products/hooks/UseProducts";
import { useAddOrder, useDeleteOrder, useUpdateOrder } from "@/features/orders/hooks/useOrderManagement";
import { useStore } from "@/features/store/hooks/UseStore";
import Modal from "@/components/ui/Madel";
import AddOder from "@/features/orders/components/AddOder";

/** 
 * Helper function to extract unique items from orders
 */
const getUniqueItems = (allOrders: orders[]): { id: string; name: string }[] => {
    const uniqueItems: { id: string; name: string }[] = [];
    const seen = new Set<string>();
    
    if (allOrders) {
        for (const orderItem of allOrders) {
            const item = orderItem.productData;
            if (item && item._id && !seen.has(item._id)) {
                seen.add(item._id);
                uniqueItems.push({
                    id: item._id,
                    name: item.name,
                });
            }
        }
    }
    return uniqueItems;
};

/**
 * Helper function to extract unique states from orders
 */
const getUniqueStates = (allOrders: orders[]): string[] => {
    const uniqueStates: string[] = [];
    const seen = new Set<string>();
    
    if (allOrders) {
        for (const orderItem of allOrders) {
            const state = orderItem.state;
            if (state && !seen.has(state)) {
                seen.add(state);
                uniqueStates.push(state);
            }
        }
    }
    return uniqueStates;
};

const Orders = () => {
    const { t, i18n } = useTranslation("order");
    const currentLang = i18n.language;
    const { id } = useParams<{ id: string }>();
    
    // State management
    const [viewType, setViewType] = useState<"grid" | "table">("grid");
    const [showAddOrder, setShowAddOrder] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<orders | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    
    // Data hooks
    const { data: user } = useUser();
    const { data: products } = useProducts(id);
    const { data: store } = useStore(id);
    const { mutate: postOrder } = useAddOrder(id);
    const { mutate: deleteOrder } = useDeleteOrder(id);
    const { mutate: updateOrder } = useUpdateOrder(id);
    const { data: allOrders = [], isLoading: loading } = useOrders(id); 

    // Filter and pagination
    const { filteredOrders, filters, setFilters, clearFilters } = useOrderFilters(allOrders);
    const { visibleItems, hasMore, loadMore } = usePagination(filteredOrders);

    // Modal handlers
    const openAddOrderModal = () => {
        setSelectedOrder(null);
        setShowAddOrder(true);
    };

    const openEditOrderModal = (order: orders) => {
        setSelectedOrder(order);
        setShowAddOrder(true);
    };

    const closeAddOrderModal = () => {
        setShowAddOrder(false);
        setSelectedOrder(null);
    };

    const closeTutorial = () => setShowTutorial(false);
    const closeFilters = () => setShowFilters(false);

    // Order update handlers
    const handleQuickEdit = (orderId: string, status: string, note: string) => {
        const orderToUpdate = allOrders.find(o => o._id === orderId);
        if (!orderToUpdate) return;

        const updatedData: orders = {
            ...orderToUpdate,
            status,
            note,
        };

        updateOrder({ id: orderId, data: updatedData });
    };

    const handleFullEdit = (id: string, data: orders) => {
        updateOrder({ id, data });
        closeAddOrderModal();
    };

    return (
        <PageContainer
            about={t("Management")}
            title={t("Orders")}
        >
            {/* PRO BANNER */}
            {!user?.isPaid && <UpgradeYourPlan ordersUsed={user?.ordersCount || 0} />}
            
            {/* MODALS */}
            {showTutorial && (
                <Modal onClose={closeTutorial}>
                    <Tutorial about="https://firebasestorage.googleapis.com/v0/b/tawssilatrest.appspot.com/o/%D8%AA%D8%A3%D9%83%D9%8A%D8%AF%20%D8%A7%D9%84%D8%B7%D9%84%D8%A8%D9%8A%D8%A7%D8%AA%20%D9%81%D9%8A%20%D9%85%D9%86%D8%B5%D8%A9%20next%20comerce.mp4?alt=media&token=1e03cbc7-3d5c-4c80-8ae5-8f6ce26ce449" />
                </Modal>
            )}

            {showAddOrder && (
                <Modal onClose={closeAddOrderModal}>
                    <AddOder
                    user={user?._id || ""}
                        id={id || ""}
                        products={products || []}
                        editeFull={handleFullEdit}
                        order={selectedOrder}
                        postOrder={postOrder}
                        onclose={closeAddOrderModal}
                    />
                </Modal>
            )}

            {showFilters && (
                <Modal onClose={closeFilters}>
                    <FilterPanel
                        className="block"
                        clearFilters={clearFilters}
                        filters={filters}
                        setFilters={setFilters}
                        uniqueItems={getUniqueItems(allOrders)}
                        getUniqueState={getUniqueStates(allOrders)}
                    />
                </Modal>
            )}

            {/* SUMMARY */}
            <OrdersSummary Allorders={allOrders} />

            {/* FILTERS - Desktop */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="flex-1">
                    <FilterPanel
                        className="hidden md:block"
                        clearFilters={clearFilters}
                        filters={filters}
                        setFilters={setFilters}
                        uniqueItems={getUniqueItems(allOrders)}
                        getUniqueState={getUniqueStates(allOrders)}
                    />
                </div>
            </div>

            {/* ORDERS GRID */}
            <div className="min-h-[500px] w-full relative">
                {/* View Switcher */}
                <div className={`absolute z-10 mb-4 md:mb-0 w-fit ${currentLang === "ar" ? "left-5" : "right-5"} top-5`}>
                    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 shadow-sm">
                        <button
                            onClick={() => setViewType("grid")}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                                viewType === "grid" 
                                    ? "bg-white text-teal-700 shadow-sm ring-1 ring-black/5" 
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }`}
                            title="Grid View"
                        >
                            <LayoutGrid size={14} />
                            <span className="hidden sm:inline">{t("Grid")}</span>
                        </button>
                        <button
                            onClick={() => setViewType("table")}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                                viewType === "table" 
                                    ? "bg-white text-teal-700 shadow-sm ring-1 ring-black/5" 
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }`}
                            title="Table View"
                        >
                            <List size={14} />
                            <span className="hidden sm:inline">{t("Table")}</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-2 md:pt-0">
                    <OrdersGrid
                        ShowAddOrder={openAddOrderModal}
                        deleteOrder={deleteOrder}
                        updateOrder={updateOrder}
                        filters={filters}
                        setFilters={setFilters}
                        orders={visibleItems}
                        loading={loading}
                        isPaid={user?.isPaid}
                        openEdit={openEditOrderModal}
                        edite={handleQuickEdit}
                        hasMore={hasMore}
                        loadMore={loadMore}
                        companyLiv={store?.deliveryCompany}
                    />
                </div>
            </div>

            {/* MOBILE FLOATING FILTER BUTTON */}
            <button
                onClick={() => setShowFilters(true)}
                className="fixed bottom-7 right-5 flex md:hidden bg-teal-600 rounded-full p-4 shadow-xl shadow-teal-500/30 cursor-pointer z-50 hover:scale-105 active:scale-95 transition-transform"
                aria-label="Open Filters"
            >
                <FaFilter className="text-white" size={20} />
            </button>
        </PageContainer>
    );
};

export default Orders;