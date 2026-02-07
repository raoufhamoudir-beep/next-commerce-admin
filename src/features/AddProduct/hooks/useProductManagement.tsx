import { api } from "@/lib/axios";
 import { useMutation   } from "@tanstack/react-query";
import toast from "react-hot-toast";
 import type { product } from "@/types";
import { useProducts } from "@/features/products/hooks/UseProducts";
 
export const useAddProduct = (id: string | undefined) => {
  const {refetch} = useProducts(id) 
  return useMutation({
      mutationFn: async (data: product) => {    
        console.log(data);
        
      const res = await api.post('/products', data);
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





export const useDeleteProduct = (id: string) => {
  const {refetch} = useProducts(id) 
   return useMutation({
      mutationFn: async (id: string   ) => {    
       const res = await api.delete(`/products/${id}`);
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


export const useUpdateProduct = (storeId: string) => {
  // Assuming useProducts uses the storeId to fetch the list
  const { refetch } = useProducts(storeId); 

  return useMutation({
    // FIX: Accept ONE object with properties { id, data }
    mutationFn: async ({ id, data }: { id: string; data: product }) => {    
       const res = await api.put(`/products/${id}`, data);
       return res.data;
    },
    onSuccess: () => {
       toast.success("Product updated successfully!");
       refetch(); 
    },
    onError: (error: any) => {
       const msg = error?.response?.data?.message || "Something went wrong";
       toast.error(msg);
    },
  });
};