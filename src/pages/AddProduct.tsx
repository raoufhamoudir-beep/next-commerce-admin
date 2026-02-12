import React, { useState, type KeyboardEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {  Plus, X } from "lucide-react";
import { IoMdAdd } from "react-icons/io";

// Custom UI Components
import BoxCard from "@/components/ui/BoxCard";
import ImageInput from "@/components/ui/ImageInput";
import ImageGallery from "@/components/ui/ImageGallery";
import Modal from "@/components/ui/Madel";
import PageContainer from "@/components/ui/PageContainer";
import Tutorial from "@/components/ui/Tutorial";
import OffersContainer from "@/features/AddProduct/components/OffersContainer";

// Hooks
import { useStore } from "@/features/store/hooks/UseStore";
import { useAddProduct } from "@/features/AddProduct/hooks/useProductManagement";
import type { Offer, product } from "@/types";
import { handleImageUploadToImgbb } from "@/utils/uploadImage";
import SaveModal from "@/components/ui/SaveModal";

// --- Types ---


 

const AddProduct = () => {
  const { id } = useParams();
  const router = useNavigate();
  const { t } = useTranslation("product");

  // Fetch Store Data
  const { data: store } = useStore(id);

  // --- State Management ---
  const [showTutorial, setShowTutorial] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const { mutate: postproducts, isPending } = useAddProduct(id);
  
  // Form State
  const [formData, setFormData] = useState<product>({
    name: "",
    Description: "",
    ShortDescription: "",
    note: "",
    price: 0,
    Oldprice: 0,
    store: id || "",
    type: "",
    show: true,
    subTitel: "",
    tags: [],
    LadingPages: [],
    images: [],
    Offers: [],
    colorOpions: [],
    sizeOpions: [],
    subdomain: store?.domain || ""
  });

  // --- Complex Field States ---
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [colorOpions, setColorOpions] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  const [sizeOpions, setSizeOpions] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");

  const [offers, setOffers] = useState<Offer[]>([]);
   
  // Image States
  const [images, setImages] = useState<string[]>([]);
  const [landingPages, setLandingPages] = useState<string[]>([]);

  // --- Constants ---
  const SUGGESTIONS = ["توصيل سريع", "ضمان لمدة أسبوع واحد", "كمية محدودة"];
  
  // Fixed typos so colors render correctly in CSS
  const SUGGESTIONSCOLORES = ["red", "blue", "green", "yellow", "white", "black", "brown", "purple", "orange"];
  const SUGGESTIONSSIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  // --- Handlers ---

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- TAGS HANDLERS ---
  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setTagInput("");
  };
  const handleRemoveTag = (tagToRemove: string) => setTags(tags.filter((t) => t !== tagToRemove));
  
  // --- COLORS HANDLERS ---
  const handleAddColor = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !colorOpions.includes(trimmed)) setColorOpions([...colorOpions, trimmed]);
    setColorInput("");
  };
  const handleRemoveColor = (val: string) => setColorOpions(colorOpions.filter((c) => c !== val));

  // --- SIZES HANDLERS ---
  const handleAddSize = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !sizeOpions.includes(trimmed)) setSizeOpions([...sizeOpions, trimmed]);
    setSizeInput("");
  };
  const handleRemoveSize = (val: string) => setSizeOpions(sizeOpions.filter((s) => s !== val));

  // Generic Enter Key Handler
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, action: (val: string) => void, val: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action(val);
    }
  };

  const isFormValid = 
  Boolean(formData.name?.trim()) && // Handles empty strings or just spaces
  ( formData.price > 0) && // Allows price to be 0
  images.length > 0 ? true : false;

  const addOffer = () => {
    if (offers.length >= 15) return toast.error(t("Max 15 Offers allowed."));
    setOffers(prev => [...prev, { id: Date.now(), name: '', Quantity: "", price: "", freedelevry: false, topOffer: false }]);
  };

  

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, targetStateSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
        const newUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = await handleImageUploadToImgbb(files[i]);
            if (url) newUrls.push(url);
        }
        targetStateSetter(prev => [...prev, ...newUrls]);
        toast.success(t("Images uploaded"));
    } catch (err) {
        console.error(err);
        toast.error(t("Upload failed"));
    } finally {
        setUploading(false);
        e.target.value = ""; 
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
        toast.error(t("Please fill in required fields"));
        setError(true);
        return;
    }
     
    const payload   = {
      ...formData,
      Offers: offers,
      tags: tags,
      // Include the new Color/Size states here
      colorOpions: colorOpions,
      sizeOpions: sizeOpions,
      LadingPages: landingPages,
      images: images,
    };

    postproducts(payload, {
        onSuccess: () => {
            toast.success(t("Product added successfully!"));
            router(`/store/${id}/products`);
        },
        onError: (error) => {
            console.error(error);
            toast.error(t("Failed to add product"));
        }
    }); 
  };

  return (
    <PageContainer 
      about={t("products")} 
     title={t("Add")}

     >
      {showTutorial && (
        <Modal onClose={() => setShowTutorial(false)}>
          <Tutorial about="https://firebasestorage.googleapis.com/v0/b/tawssilatrest.appspot.com/o/tutorial.mp4" />
        </Modal>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <BoxCard about={t("General")}>
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700">{t("ProductTitle")} <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${error && !formData.name ? "border-red-500 bg-red-50" : "border-slate-200"}`} />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700">{t("ProductShort")}</label>
                <textarea name="ShortDescription" value={formData.ShortDescription} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700">{t("Productnote")}</label>
                <input type="text" name="note" value={formData.note} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </BoxCard>

          <BoxCard about={t("Prices")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700">{t("Price")} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className={`w-full pl-7 pr-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${error && !formData.price ? "border-red-500" : "border-slate-200"}`} />
                </div>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700">{t("Comparisonprice")}</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                    <input type="number" name="Oldprice" value={formData.Oldprice} onChange={handleChange} className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            </div>
          </BoxCard>

          <BoxCard about={t("Photo")} className={error && images.length === 0 ? "border-red-300 ring-2 ring-red-100" : ""}>
             <div className="space-y-4">
                <ImageGallery images={images} onRemove={(url) => setImages(prev => prev.filter(i => i !== url))} variant="grid" />
                <ImageInput id="product-images-upload" multiple label={t("Upload Product Images")} uploading={uploading} onImageSelected={(e) => handleImageUpload(e, setImages)} />
             </div>
          </BoxCard>

           <BoxCard about={t("LandingPages")}>
             <p className="text-sm text-slate-500 mb-3">{t("Yourlandingpage")}</p>
             <div className="space-y-4">
                <ImageGallery images={landingPages} onRemove={(url) => setLandingPages(prev => prev.filter(i => i !== url))} variant="banner" />
                <ImageInput id="landing-pages-upload" label={t("Upload Banner Images")} uploading={uploading} onImageSelected={(e) => handleImageUpload(e, setLandingPages)} />
             </div>
          </BoxCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
            
            <BoxCard about={t("CategoriesOptional")}>
                {!store?.categories || store.categories.length === 0 ? (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">{t("NoCategoriesyet")}</p>
                ) : (
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="" disabled>{t("Productstype")}</option>
                        {store.categories.map((c: any, i: number) => (
                            <option key={i} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                )}
            </BoxCard>

            {/* --- TAGS --- */}
            <BoxCard about={t("tags")}>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.length === 0 && <span className="text-sm text-slate-400 italic">{t("Notagsselected")}</span>}
                    {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="hover:text-indigo-800"><X size={12} /></button>
                        </span>
                    ))}
                </div>
                <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">{t("QuickAdd")}</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((s) => (
                            <button key={s} onClick={() => handleAddTag(t(s))} disabled={tags.includes(t(s))} className="px-2 py-1 text-xs border border-slate-200 rounded hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 transition-colors">{s}</button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, handleAddTag, tagInput)} placeholder={t("Addcustomtag")} className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <button onClick={() => handleAddTag(tagInput)} disabled={!tagInput} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"><Plus size={18} /></button>
                </div>
            </BoxCard>

            {/* --- COLORS (Visual Update) --- */}
            <BoxCard about={t("colors")}>
                {/* Selected Colors List */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {colorOpions.length === 0 && <span className="text-sm text-slate-400 italic">{t("NoColorsSelected")}</span>}
                    {colorOpions.map((color) => (
                        <span key={color} className="inline-flex items-center gap-2 pl-2 pr-1 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {/* The Visual Color Dot */}
                            <span 
                                style={{ backgroundColor: color }} 
                                className="w-3 h-3 rounded-full shadow-sm border border-black/10"
                            />
                            {color}
                            <button onClick={() => handleRemoveColor(color)} className="p-1 hover:text-red-500 rounded-full hover:bg-slate-200"><X size={12} /></button>
                        </span>
                    ))}
                </div>

                {/* Suggestions as Circles */}
                <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">{t("QuickAdd")}</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTIONSCOLORES.map((c) => (
                            <button 
                                key={c} 
                                onClick={() => handleAddColor(c)} 
                                disabled={colorOpions.includes(c)} 
                                className="group relative w-6 h-6 rounded-full shadow-sm border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transform hover:scale-110 transition-all"
                                style={{ backgroundColor: c }}
                                title={c}
                            >
                                {colorOpions.includes(c) && (
                                    <span className="absolute inset-0 flex items-center justify-center text-white/80 drop-shadow-md">
                                        <X size={12} strokeWidth={3} /> 
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, handleAddColor, colorInput)} placeholder="Ex: #ff0000 or red" className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <button onClick={() => handleAddColor(colorInput)} disabled={!colorInput} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"><Plus size={18} /></button>
                </div>
            </BoxCard>

            {/* --- SIZES --- */}
            <BoxCard about={t("sizes")}>
                <div className="flex flex-wrap gap-2 mb-4">
                    {sizeOpions.length === 0 && <span className="text-sm text-slate-400 italic">{t("NoSizesSelected")}</span>}
                    {sizeOpions.map((size) => (
                        <span key={size} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-white shadow-sm">
                            {size}
                            <button onClick={() => handleRemoveSize(size)} className="hover:text-red-300 ml-1"><X size={12} /></button>
                        </span>
                    ))}
                </div>

                <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">{t("QuickAdd")}</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTIONSSIZES.map((s) => (
                            <button 
                                key={s} 
                                onClick={() => handleAddSize(s)} 
                                disabled={sizeOpions.includes(s)} 
                                className="min-w-[32px] px-2 py-1 text-xs font-medium border border-slate-200 bg-white rounded hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, handleAddSize, sizeInput)} placeholder={t("Addcustomsize")} className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <button onClick={() => handleAddSize(sizeInput)} disabled={!sizeInput} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"><Plus size={18} /></button>
                </div>
            </BoxCard>

            <BoxCard about={t("Offers")} button={t("AddOffer")} buttonicon={<IoMdAdd />} onclick={addOffer}>
                 {offers.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">{t("NoOffersyet")}</p>
                  ) : (
                       <OffersContainer err={error} Offers={offers} setOffers={setOffers} />
                  )}
            </BoxCard>
        </div>
      </div>

     <SaveModal
     isDirty={isFormValid}
     handleSave={handleSubmit}
     isSaving={isPending}
     />
    </PageContainer>
  );
};

export default AddProduct;