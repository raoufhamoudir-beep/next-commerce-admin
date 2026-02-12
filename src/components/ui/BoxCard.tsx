import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LuArrowRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import { type ReactNode } from "react";

interface BoxCardProps {
  className?: string;
  children: ReactNode;
  about: string;
  link?: string;
  small?: boolean;
  button?: string;
  onclick?: () => void;
  buttonicon?: ReactNode;
}

const BoxCard = ({
  className = "",
  children,
  about,
  link,
  small,
  button,
  onclick,
  buttonicon
}: BoxCardProps) => {
  const { t } = useTranslation("store");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white/80 backdrop-blur-sm w-[95%] md:w-full mx-auto 
        py-4 px-6 rounded-2xl 
        shadow-lg shadow-purple-100/50 
        border border-purple-100/50
        hover:shadow-xl hover:shadow-purple-200/50
        transition-all duration-300
        ${className}
      `}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${small ? "mb-3" : "mb-6"}`}>
        {/* Title with Gradient Accent */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
          <h2 className="text-lg font-bold text-gray-800">{about}</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {button && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onclick}
              className="
                flex items-center gap-2 
                text-purple-600 hover:text-purple-700 
                font-medium text-sm
                px-4 py-2 rounded-lg
                bg-purple-50 hover:bg-purple-100
                transition-colors duration-200
              "
            >
              {buttonicon}
              {button}
            </motion.button>
          )}

          {link && (
            <Link
              to={`/${link}`}
              className="
                flex items-center gap-1
                text-sm text-indigo-600 hover:text-indigo-700
                font-medium underline-offset-2 hover:underline
                transition-colors duration-200
              "
            >
              {t("ViewDetails")}
              <LuArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
};

export default BoxCard;