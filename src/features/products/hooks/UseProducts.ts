import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {  product } from '@/types'; // Assuming 'orders' is the interface for a SINGLE order

export const useProducts = (storeId: string | undefined) => {
  return useQuery({
    queryKey: ['product', storeId],
    // Update return type to Promise<orders[]> (Array of orders)
    queryFn: async (): Promise<product[]> => {
      const { data } = await api.get(`/products/my/${storeId}`);
      // Ensure this actually returns an array. If backend wraps it, use data.result
      return data.result || []; 
    },
    enabled: !!storeId,
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
};