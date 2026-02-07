import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import type { orders, product } from '@/types';
import states from "@/constants/states.json";
import cityData from "@/constants/etat";
import { useTranslation } from 'react-i18next';

interface AddOrderProps {
    user: string;
    id: string;
    postOrder: (s: orders) => void;
    editeFull: (id: string, data: orders) => void;
    onclose: () => void;
    order: orders | null;
    products: product[];
}

const AddOrder = ({ postOrder, editeFull, onclose, order, products = [], id, user = "" }: AddOrderProps) => {
    const { t } = useTranslation("order");

    // 1. Setup State
    const [formData, setFormData] = useState<orders>({
        user: user,
        city: order?.city || "",
        store: order?.store || id,
        DelevryPrice: order?.DelevryPrice || 0,
        home: order?.home ?? true,
        name: order?.name || "",
        phone: order?.phone || "",
        price: order?.price || 0,
        productData: order?.productData || null,
        quantity: order?.quantity || 1,
        state: order?.state || "",
        total: order?.total || 0,
    });

    const [availableCities, setAvailableCities] = useState<any[]>([]);
    // Initialize fees to 0, but we will populate them in useEffect
    const [rideFees, setRideFees] = useState({ home: 0, office: 0 });

    // 2. Helper: Ensure numbers are actually numbers to avoid string concatenation errors
    const calculateTotal = (price: number | string, qty: number | string, ride: number | string) => {
        const p = Number(price) || 0;
        const q = Number(qty) || 0;
        const r = Number(ride) || 0;
        return (p * q) + r;
    };

    // 3. FIX: Initialize Cities AND Ride Fees when order loads
    useEffect(() => {
        if (order?.state) {
            const stateObj = states.find((s) => s.name === order.state);
            
            if (stateObj) {
                // Load Cities
                // @ts-ignore
                const cities = cityData.filter((c) => String(c.wilaya_code) === String(stateObj.code));
                setAvailableCities(cities);

                // FIX: Load the fees for this state immediately
                setRideFees({ 
                    home: stateObj.prix_initial || 0, 
                    office: stateObj.stop_back || 0 
                });
            }
        }
    }, [order]);

    // 4. Handle Text/Number Inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const val = ["price", "quantity", "DelevryPrice", "total"].includes(name) ? Number(value) : value;

        setFormData(prev => {
            const newData = { ...prev, [name]: val };
            
            // Recalculate Total immediately using the NEW values
            if (name === 'price' || name === 'quantity' || name === 'DelevryPrice') {
                newData.total = calculateTotal(
                    newData.price, 
                    newData.quantity, 
                    newData.DelevryPrice
                );
            }
            return newData as orders;
        });
    };

    // 5. FIX: Handle State Change
    const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const stateCode = e.target.value;
        const stateObj = states.find((s) => String(s.code) === String(stateCode));
        
        // @ts-ignore
        const cities = cityData.filter((c) => String(c.wilaya_code) === String(stateCode));
        setAvailableCities(cities);

        const homePrice = stateObj?.prix_initial || 0;
        const officePrice = stateObj?.stop_back || 0;

        // Update local fees state
        setRideFees({ home: homePrice, office: officePrice });

        // Calculate new delivery price based on CURRENT home/stopdesk selection
        const newRidePrice = formData.home ? homePrice : officePrice;

        setFormData((prev) => ({
            ...prev,
            state: stateObj?.name || "",
            city: "", // Reset city when state changes
            DelevryPrice: newRidePrice,
            total: calculateTotal(prev.price, prev.quantity, newRidePrice)
        }));
    };

    // 6. FIX: Handle Delivery Mode (Home vs Stop Desk)
    const handleDeliveryMode = (isHome: boolean) => {
        // Use the rideFees state which is now guaranteed to be populated
        const newRidePrice = isHome ? rideFees.home : rideFees.office;

        setFormData(prev => ({
            ...prev,
            home: isHome,
            DelevryPrice: newRidePrice,
            total: calculateTotal(prev.price, prev.quantity, newRidePrice)
        }));
    };

    // 7. Handle Item Selection
    const handleItemChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedProduct = products.find(item => item._id === selectedId);

        if (selectedProduct) {
            setFormData(prev => ({
                ...prev,
                productData: selectedProduct,
                price: selectedProduct.price, // Update price from product
                total: calculateTotal(selectedProduct.price, prev.quantity, prev.DelevryPrice)
            }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.state) {
            toast.error("Please fill in the required fields");
            return;
        }
        if (!formData.productData) {
            toast.error("You must have an item");
            return;
        }

        if (order && order._id) {
            editeFull(order._id, formData);
            onclose();
        } else {
            postOrder(formData);
            onclose();
        }
    };

    return (
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-scroll max-h-[80vh]">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                {order ? t('Edit Order') : t('Add New Order')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t("Customer Name")}
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                            placeholder="Full Name" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                           {t("Phone Number")}
                        </label>
                        <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                            placeholder="05 XX XX XX XX" 
                            required 
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t("State")} 
                        </label>
                        <select 
                            onChange={handleStateChange} 
                            value={formData.state ? states.find(s => s.name === formData.state)?.code : ""}
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                            required
                        >
                            <option value="">Select State</option>
                            {states.map((s) => (
                                <option key={s.code} value={s.code}>
                                    {s.code} - {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t("City")}
                        </label>
                        <select 
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange} 
                            disabled={!formData.state} 
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 outline-none disabled:opacity-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                            required
                        >
                            <option value="">Select City</option>
                            {availableCities.map((c, index) => (
                                <option key={index} value={c.commune_name}>
                                    {c.commune_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="h-px bg-gray-100 my-2"></div>

                {/* Product */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        {t("Select Product")}
                    </label>
                    <select 
                        onChange={handleItemChange} 
                        value={formData.productData?._id || ""}
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                        <option value="">{t("Choose a product...")}</option>
                        {products.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t("Item Price")}
                        </label>
                        <input 
                            type="number" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleChange} 
                            className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2.5 outline-none font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t("Qty")}
                        </label>
                        <input 
                            type="number" 
                            name="quantity" 
                            min="1" 
                            value={formData.quantity} 
                            onChange={handleChange} 
                            className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2.5 outline-none font-medium text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                        />
                    </div>
                </div>

                {/* Delivery */}
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <span className="text-sm font-semibold text-purple-900">{t("Delivery Options")}</span>
                        <div className="flex bg-white rounded-lg p-1 border border-purple-100 shadow-sm">
                            <button 
                                type="button" 
                                onClick={() => handleDeliveryMode(true)} 
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                    formData.home ? 'bg-purple-100 text-purple-700' : 'text-gray-500'
                                }`}
                            >
                                {t("Home")}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleDeliveryMode(false)} 
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                    !formData.home ? 'bg-purple-100 text-purple-700' : 'text-gray-500'
                                }`}
                            >
                                {t("Stop Desk")}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-purple-700 mb-1.5">
                            {t("Shipping Fee")}
                        </label>
                        <input 
                            type="number" 
                            name="DelevryPrice" 
                            value={formData.DelevryPrice} 
                            onChange={handleChange} 
                            className="w-full border border-purple-200 bg-white rounded-lg pl-4 pr-12 py-2.5 outline-none font-bold text-purple-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                        />
                    </div>
                </div>

                {/* Total */}
                <div className="pt-2">
                    <label className="block text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                        {t("Total Amount")}
                    </label>
                    <div className="relative group">
                        <input 
                            type="number" 
                            name="total" 
                            value={formData.total} 
                            onChange={handleChange} 
                            className="w-full border-2 border-gray-200 bg-white rounded-xl pl-4 pr-16 py-4 text-2xl font-bold text-gray-900 focus:border-purple-500 outline-none transition-all" 
                        />
                        <span className="absolute right-6 top-5 text-base text-gray-400 font-semibold">
                            DZD
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={onclose} 
                        className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        {t("Cancel")}
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-gray-800 shadow-lg transition-colors"
                    >
                        {order ? t('Update Order') : t('Confirm Order')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddOrder;