import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Loader2, Trash2 } from 'lucide-react';

type Variant = 'danger' | 'info' | 'success' | 'warning';

interface ActionAlertProps {
  title: string;
  description: React.ReactNode;
  
  // Logic
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  
  // Customization
  variant?: Variant;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ElementType; // Optional: Override default icon
  
  // The "Visual Cue" (The card showing the item)
  children?: React.ReactNode; 
}

const VARIANTS = {
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    ring: 'ring-red-50',
    iconColor: 'text-red-600',
    btnBg: 'bg-red-600',
    btnHover: 'hover:bg-red-700',
    btnShadow: 'shadow-red-500/30',
    defaultIcon: AlertTriangle,
  },
  info: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    ring: 'ring-purple-50',
    iconColor: 'text-purple-600',
    btnBg: 'bg-purple-600',
    btnHover: 'hover:bg-purple-700',
    btnShadow: 'shadow-purple-500/30',
    defaultIcon: Info,
  },
  success: {
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    ring: 'ring-teal-50',
    iconColor: 'text-teal-600',
    btnBg: 'bg-teal-600',
    btnHover: 'hover:bg-teal-700',
    btnShadow: 'shadow-teal-500/30',
    defaultIcon: CheckCircle2,
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    ring: 'ring-orange-50',
    iconColor: 'text-orange-600',
    btnBg: 'bg-orange-600',
    btnHover: 'hover:bg-orange-700',
    btnShadow: 'shadow-orange-500/30',
    defaultIcon: AlertTriangle,
  }
};

export const ActionAlert = ({
  title,
  description,
  variant = 'danger',
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  children
}: ActionAlertProps) => {
  if (!isOpen) return null;

  const style = VARIANTS[variant];
  const IconComponent = icon || style.defaultIcon;

  return (
    <div className="flex flex-col w-full">
      {/* Header / Icon */}
      <div className={`${style.bg} p-6 flex justify-center border-b ${style.border}`}>
        <div className={`h-16 w-16 ${style.bg} rounded-full flex items-center justify-center ring-8 ${style.ring}`}>
          <IconComponent className={`w-8 h-8 ${style.iconColor}`} />
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 text-center space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-500 mt-2 leading-relaxed">
            {description}
          </div>
        </div>

        {/* Visual Cue Area (The Card) */}
        {children && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-left">
            {children}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 pt-0 flex gap-3">
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button 
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex-1 py-2.5 px-4 text-white font-medium rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 ${style.btnBg} ${style.btnHover} ${style.btnShadow}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {variant === 'danger' && <Trash2 className="w-4 h-4" />}
              {confirmText}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Helper Component for the "Visual Cue" Item ---
// This makes it easy to pass an Image + Title + ID for any entity
export const AlertItemPreview = ({ 
  image, 
  icon: FallbackIcon, 
  title, 
  subtitle 
}: { 
  image?: string | null, 
  icon?: React.ElementType, 
  title: string, 
  subtitle: string 
}) => {
  return (
    <>
      {image ? (
        <img src={image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white shadow-sm" />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
          {FallbackIcon ? <FallbackIcon className="w-5 h-5 text-gray-400" /> : <div className="w-5 h-5 bg-gray-400 rounded-full"/>}
        </div>
      )}
      <div className="overflow-hidden">
        <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-400 font-mono">{subtitle}</p>
      </div>
    </>
  );
};