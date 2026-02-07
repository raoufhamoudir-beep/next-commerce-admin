import { useState } from 'react';
import { ArrowRight, Store, Trash2  } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UserStore } from '@/types';
import Modal from '@/components/ui/Madel';
import { ActionAlert, AlertItemPreview } from '@/components/ui/ActionAlert';
import { useDeleteStore } from '../hook/useStoreManagement';
import { useTranslation } from 'react-i18next';

// --- Types ---

// --- Mock "Madel" (Modal) Component ---
// Assuming you have this, but here is a styled version for this demo

// --- The "Delete Container" Content ---

// --- Main Component ---
const StoreCard = ({ store }: { store: UserStore }) => {
const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { isPending, mutate:DeleteStore } = useDeleteStore();
   const { t } = useTranslation("account");

  const handleDelete = async ( ) => {
    // Call your API here
   DeleteStore(store.id)
  };
  return (
    <>
      <div className="group relative bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 flex flex-col overflow-hidden h-full">
        
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-purple-50 via-white to-teal-50 relative">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-teal-700 shadow-sm border border-white/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            {t("Active")}
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 flex-1 flex flex-col relative">
          {/* Floating Logo */}
          <div className="-mt-14 mb-4 self-center md:self-start relative group-hover:-translate-y-1 transition-transform duration-300">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.storeName}
                className="w-24 h-24 rounded-2xl object-cover shadow-lg border-[6px] border-white bg-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-lg border-[6px] border-white">
                <Store className="w-10 h-10 opacity-90" />
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left mb-8">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-teal-500 transition-all duration-300 line-clamp-1">
              {store.storeName}
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-mono tracking-wide">
              ID: {store.id.slice(-6).toUpperCase()}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between gap-3">
            
            {/* DELETE BUTTON */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/delete"
              title="Delete Store"
            >
              <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
            </button>

            {/* DASHBOARD LINK */}
            <Link
              to={`/store/${store.id}`}
              className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-teal-500 hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2 transition-all duration-300 group/btn"
            >
              {t("Dashboard")}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Logic */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
        <ActionAlert
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isLoading={isPending}
          title="Delete Store?"
          variant="danger" // Makes it Red
          confirmText="Yes, Delete"
          description={
            <span>
              {t("You are about to delete")} <span className="font-bold text-gray-800">"{store.storeName}"</span>. 
              {t("This action involves permanent data loss and")} <span className="text-red-600 font-semibold">{t("cannot be undone")}</span>.
            </span>
          }
        >
          {/* The Visual Cue */}
          <AlertItemPreview 
             title={store.storeName}
             subtitle={`ID: ${store.id}`}
             image={store.logo}
          />
        </ActionAlert>
     
        </Modal>
      )}
    </>
  );
};

export default StoreCard;