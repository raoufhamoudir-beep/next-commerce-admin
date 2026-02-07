import { Clock, Tag, Ruler, Palette, User, MapPin, HomeIcon, Building2, Phone, Package, Truck } from "lucide-react";
import type { ReactNode } from "react";

/**
 * OrderCardHeader Component
 * Displays order ID and time elapsed since creation
 */
interface OrderCardHeaderProps {
    orderId: string;
    timeAgo: string;
    t: (key: string) => string;
}

export const OrderCardHeader = ({ orderId, timeAgo, t }: OrderCardHeaderProps) => {
    
    return (
        <div className="flex justify-between items-start mb-4 pl-2">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t("OrderID")}
                </span>
                <span className="text-sm font-bold text-gray-900 font-mono">
                    #{orderId.slice(-6)}
                </span>
            </div>
            <div className="flex items-center text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                <Clock size={12} className="mr-1" />
                {timeAgo} {t("ago")}
            </div>
        </div>
    );
};

/**
 * OrderProductImage Component
 * Displays product image with quantity badge
 */
interface OrderProductImageProps {
    imageUrl: string;
    productName: string;
    quantity: number;

}

export const OrderProductImage = ({ imageUrl, productName, quantity }: OrderProductImageProps) => {
    return (
        <div className="relative shrink-0">
            <img
                className="h-16 w-16 rounded-xl object-cover shadow-sm border border-gray-100"
                src={imageUrl}
                alt={productName}
            />
            <div className="absolute -bottom-2 -right-2 bg-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border shadow-sm">
                x{quantity}
            </div>
        </div>
    );
};

/**
 * OrderVariants Component
 * Displays size and color variants if available
 */
interface OrderVariantsProps {
    size?: string;
    color?: string;
}

export const OrderVariants = ({ size, color }: OrderVariantsProps) => {
    if (!size && !color) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {size && (
                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                    <Ruler size={10} className="text-gray-400" />
                    <span>{size}</span>
                </div>
            )}
            {color && (
                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                    <Palette size={10} className="text-gray-400" />
                    <span
                        className="w-2 h-2 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: color }}
                    />
                    <span>{color}</span>
                </div>
            )}
        </div>
    );
};

/**
 * OrderOfferBadge Component
 * Displays offer badge if order has an offer
 */
interface OrderOfferBadgeProps {
    offerName?: string;
}

export const OrderOfferBadge = ({ offerName }: OrderOfferBadgeProps) => {
    if (!offerName) return null;

    return (
        <div className="mb-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                <Tag size={10} className="stroke-[2.5px]" />
                <span className="truncate max-w-[150px]">{offerName}</span>
            </div>
        </div>
    );
};

/**
 * OrderCustomerInfo Component
 * Displays customer name, location, delivery type, and phone
 */
interface OrderCustomerInfoProps {
    name: string;
    city: string;
    state: string;
    isHomeDelivery: boolean;
    phone: string;
    showPhone: (phone?: string) => string;
    t: (key: string) => string;
}

export const OrderCustomerInfo = ({ 
    name, 
    city, 
    state, 
    isHomeDelivery, 
    phone,
    showPhone,
    t 
}: OrderCustomerInfoProps) => {
    return (
        <>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                <User size={12} />
                <span className="truncate">{name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                <MapPin size={12} />
                <span className="truncate">{city} - {state}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                {isHomeDelivery ? <HomeIcon size={12} /> : <Building2 size={12} />}
                <span className="truncate">
                    {isHomeDelivery ? t("HomeDelivery") : t("Office")}
                </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <Phone size={12} />
                {showPhone(phone)}
            </div>
        </>
    );
};

/**
 * OrderPricing Component
 * Displays product price, delivery price, and total
 */
interface OrderPricingProps {
    productPrice: number;
    deliveryPrice: number;
    totalPrice: number;
    t: (key: string) => string;
}

export const OrderPricing = ({ productPrice, deliveryPrice, totalPrice, t }: OrderPricingProps) => {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                <span className="flex items-center gap-1">
                    <Package size={10} /> {productPrice}
                </span>
                <span className="text-gray-300">|</span>
                <span className={`flex items-center gap-1 font-medium ${
                    deliveryPrice === 0 ? "text-green-600 font-bold" : "text-teal-600"
                }`}>
                    <Truck size={10} />
                    {deliveryPrice === 0 ? t("FREE") : deliveryPrice}
                </span>
            </div>
            <div className="text-lg font-bold text-teal-700 leading-none">
                {totalPrice} <span className="text-xs font-normal text-teal-600">DZD</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">{t("TotalAmount")}</div>
        </div>
    );
};

/**
 * OrderStatusBadge Component
 * Displays order status as a clickable badge
 */
interface OrderStatusBadgeProps {
    status: {
        key: string;
        label: string;
        color: string;
        icon: ReactNode;
    };
    isLocked: boolean;
    onClick: () => void;
}

export const OrderStatusBadge = ({ status, isLocked, onClick }: OrderStatusBadgeProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all 
            ${status.color || "bg-gray-100 text-gray-800 border-gray-200"}
            ${isLocked ? "opacity-75 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}`}
        >
            {status.icon}
            {status.label}
        </button>
    );
};