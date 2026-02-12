import DashboardLayout from "@/components/layout/DashboardLayout";
import StoreLayout from "@/components/layout/StoreLayout";
import StoreUpdateLayout from "@/components/layout/StoreUpdateLayout";
import StoreUpdateThemeLayout from "@/components/layout/StoreUpdateThemLayout";
import ProtectedRoutes from "@/features/auth/components/ProtectedRoutes";
import AddCategories from "@/pages/AddCategories";
import AddProduct from "@/pages/AddProduct";
import Admin from "@/pages/Admin";
import Categories from "@/pages/Categories";
import Contact from "@/pages/Contact";
import CreateStore from "@/pages/CreateStore";
import DeliveryCompanies from "@/pages/DeliveryCompanies";
import DeliveryPrice from "@/pages/DeliveryPrice";
import FAQ from "@/pages/FAQ";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import LoginPage from "@/pages/LoginPage";
import Orders from "@/pages/Orders";
import Pixals from "@/pages/Pixals";
import Products from "@/pages/Products";
 import RegisterPage from "@/pages/RegisterPage";
import Setting from "@/pages/Setting";
import Store from "@/pages/Store";
import Upgrade from "@/pages/Upgrade";
import UpdateEmail from "@/pages/account/UpdateEmail";
import UpdateName from "@/pages/account/UpdateName";
import UpdatePassword from "@/pages/account/UpdatePassword";
import UpdatePhone from "@/pages/account/UpdatePhone";
import Checkout from "@/pages/checkout";
import UpdateContactInfo from "@/pages/storeUpdate/UpdateContactInfo";
import UpdateFaqs from "@/pages/storeUpdate/UpdateFaqs";
import UpdateLogo from "@/pages/storeUpdate/UpdateLogo";
import UpdateSettings from "@/pages/storeUpdate/UpdateSettings";
import StoreUpdateThemColor from "@/pages/storeUpdate/UpdateThem/StoreUpdateThemColor";
import StoreUpdateThemeCategory from "@/pages/storeUpdate/UpdateThem/StoreUpdateThemeCategory";
import StoreUpdateThemeHeader from "@/pages/storeUpdate/UpdateThem/StoreUpdateThemeHeader";
import StoreUpdateThemeProduct from "@/pages/storeUpdate/UpdateThem/StoreUpdateThemeProduct";
import StoreUpdateThemeThanks from "@/pages/storeUpdate/UpdateThem/StoreUpdateThemeThanks";
import Subscriptions from "@/pages/subscriptions";
 import { Routes, Route, Navigate } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<DashboardLayout />}>
          
          {/* Setting Routes - FIXED RELATIVE PATHS */}
            <Route path="/setting" element={<Setting />} />
            <Route path="/setting/update-name" element={<UpdateName />} />
            <Route path="/setting/update-phone" element={<UpdatePhone />} />
            <Route path="/setting/update-email" element={<UpdateEmail />} />
            <Route path="/setting/update-password" element={<UpdatePassword />} />
  
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          {/*  */}
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/Upgrade" element={<Upgrade />} />
          <Route path="/checkout" element={<Checkout />} />
          {/*  */}
          <Route path="/" element={<Admin />} />
          <Route path="/store/new" element={<CreateStore />} />
          
          {/* Store Routes */}
          <Route path="/store/:id" element={<StoreLayout />}>
            <Route index element={<Store />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="pixals" element={<Pixals />} />
            <Route path="categories" element={<Categories />} />
            <Route path="add-categories" element={<AddCategories />} />
            <Route path="delivery-prices" element={<DeliveryPrice />} />
            <Route path="delivery-companies" element={<DeliveryCompanies />} />
            
            <Route
            path="update" element={<StoreUpdateLayout />}
            >
              <Route path="logo" element={<UpdateLogo />} />
              <Route path="Contact-information" element={<UpdateContactInfo />} />
              <Route path="faqs" element={<UpdateFaqs />} />
              <Route path="setting" element={<UpdateSettings />} />
              <Route
              path="theme" element={<StoreUpdateThemeLayout />}
              >
                <Route index element={<StoreUpdateThemColor />}/>
                <Route path="product" element={<StoreUpdateThemeProduct />}/>
                <Route path="categories" element={<StoreUpdateThemeCategory />}/>
                <Route path="header" element={<StoreUpdateThemeHeader />}/>
                <Route path="thanks-page" element={<StoreUpdateThemeThanks />}/>
              </Route>
            </Route>
          </Route>

        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};