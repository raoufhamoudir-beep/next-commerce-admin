import { Outlet, useParams } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/features/auth/hooks/useUser";
import Header from "../ui/Header";
import Sidebar from "../ui/SideBar";
import Madel from "../ui/Madel";
import LanguagePanel from "../ui/LanguagePanel";
import AccountPanel from "../ui/accountPanel";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
 
// Define what the User data looks like
 

const DashboardLayout = () => {
  const { data } = useUser()  // Cast to interface
 const {id} = useParams()
  const { i18n } = useTranslation("account"); // 2. Initialize translation

  // Renamed 'SemalHarder' to 'isSidebarCollapsed' for clarity
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  // const openSidebar = () => setSidebarCollapsed(false);

  const [showPanels, setShowPanels] = useState({
    languagePanel: false,
    accountPanel: false,
  });

  const openLanguagePanel = () =>
    setShowPanels((prev) => ({ ...prev, languagePanel: true }));
  const openAccountPanel = () =>
    setShowPanels((prev) => ({ ...prev, accountPanel: true }));
  const closePanels = () =>
    setShowPanels({ accountPanel: false, languagePanel: false });
  return (
    <div
    dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    className={`
            relative 
            min-h-screen 
            pb-10 
            w-full
            overflow-hidden
            transition-all duration-300 ease-in-out
            ${!id ? "md:pl-0" : isSidebarCollapsed
            ? i18n.language === 'ar' ? "md:pr-[80px]" : "md:pl-[80px]"  // Mini State (80px)
            :  i18n.language === 'ar' ? "md:pr-[280px]"  :  "md:pl-[280px]"  // Full State (280px)
          }
        `}>
      {/* Sidebar */}
     <Toaster />
 
      {/* Main Content */}
      <main  className="flex-1 w-full overflow-hidden ">

        <Header
           storeid={id}
          isPaid={data?.isPaid}
          openAccountPanel={openAccountPanel}
          openLanguagePanel={openLanguagePanel}
          toggleSidebar={toggleSidebar}
        />
       { id &&
         <Sidebar
        storeid={id}
        isPaid={data?.isPaid}
        name={data?.name}
        ordersCount={data?.ordersCount }
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />}
  {showPanels.languagePanel && <Madel  onClose={closePanels}><LanguagePanel hide={closePanels} /></Madel>}
      {showPanels.accountPanel && <Madel onClose={closePanels}><AccountPanel user={data} hide={closePanels} /></Madel>}
        {/* Dynamic Page Content */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;