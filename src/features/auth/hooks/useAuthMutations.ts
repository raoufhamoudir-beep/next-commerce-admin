import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios'; // (الذي أنشأناه سابقاً)
import {type LoginFormValues,type RegisterFormValues } from '../types/schema';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import type { User } from '@/types';

// تسجيل الدخول
export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      // Endpoint الجديد
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate('/');
      // تتبع البيكسل يمكن إضافته هنا
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "خطأ في تسجيل الدخول");
    },
  });
};


export const logout =  async ()=>{
       await api.post('/auth/logout');
       window.location.replace("/login");

}

// التحقق من التوفر (للتسجيل)
export const useCheckAvailability = () => {
  return useMutation({
    mutationFn: async (data: { email: string; phone: string }) => {
      const res = await api.post('/user/check/emailphone', data);
      return res.data;
    },
  });
};

// التسجيل النهائي
export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      // تحويل البيانات لتناسب الباك اند
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };
      const res = await api.post('/auth/register', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم إنشاء الحساب بنجاح");
      navigate('/login');
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إنشاء الحساب");
    },
  });
};


export const useUpdateUser = () => {
  // Assuming useProducts uses the storeId to fetch the list
   const { refetch } = useUser(); 
       const navigate = useNavigate();

 
   return useMutation({
     // FIX: Accept ONE object with properties { id, data }
     mutationFn: async ({ data }: {  data: User }) => {    
        const res = await api.put(`/me`, data);
        return res.data;
     },
     onSuccess: () => {
        toast.success("Store updated successfully!");
        refetch(); 
        navigate(-1)
     },
     onError: (error: any) => {
        const msg = error?.response?.data?.message || "Something went wrong";
        toast.error(msg);
     },
   });
 };


 interface PasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

 export const useUpdatePassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: PasswordPayload) => {
       const res = await api.post(`/me/password`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      navigate(-1);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to update password";
      toast.error(msg);
    },
  });
};