import { useUpdateStore } from '@/features/admin/hook/useStoreManagement';
import type { Store } from '@/types';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import DeliveryCompanySelector from './DeliveryCompanySelector';

interface DeliveryCompaniesContainerProps {
  onCancel: () => void;
  store: Store | undefined;
  id: string | undefined;
}

interface CompanyState {
  name: string;
  img: string;
  key: string;
  token: string;
}

const DeliveryCompaniesContainer = ({ onCancel, store, id }: DeliveryCompaniesContainerProps) => {
  const { t } = useTranslation("Delivery");
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");
  const [error, setError] = useState("");
  
  const [selectedCompany, setSelectedCompany] = useState<CompanyState>({
    name: "",
    img: "",
    key: "",
    token: "",
  });

  const handleCompanySelect = (name: string, img: string) => {
    setSelectedCompany({ name, img, key: "", token: "" });
    setError(""); // Clear previous errors
  };

  const closeModal = () => {
    setSelectedCompany({ name: "", img: "", key: "", token: "" });
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!store) return;

    try {
      // Validate credentials with external service
      const res = await axios.post(`https://next-delvry.vercel.app/test`, {
        company: {
          name: selectedCompany.name,
          Token: selectedCompany.token,
          Key: selectedCompany.key
        }
      });
      if (res.data.good) {
        // Update local store data
        updateStore(
          { 
            id: id, 
            data: { 
              ...store, 
              deliveryCompany: selectedCompany 
            } 
          },
          {
            onSuccess: () => {
              toast.success(t("Theme updated successfully"));
              onCancel(); // Go back to view mode
            },
            onError: () => {
              toast.error(t("Failed to update theme"));
            },
          }
        );
      }
    } catch (err) {
      setError(t("InvalidKeyOrToken"));
    }
  };

  return (
    <div className="relative min-h-screen   py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {t("ChooseDeliveryCompany")}
      </h1>

      <DeliveryCompanySelector onSelect={handleCompanySelect} />

      {/* Connection Modal */}
      {selectedCompany.name && (
        <ConnectionModal 
          company={selectedCompany}
          setCompany={setSelectedCompany}
          onSubmit={handleSubmit}
          onClose={closeModal}
          isLoading={isPending}
          error={error}
          t={t}
        />
      )}
    </div>
  );
};

// --- Sub Component: Connection Modal ---
const ConnectionModal = ({ company, setCompany, onSubmit, onClose, isLoading, error, t }: any) => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed z-50 top-1/2 left-1/2 w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-4 border border-gray-300 rounded-full overflow-hidden p-2">
            <img src={company.img} alt={company.name} className="object-contain w-full h-full" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-1">{company.name}</h2>
          <p className="text-center text-sm text-gray-600 mb-5 px-4">
            {t("ConnectStoreWithCompany", { company: company.name })}
          </p>

          {error && <p className="text-sm font-semibold text-red-600 mb-3 bg-red-50 px-3 py-1 rounded">{error}</p>}

          <form onSubmit={onSubmit} className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("ApiKey")}</label>
              <input
                type="text"
                value={company.key}
                onChange={(e) => setCompany({ ...company, key: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("EnterApiKey")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("token")}</label>
              <input
                type="text"
                value={company.token}
                onChange={(e) => setCompany({ ...company, token: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("EnterToken")}
                required
              />
            </div>

            <div className="flex justify-between gap-4 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition flex justify-center items-center"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : t("ConfirmConnection")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeliveryCompaniesContainer;