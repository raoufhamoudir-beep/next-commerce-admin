import { api } from "@/lib/axios";
import type { OfferPayload, PlanOffer } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export const useGetMyOffer = () => {
  return useQuery({
    // 1. UNIQUE KEY: We add storeId here. 
    // If we don't, React Query will think Store A and Store B are the same data.
    queryKey: ['offer'], 
    
    queryFn: async (): Promise<PlanOffer[]> => {
      // 2. DYNAMIC URL: We inject the ID into the request path
      // Example: GET /store/123
      const { data } = await api.get(`/offer`); 
      return data.result;
    },

  

    retry: false,
    staleTime: 1000 * 60 * 60, 
  });
};


export const useOfferRegister = () => {
  const navigate = useNavigate();
   return useMutation({
    mutationFn: async (data: OfferPayload) => {    
      const res = await api.post('/offer', data);
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