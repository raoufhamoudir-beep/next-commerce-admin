import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import BoxCard from "@/components/ui/BoxCard";
import type { OrderFilters } from "@/types";

interface FilterPanelProps {
    filters: OrderFilters;
    setFilters: (s: OrderFilters) => void;
    uniqueItems: { id: string; name: string }[];
    clearFilters: () => void;
    getUniqueState: string[];
    className: string;
}

/**
 * FilterPanel Component
 * Displays filter controls for orders
 */
const FilterPanel = ({
    filters,
    setFilters,
    uniqueItems,
    clearFilters,
    getUniqueState,
    className
}: FilterPanelProps) => {
    const { t } = useTranslation("order");

    return (
        <BoxCard
            className={className}
            about={t('fillter')}
        >
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Status Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("Orderstatus")}
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">{t("all")}</option>
                        {[
                            { key: "pending", label: t("pending") },
                            { key: "Connection failed 1", label: t("Connectionfailed1") },
                            { key: "confirmed", label: t("confirmed") },
                            { key: "ready", label: t("ready") },
                            { key: "Postponed", label: t("Postponed") },
                            { key: "cancelled", label: t("cancelled") },
                            { key: "failed", label: t("failed") },
                        ].map((r, i) => (
                            <option key={i} value={r.key}>{r.label}</option>
                        ))}
                    </select>
                </div>

                {/* State Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("state")}
                    </label>
                    <select
                        value={filters.state}
                        onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">{t("all")}</option>
                        {getUniqueState.map(e => (
                            <option value={e} key={e}>{e}</option>
                        ))}
                    </select>
                </div>

                {/* Delivery Location Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("Deliverylocation")}
                    </label>
                    <select
                        value={filters.delevetyType}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                delevetyType: e.target.value as "all" | "home" | "office",
                            })
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">{t("all")}</option>
                        <option value="home">{t("home")}</option>
                        <option value="berue">{t("berue")}</option>
                    </select>
                </div>

                {/* Product/Item Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("product")}
                    </label>
                    <select
                        value={filters.productData}
                        onChange={(e) => setFilters({ ...filters, productData: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{t("all")}</option>
                        {uniqueItems.map(e => (
                            <option key={e.id} value={e.name}>{e.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end gap-2 mt-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    type="button"
                    className="px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
                >
                    <FiX className="h-4 w-4" />
                    ({t("removeall")})
                </motion.button>
            </div>
        </BoxCard>
    );
};

export default FilterPanel;