import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Store } from '@/types';

// Accepts storeId (string) or potentially undefined/null
export const useStore = (storeId: string | undefined) => {
  return useQuery({
    // 1. UNIQUE KEY: We add storeId here. 
    // If we don't, React Query will think Store A and Store B are the same data.
    queryKey: ['store', storeId], 
    
    queryFn: async (): Promise<Store> => {
      // 2. DYNAMIC URL: We inject the ID into the request path
      // Example: GET /store/123
      const { data } = await api.get(`/store/${storeId}`); 
      return data.result;
    },

    // 3. ENABLED CHECK: This prevents the query from running if 
    // storeId is null, undefined, or an empty string.
    enabled: !!storeId, 

    retry: false,
    staleTime: 1000 * 60 * 60, 
  });
};