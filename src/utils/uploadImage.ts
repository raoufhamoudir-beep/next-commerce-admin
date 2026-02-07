import imageCompression from 'browser-image-compression';
import axios from 'axios';

// MODIFIED: Accepts 'File' directly, not 'event'
export const handleImageUploadToImgbb = async (originalFile: File) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error("ImgBB API Key is missing");
    }

    // Optimization options
    const options = {
        maxSizeMB: 0.5,          // Target file size (0.5MB)
        maxWidthOrHeight: 1200,  // Maximum dimension
        useWebWorker: true,      // For better performance
        fileType: 'image/webp',  // Output format
        initialQuality: 0.75     // Quality
    };

    try {
        // 1. Compress the file
        const optimizedFile = await imageCompression(originalFile, options);

        // 2. Prepare FormData
        const formData = new FormData();
        // ImgBB API expects the key 'image'
        formData.append('image', optimizedFile); 
        // If your specific API setup requires the key in the URL, remove this line:
        // formData.append('key', apiKey); 

        // 3. Upload (Pass API key as query param is standard for ImgBB, 
        // or as body param depending on your specific proxy setup)
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
        
        return res.data.data.url;
    } catch (err) {
        console.error('ImgBB Upload error:', err);
        throw err;
    }
};