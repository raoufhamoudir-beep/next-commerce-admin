import { api } from "@/lib/axios";
 import { useMutation   } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useOrders } from "./useOrders";
import type { orders } from "@/types";
   
export const useAddOrder = (id: string | undefined) => {
  const {refetch} = useOrders(id) 
  return useMutation({
      mutationFn: async (data: orders) => {    
        console.log(data);
        
      const res = await api.post('/orders', data);
      refetch()
      return res.data;
    },
    onSuccess: () => {
      toast.success("Store created successfully!");
      
      // Optional: Refresh a list of stores if you have one
      // queryClient.invalidateQueries({ queryKey: ['stores'] });
 
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    },
  });
};





export const useDeleteOrder = (id: string | undefined) => {
  const {refetch} = useOrders(id) 
   return useMutation({
      mutationFn: async (id: string   ) => {    
       const res = await api.delete(`/orders/${id}`);
       return res.data;
    },
    onSuccess: () => {
      toast.success("Store created successfully!");
      refetch()
      // Optional: Refresh a list of stores if you have one
      // queryClient.invalidateQueries({ queryKey: ['stores'] });

     },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    },
  });
};


export const useUpdateOrder = (storeId: string | undefined) => {
  // Assuming useOrders uses the storeId to fetch the list
  const { refetch } = useOrders(storeId); 

  return useMutation({
    // FIX: Accept ONE object with properties { id, data }
    mutationFn: async ({ id, data }: { id: string; data: orders }) => {    
       const res = await api.put(`/orders/${id}`, data);
       return res.data;
    },
    onSuccess: () => {
       toast.success("Order updated successfully!");
       refetch(); 
    },
    onError: (error: any) => {
       const msg = error?.response?.data?.message || "Something went wrong";
       toast.error(msg);
    },
  });
};