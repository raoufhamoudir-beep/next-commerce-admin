import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { Loader2 } from "lucide-react";

const ProtectedRoutes = () => {
  const { data: user, isLoading, isError } = useUser();
  const location = useLocation();
 
  // 1. حالة التحميل: لا نظهر شياً، فقط لودر
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
            <p className="text-gray-500 text-sm">جاري التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  // 2. حالة الفشل (غير مسجل دخول): نطرده لصفحة الدخول
  // state={{ from: location }} تفيدنا لنعيده لنفس الصفحة بعد الدخول
  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // 3. حالة النجاح: اسمح له بالدخول
  return <Outlet />;
};

export default ProtectedRoutes;