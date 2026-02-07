import { api } from "@/lib/axios";
import type { FormValues } from "../types/schema";
import { useNavigate } from "react-router-dom";
import { useMutation   } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUser } from "@/features/auth/hooks/useUser";
import { useStore } from "@/features/store/hooks/UseStore";
import type { Store } from "@/types";

export const useStoreRegister = () => {
  const navigate = useNavigate();
const {refetch} = useUser()
  return useMutation({
    mutationFn: async (data: FormValues) => {    
      const res = await api.post('/store/register', data);
      refetch()
      return res.data;
    },
    onSuccess: () => {
      toast.success("Store created successfully!");
      
      // Optional: Refresh a list of stores if you have one
      // queryClient.invalidateQueries({ queryKey: ['stores'] });

      navigate('/');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    },
  });
};





export const useDeleteStore = () => {
  const navigate = useNavigate();
const {refetch} = useUser()
  return useMutation({
    mutationFn: async (id: string) => {    
      const res = await api.delete(`/store/${id}`);
      refetch()
      return res.data;
    },
    onSuccess: () => {
      toast.success("Store created successfully!");
      
      // Optional: Refresh a list of stores if you have one
      // queryClient.invalidateQueries({ queryKey: ['stores'] });

      navigate('/');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    },
  });
};



export const useUpdateStore = (storeId: string) => {
  // Assuming useProducts uses the storeId to fetch the list
  const { refetch } = useStore(storeId); 

  return useMutation({
    // FIX: Accept ONE object with properties { id, data }
    mutationFn: async ({ id, data }: { id: string | undefined; data: Store }) => {    
       const res = await api.put(`/store/${id}`, data);
       return res.data;
    },
    onSuccess: () => {
       toast.success("Store updated successfully!");
       refetch(); 
    },
    onError: (error: any) => {
       const msg = error?.response?.data?.message || "Something went wrong";
       toast.error(msg);
    },
  });
};