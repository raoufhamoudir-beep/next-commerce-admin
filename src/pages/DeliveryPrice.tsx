import  { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Search,  Loader2, Home, Building2, MapPin, X } from 'lucide-react'

// Hooks & Types
import { useDeliveryPrice, useUpdateDeliveryPrice } from '@/features/DeliveryPrice/hook/useDeliveryPrice'
import type { DeliveryPrices, DeliveryPrice as DeliveryPriceType } from '@/types'

// Components
import PageContainer from '@/components/ui/PageContainer'
import Modal from '@/components/ui/Madel'
import Tutorial from '@/components/ui/Tutorial'
import SaveModal from '@/components/ui/SaveModal'

const DeliveryPrice = () => {
    const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation("Delivery");
    const currentLang = i18n.language

    // --- State ---
    const [showTutorial, setShowTutorial] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDirty, setIsDirty] = useState(false)
    const [localStates, setLocalStates] = useState<DeliveryPriceType[]>([])

    // --- Queries & Mutations ---
    const { data: serverData, isLoading } = useDeliveryPrice(id)
    const { mutate: updatePrices, isPending: isSaving } = useUpdateDeliveryPrice(id)

    // --- Sync Server Data ---
    useEffect(() => {
        if (serverData?.States) {
            setLocalStates(serverData.States)
            setIsDirty(false)
        }
    }, [serverData])

    // --- Handlers ---
    const handleInputChange = (stateId: number, field: keyof DeliveryPriceType, value: string) => {
        setLocalStates((prev) =>
            prev.map((item) =>
                item.id === stateId ? { ...item, [field]: Number(value) } : item
            )
        )
        setIsDirty(true)
    }

   

    const handleSave = () => {
        if (!id) return;
        const payload: DeliveryPrices = {
            store: serverData?.store,
            States: localStates
        }
        updatePrices(
            { id, data: payload },
            {
                onSuccess: () => setIsDirty(false)
            }
        )
    }

    // --- Filtering ---
    const filteredStates = useMemo(() => {
        return localStates.filter((state) => {
            const name = currentLang === "ar" ? state.ar_name : state.name
            const searchLower = searchTerm.toLowerCase()
            return (
                name?.toLowerCase().includes(searchLower) ||
                state.code?.toLowerCase().includes(searchLower) ||
                state.id.toString().includes(searchLower)
            )
        })
    }, [localStates, searchTerm, currentLang])

    // --- Render Loading ---
    if (isLoading) {
        return (
            <PageContainer title={t("delivery")} about={t("Prices")}>
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                    <Loader2 className="animate-spin h-12 w-12 text-teal-600" />
                    <p className="text-purple-500 font-medium animate-pulse">{t("Loading data...")}</p>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer
            title={t("delivery")}
            about={t("Prices")}
        >
            {showTutorial && (
                <Modal onClose={() => setShowTutorial(false)}>
                    <Tutorial about={"https://firebasestorage.googleapis.com/v0/b/tawssilatrest.appspot.com/o/%D8%AA%D8%B9%D8%AF%D9%8A%D9%84%20%D8%A7%D8%B3%D8%B9%D8%A7%D8%B1%20%D8%A7%D9%84%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20next%20comerce.mp4?alt=media&token=9d932c1b-8284-48c6-8d8d-cadad861694f"} />
                </Modal>
            )}

            {/* --- Sticky Search Header --- */}
                 <div className="relative w-full shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl bg-white group border border-purple-100 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-100">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-transparent border-none text-gray-900 placeholder-gray-400 focus:ring-0 text-base"
                        placeholder={t("Search by State Name or Number...")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-purple-500 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
 
            {/* --- Grid Section --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-24">
                <AnimatePresence mode='popLayout'>
                    {filteredStates.map((state) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            key={state.id}
                            className="group bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Decorative Top Gradient Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 font-bold text-sm border border-purple-100 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    {state.id}
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg truncate flex-1">
                                    {currentLang === "ar" ? state.ar_name : state.name}
                                </h3>
                            </div>

                            {/* Inputs Container */}
                            <div className="space-y-4">
                                {/* Home Delivery Input */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 ml-1 flex items-center gap-1">
                                        <Home className="w-3 h-3 text-teal-500" /> {t("ToHome")}
                                    </label>
                                    <div className="relative group/input">
                                        <input
                                            type="number"
                                            className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                            value={state.prix_initial}
                                            onChange={(e) => handleInputChange(state.id, "prix_initial", e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400 group-focus-within/input:text-teal-600 transition-colors">DZD</span>
                                    </div>
                                </div>

                                {/* Office Delivery Input */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 ml-1 flex items-center gap-1">
                                        <Building2 className="w-3 h-3 text-purple-500" /> {t("ToOffice")}
                                    </label>
                                    <div className="relative group/input">
                                        <input
                                            type="number"
                                            className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                                            value={state.stop_back}
                                            onChange={(e) => handleInputChange(state.id, "stop_back", e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400 group-focus-within/input:text-purple-600 transition-colors">DZD</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredStates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <MapPin className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-600">{t("No states found matching your search.")}</p>
                </div>
            )}

            {/* --- IMPROVED UX: Floating Action Dock --- */}
           <SaveModal
           isDirty={isDirty}
           handleSave={handleSave}
           isSaving={isSaving}
           />
        </PageContainer>
    )
}

export default DeliveryPrice