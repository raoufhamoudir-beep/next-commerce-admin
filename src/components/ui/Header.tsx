import { motion } from "framer-motion";
import { 
  Menu, 
  Bell, 
  User, 
  Globe, 
  Settings,
  CreditCard,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface HeaderProps {
  storeid?: string;
  isPaid?: boolean;
  openAccountPanel: () => void;
  openLanguagePanel: () => void;
  toggleSidebar: () => void;
}

const Header = ({
  storeid,
  isPaid,
  openAccountPanel,
  openLanguagePanel,
  toggleSidebar
}: HeaderProps) => {
  const { t } = useTranslation("account");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="sticky top-0 z-[400] w-full bg-white/80 backdrop-blur-xl border-b border-purple-100/50 shadow-sm"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Toggle Sidebar Button */}
          {storeid && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300"
            >
              <Menu className="w-5 h-5 text-white" />
            </motion.button>
          )}

          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md"
            >
              <span className="text-white font-bold text-xl">E</span>
            </motion.div>
            <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("Dashboard") || "Dashboard"}
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          
          {/* Upgrade Badge (if not paid) */}
          {!isPaid && (
            <Link to="/upgrade">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all duration-300"
              >
                <CreditCard className="w-4 h-4" />
                {t("Upgrade") || "Upgrade"}
              </motion.div>
            </Link>
          )}

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center justify-center transition-colors duration-200"
          >
            <Bell className="w-5 h-5 text-purple-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* Language Selector */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openLanguagePanel}
            className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors duration-200"
          >
            <Globe className="w-5 h-5 text-indigo-600" />
          </motion.button>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-100 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-200/50 border border-purple-100/50 overflow-hidden z-50"
              >
                <div className="p-2">
                  <button
                    onClick={() => { openAccountPanel(); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors duration-200 text-left"
                  >
                    <Settings className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700 font-medium">{t("account_settings")}</span>
                  </button>
                  
                  {!isPaid && (
                    <Link to="/upgrade" onClick={() => setShowDropdown(false)}>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors duration-200 text-left">
                        <CreditCard className="w-5 h-5 text-orange-600" />
                        <span className="text-gray-700 font-medium">{t("Upgrade")}</span>
                      </button>
                    </Link>
                  )}

                  <div className="h-px bg-gray-200 my-2" />

                  <button
                    onClick={() => {
                      // Handle logout
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors duration-200 text-left"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700 font-medium">{t("logout")}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar (optional - if not paid) */}
      {!isPaid && (
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-pulse"></div>
      )}
    </motion.header>
  );
};

export default Header;