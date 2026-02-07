import { api } from "@/lib/axios";
 import { useMutation, useQuery   } from "@tanstack/react-query";
import toast from "react-hot-toast";
 
import type { DeliveryPrices  } from "@/types";

export const useDeliveryPrice = (storeId: string | undefined) => {
  return useQuery({
    // 1. UNIQUE KEY: We add storeId here. 
    // If we don't, React Query will think Store A and Store B are the same data.
    queryKey: ['DeliveryPrice', storeId], 
    
    queryFn: async (): Promise<DeliveryPrices> => {
      // 2. DYNAMIC URL: We inject the ID into the request path
      // Example: GET /store/123
      const { data } = await api.get(`/DeliveryPrice/${storeId}`); 
      return data.result;
    },

    // 3. ENABLED CHECK: This prevents the query from running if 
    // storeId is null, undefined, or an empty string.
    enabled: !!storeId, 

    retry: false,
    staleTime: 1000 * 60 * 60, 
  });
};





export const useUpdateDeliveryPrice = (storeId: string | undefined) => {
 const {refetch} = useDeliveryPrice(storeId)
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | undefined; data: DeliveryPrices }) => {    
       const res = await api.put(`/DeliveryPrice/${id}`, data);
      refetch()
      return res.data;
    },
    onSuccess: () => {
      toast.success("Store created successfully!");
     ;

     },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    },
  });
};



 