import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

// Define clear types for the component
interface ImageGalleryProps {
    /** Array of image URLs */
    images?: string[]; 
    /** Callback to remove an image. If not provided, delete button won't show. */
    onRemove?: (imageSrc: string) => void;
    /** Controls the visual style of the images */
    variant?: 'grid' | 'avatar' | 'banner';
    /** Optional custom class for the container */
    className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
    images = [], 
    onRemove, 
    variant = 'grid',
    className = ''
}) => {
    
    // Helper to determine classes based on variant
    const getVariantStyles = () => {
        switch (variant) {
            case 'avatar': // Formerly 'tabel'
                return "w-10 h-10 rounded-full border border-gray-200";
            case 'banner': // Formerly 'category'
                return "w-full h-48 md:h-64 rounded-xl";
            case 'grid':   // Formerly default / big
            default:
                return "w-24 h-24 md:w-32 md:h-32 rounded-xl border border-gray-100 shadow-sm";
        }
    };

    if (!images || images.length === 0) return null;

    return (
        <PhotoProvider 
            maskOpacity={0.8}
            speed={() => 300} // Smooth opening animation
        >
            <div className={`flex flex-wrap gap-3 ${className}`}>
                <AnimatePresence mode='popLayout'>
                    {images.map((src, index) => (
                        <PhotoView key={`${src}-${index}`} src={src}>
                            <motion.div
                                layout // Animates position when siblings are removed
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                whileHover={{ scale: 1.02 }}
                                className={`
                                    relative overflow-hidden cursor-zoom-in bg-gray-50 group
                                    ${getVariantStyles()}
                                `}
                            >
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    src={src}
                                    alt={`Gallery item ${index + 1}`}
                                    loading="lazy"
                                />

                                {/* Remove Button */}
                                {onRemove && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        // Show on hover (desktop) or always (touch devices logic can be added)
                                        animate={{ opacity: 1 }} 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent opening the lightbox
                                            onRemove(src);
                                        }}
                                        className={`
                                            absolute top-1 right-1 p-1.5 
                                            bg-white/80 backdrop-blur-sm 
                                            text-red-500 rounded-full shadow-md 
                                            hover:bg-red-500 hover:text-white 
                                            transition-colors duration-200
                                            z-10
                                            ${variant === 'avatar' ? 'hidden' : 'flex'} // Hide delete on tiny avatars
                                        `}
                                    >
                                        <X size={14} strokeWidth={3} />
                                    </motion.button>
                                )}
                            </motion.div>
                        </PhotoView>
                    ))}
                </AnimatePresence>
            </div>
        </PhotoProvider>
    );
};

export default ImageGallery;