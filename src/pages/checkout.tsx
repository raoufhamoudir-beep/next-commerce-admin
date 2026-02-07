import    { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';

// Hooks & Utils
import { useUser } from '@/features/auth/hooks/useUser';
import { useOfferRegister } from '@/features/Upgrade/hooks/UseOffer';
import { handleImageUploadToImgbb } from '@/utils/uploadImage';

// Components
import PageContainer from '@/components/ui/PageContainer';
import ImageInput from '@/components/ui/ImageInput';
 
 import PaymentDetails from '@/features/Upgrade/components/PaymentDetails';
import OrderSummary from '@/features/Upgrade/components/OrderSummary';
import ConfirmationModal from '@/features/Upgrade/components/ConfirmationModal';

const Checkout = () => {
  const { t } = useTranslation("subscriptions");
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { mutate: postOffer, isPending } = useOfferRegister();

  // --- State ---
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const [userInfo, setUserInfo] = useState({
    user: user?._id || "",
    price: 0,
    OfferTypeValue: "",
    offerTitle: "",
    PaymentImage: "",
    userName: user?.name || "",
    status: "pending",
    date: new Date(),
  });

  // --- Constants ---
  const paymentInfo = {
    ccp: "41545126 Clé 06",
    rip: "00799999004154512631",
    name: "Kerbadj Abdelbari",
    phone: "213698320894"
  };

  // --- Effects ---
  useEffect(() => {
    try {
      const savedData = JSON.parse(localStorage.getItem('selectedPlanOption') || '{}');
      if (!savedData || !savedData.plan) {
        navigate('/upgrade');
        return;
      }

      setUserInfo((prev) => ({
        ...prev,
        price: savedData.price || 0,
        offerTitle: savedData.plan || "",
        OfferTypeValue: savedData.choiceType || ""
      }));

      // Calculate display details
      const details = getPlanDetailsInternal(savedData.plan, savedData.choiceType, t);
      setOrderDetails(details);
    } catch (error) {
      console.error("Error parsing plan data", error);
      navigate('/upgrade');
    }
  }, [navigate, t]);


  // --- Handlers ---

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const url = await handleImageUploadToImgbb(files[0]);
      if (url) {
        setUserInfo(prev => ({ ...prev, PaymentImage: url }));
        toast.success(t("Image uploaded successfully"));
        setShowConfirmModal(true); // Automatically show modal on success
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Upload failed"));
    } finally {
      setUploading(false);
      e.target.value = ""; 
    }
  };

  const handleSendPayment = async () => {
    // Basic date calculator for the payload
    const getMonths = (val: string) => {
        const d = new Date();
        d.setMonth(d.getMonth() + parseInt(val));
        return d;
    }

    const finalPayload = {
      ...userInfo,
      price: parseInt(orderDetails?.price.replace(/,/g, '') || "0"),
      OfferTypeValue: getMonths(orderDetails?.value || "0"), // Send actual Date object or string depending on API
      offerTitle: orderDetails?.title,
    }; 

    try {
      postOffer(finalPayload, {
        onSuccess: () => { 
             navigate('/subscriptions');
             toast.success(t("Request sent successfully"));
        },
        onError: () => {
             toast.error(t("Something went wrong"));
        }
      });
    } catch (error) {
      console.error("Error sending payment:", error);
    } finally {
      setShowConfirmModal(false);
    }
  };


  if (!orderDetails) return null;

  return (
    <PageContainer
      title={t('checkout')}
      about={t("Secure_your_plan_via_CCP_or_Baridimob_transfer")}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Payment & Upload */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Payment Info Card */}
            <PaymentDetails paymentInfo={paymentInfo} />

            {/* 2. Proof of Payment Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("Confirm_Your_Payment")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WhatsApp Option */}
                <a
                  href={`https://wa.me/${paymentInfo.phone}?text=${encodeURIComponent(`Hello, I paid ${orderDetails?.price} DZD for the ${orderDetails?.title}. Here is the receipt.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-green-200 rounded-xl bg-green-50 hover:bg-green-100 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <FaWhatsapp size={24} />
                  </div>
                  <span className="font-bold text-gray-800">{t("Send Receipt_via_WhatsApp")}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">{t("Fastest_activation_(Recommended)")}</span>
                </a>

                {/* Upload Option */}
                <div className="flex flex-col items-center justify-center">
                  <ImageInput 
                    className="w-full h-full min-h-[160px]    rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all" 
                    label={t("Upload_Screenshot")} 
                    uploading={uploading} 
                    onImageSelected={handleImageUpload} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="lg:col-span-1">
            <OrderSummary orderDetails={orderDetails} />
          </div>

        </div>
      </div>

      {/* MODAL */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSendPayment}
        isPending={isPending}
        imagePreview={userInfo.PaymentImage}
      />
    </PageContainer>
  );
};


// Helper logic for Plan Details (kept here for simplicity, or move to utils)
const getPlanDetailsInternal = (plan: string, choiceType: string, t: any) => {
    const isOffer = choiceType === 'offer';

    switch (plan) {
        case 'monthly':
            return {
                title: isOffer ? t("Double_Starter_Pack") : t("Standard_Monthly"),
                value: isOffer ? "2" : "1",
                price: isOffer ? "2,500" : "1,900",
                term: isOffer ? t("2_Months") : t("1_Month"),
                savings: isOffer ? "1,300 DZD" : null,
                desc: isOffer ? t("Special_Seasonal_Offer") : t("Regular_Monthly_Plan")
            };
        case 'quarterly':
            return {
                title: isOffer ? t("Quarterly_Plus") : t("Standard_Quarterly"),
                value: isOffer ? "4" : "3",
                price: "4,900",
                term: isOffer ? t("4_Months") : t("3_Months"),
                savings: isOffer ? t("1_Month_Free") : null,
                desc: isOffer ? t("Limited_Time_Upgrade") : t("Regular_Quarterly_Plan")
            };
        case 'semi_annual':
            return {
                title: isOffer ? t("Yearly_Pro_Access") : t("Standard_Semi-Annual"),
                value: isOffer ? "7" : "6",
                price: "9,000",
                term: isOffer ? t("7_Months") : t("6_Months"),
                savings: isOffer ? t("Best_Value") : null,
                desc: isOffer ? t("VIP_Deal") : t("Regular_6_Months_Plan")
            };
        default:
            return null;
    }
};

export default Checkout;