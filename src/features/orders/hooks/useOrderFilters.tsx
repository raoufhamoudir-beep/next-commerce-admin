import { useState, useMemo } from "react";
import type { OrderFilters, orders } from "@/types";
  
const defaultFilters: OrderFilters = {
  status: "all",
  productData: "all",
  customer: "",
  state: "all",
  delevetyType: "all",
  sortBy: "newest",
};

const useOrderFilters = (orders: orders[] = []) => {
  const [filters, setFilters] = useState<OrderFilters>(defaultFilters);

  const filteredOrders = useMemo<orders[]>(() => {
    if (!orders.length) return [];

    let result = [...orders];

    // Status
    if (filters.status !== "all") {
      result = result.filter(o => o.status === filters.status);
    }

    // State
    if (filters.state !== "all") {
      result = result.filter(o => o.state === filters.state);
    }

    // Delivery type
    if (filters.delevetyType !== "all") {
      result = result.filter(o =>
        filters.delevetyType === "home" ? o.home : !o.home
      );
    }

    // Product
    if (filters.productData !== "all") {
      result = result.filter(
        o => o.productData?.name === filters.productData
      );
    }

    // Customer search
    if (filters.customer) {
      const query = filters.customer.toLowerCase();
      result = result.filter(o =>
        o.name?.toLowerCase().includes(query) ||
        o.phone?.toLowerCase().includes(query)
      );
    }

    // Date range
 

    // Sorting
    switch (filters.sortBy) {
      
      default:
        return result;
    }
  }, [orders, filters]);

  const clearFilters = () => setFilters(defaultFilters);

  return {
    filteredOrders,
    filters,
    setFilters,
    clearFilters,
  };
};

export default useOrderFilters;
