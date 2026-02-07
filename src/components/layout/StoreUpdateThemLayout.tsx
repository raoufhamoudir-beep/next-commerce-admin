import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useResolvedPath } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import BoxCard from '../ui/BoxCard';
import ThemeLinks from '@/features/StoreUpdate/constants/ThemLinks';

const StoreUpdateThemeLayout = () => {
    const { t } = useTranslation("store");
    const location = useLocation();
    
    // Get the base path of this layout to ensure robust matching
    const { pathname: basePath } = useResolvedPath("."); 

    // Robust Logic: Find active link by comparing current path with the base path + link path
    // This works even if you change the parent route from /update/theme to /admin/store/123/theme
    const current = ThemeLinks.find(link => {
        // Construct the full expected path for this link
        const linkPath = link.link === '' 
            ? basePath 
            : `${basePath.replace(/\/$/, '')}/${link.link}`; // Remove trailing slash from base if exists
        
        // Check for exact match or if it's a sub-route (optional, depending on depth)
        return location.pathname === linkPath || location.pathname.startsWith(`${linkPath}/`);
    }) || ThemeLinks[0];

    return (
        <BoxCard about={t("theme")} small={true} className="overflow-hidden">

            {/* 2. Modern Scrollable Navigation Bar */}
            <div className='border-b border-gray-100 pb-1 mb-6'>
                <div className='flex items-center gap-1 overflow-x-auto no-scrollbar py-2'>
                    {ThemeLinks.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.link}
                            end={link.link === ''}
                            className={({ isActive }) => `
                                relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap z-10
                                ${isActive 
                                    ? 'text-teal-700' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Animated Background for Active State */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-teal-50 rounded-xl border border-teal-100"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}
                                    <span className="relative z-10">{t(link.name)}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* 3. Dynamic Title & Description Area */}
            <motion.div
                key={current.name} // Triggers animation when tab changes
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='mb-6'
            >
                <div className="flex items-center gap-2 mb-1">
                    {/* Optional: If you add icons to ThemeLinks, render them here */}
                    {/* <span className="text-teal-600">{link.icon}</span> */}
                    <h2 className="text-lg font-bold text-gray-800">
                        {t(current.title)} {/* Handling potential typo in your data */}
                    </h2>
                </div>
               
            </motion.div>

            {/* 4. Render Child Routes */}
            <div className="min-h-[200px]"> {/* Min height to prevent jumping */}
                <Outlet />
            </div>
        </BoxCard>
    );
}

export default StoreUpdateThemeLayout;