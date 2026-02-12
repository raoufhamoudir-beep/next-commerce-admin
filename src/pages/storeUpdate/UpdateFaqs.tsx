import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Loader2, Plus } from 'lucide-react';

// Components
import BoxCard from '@/components/ui/BoxCard';
import { useStore } from '@/features/store/hooks/UseStore';
import { useUpdateStore } from '@/features/admin/hook/useStoreManagement';
import FaqList from '@/features/StoreUpdate/components/FaqList';
import FaqFormModal from '@/features/StoreUpdate/components/FaqFormModal';
import SaveModal from '@/components/ui/SaveModal';
 
// Sub-Components (Defined below for easy copy-paste, but normally in separate files)
 
 
// --- Types ---
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const UpdateFaqs = () => {
  const { t } = useTranslation("store"); // 👈 load dashboard.json
  const { id } = useParams();

  // --- API Hooks ---
  const { data: store, isLoading: isStoreLoading } = useStore(id);
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  // --- State ---
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);

  // --- Sync Data ---
  useEffect(() => {
    if (store?.faqs) setFaqs(store.faqs);
  }, [store]);

  // --- Actions ---

  const handleAddOrUpdate = (item: FaqItem) => {
    if (editingItem) {
      // Update existing
      setFaqs(prev => prev.map(f => f.id === item.id ? item : f));
    } else {
      // Add new
      setFaqs(prev => [...prev, item]);
    }
    setHasChanges(true);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    setFaqs(prev => prev.filter(f => f.id !== id));
     setHasChanges(true);
  };

  const handleReorder = (newOrder: FaqItem[]) => {
    setFaqs(newOrder);
    setHasChanges(true);
  };

  const handleServerSave = () => {
    if (!store || !id) return;
    if (!hasChanges) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    updateStore({ id, data: { ...store, faqs } }, {
      onSuccess: () => {
        toast.success(t("FAQs updated successfully"));
        setHasChanges(false);
      },
      onError: () => toast.error(t("Failed to update FAQs"))
    });
  };

  // --- Loading View ---
  if (isStoreLoading) {
    return (
      <BoxCard about={t("FrequentlyAsked")} small={true} className="py-1">
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      </BoxCard>
    );
  }

  return (
    <>
      <BoxCard about={t("FrequentlyAsked")} small={true} className="py-1">
        <div className="space-y-4 min-h-[60vh]">
          <button
            onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20"
          >
            {t("Add")} <Plus size={18} />
          </button>

          {/* Clean Component for the List Logic */}
          <div className="border-t border-gray-100 pt-4">
            <FaqList 
              items={faqs} 
              onReorder={handleReorder}
              onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
              onDelete={(id) => handleDelete(id)}
            />
          </div>

         <SaveModal
     isDirty={hasChanges}
     handleSave={handleServerSave}
     isSaving={isPending}
     />
        </div>
      </BoxCard>

      {/* Modals */}
      <FaqFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingItem}
        onSave={handleAddOrUpdate}
      />

      
    </>
  );
};

export default UpdateFaqs;