import { motion } from 'framer-motion';
import BoxCard from '@/components/ui/BoxCard';
import type { orders } from '@/types';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, 
  Clock, 
  Eye, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface StatsProps {
    orders: orders[];
    visit: number;
}

const Stats = ({ orders = [], visit }: StatsProps) => {
    const { t } = useTranslation("store"); 
    
    // Filter Orders
    const ConfirmedOrder = orders.filter(e =>
        e.status !== undefined &&
        ["confirmed", "ready", "in company"].includes(e.status)
    );

    const PendingOrder = orders.filter(e =>
        e.status !== undefined &&
        ["pending", "Connection failed 1", "Connection failed 2", "Connection failed 3", "Postponed"].includes(e.status)
    );

    // Calculate Earnings
    const totalEarnings = ConfirmedOrder.reduce((acc, curr) => acc + (curr.price || 0), 0);

    // Stats Data
    const statsData = [
        {
            label: t("SoldProducts"),
            value: ConfirmedOrder.length,
            icon: ShoppingCart,
            gradient: "from-purple-500 to-indigo-500",
            bg: "bg-purple-50",
            iconBg: "bg-purple-100",
            trend: "+12%",
            trendUp: true
        },
        {
            label: t("NewOrders"),
            value: PendingOrder.length,
            icon: Clock,
            gradient: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
            trend: "+5",
            trendUp: true
        },
        {
            label: t("Visits"),
            value: visit,
            icon: Eye,
            gradient: "from-slate-500 to-gray-500",
            bg: "bg-slate-50",
            iconBg: "bg-slate-100",
            trend: "0%",
            trendUp: false
        },
        {
            label: t("Earnings"),
            value: `${totalEarnings} DA`,
            icon: DollarSign,
            gradient: "from-green-500 to-emerald-500",
            bg: "bg-green-50",
            iconBg: "bg-green-100",
            trend: "+8%",
            trendUp: true
        }
    ];

    return (
        <BoxCard about={t('Overview')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    const TrendIcon = stat.trendUp ? TrendingUp : stat.trend === "0%" ? Minus : TrendingDown;
                    
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className={`
                                relative overflow-hidden rounded-2xl p-5 
                                bg-white border-2 border-transparent
                                hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50
                                transition-all duration-300 cursor-pointer
                            `}
                        >
                            {/* Background Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03]`} />
                            
                            {/* Content */}
                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-sm`}>
                                        <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                                        <div className={`absolute w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-20`} />
                                    </div>
                                    
                                    {/* Trend Badge */}
                                    <div className={`
                                        flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
                                        ${stat.trendUp ? 'bg-green-50 text-green-700' : 
                                          stat.trend === "0%" ? 'bg-gray-50 text-gray-600' : 
                                          'bg-red-50 text-red-700'}
                                    `}>
                                        <TrendIcon className="w-3 h-3" />
                                        {stat.trend}
                                    </div>
                                </div>

                                {/* Label */}
                                <p className="text-sm text-gray-600 font-medium mb-1">
                                    {stat.label}
                                </p>

                                {/* Value */}
                                <p className="text-2xl font-bold text-gray-800">
                                    {stat.value}
                                </p>

                                {/* Bottom Line Indicator */}
                                <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '70%' }}
                                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                                    />
                                </div>
                            </div>

                            {/* Floating Decorative Circle */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.05, 0.1, 0.05]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl`}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </BoxCard>
    );
};

export default Stats;