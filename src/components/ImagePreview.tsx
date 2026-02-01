// File: src/components/ImagePreview.tsx
import { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { extractGradient } from '../utils/colorUtils';
import { defaultImage, type GradientColors } from '../types/imageConstants';

const ImagePreview = ({
    customImage,
    setCustomImage,
    setGradient
}: {
    customImage: string | null;
    setCustomImage: (img: string | null) => void;
    setGradient: (g: GradientColors) => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Compress image to reduce file size
    const compressImage = (imageUrl: string, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);
                const compressedUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedUrl);
            };
            img.src = imageUrl;
        });
    };

    const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            let imageUrl = event.target?.result as string;
            
            // Compress image to reduce storage size
            try {
                imageUrl = await compressImage(imageUrl);
                const originalSize = typeof event.target?.result === 'string' ? event.target.result.length : 0;
                console.log('Image compressed from', originalSize, 'to', imageUrl.length, 'bytes');
            } catch (error) {
                console.error('Error compressing image:', error);
            }
            
            setCustomImage(imageUrl);

            try {
                const extractedGradient = await extractGradient(imageUrl, canvasRef);
                setGradient(extractedGradient);
            } catch (error) {
                console.error('Error extracting gradient:', error);
                setGradient(defaultImage.gradient);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="relative group">
                <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                    <img
                        src={customImage || defaultImage.url}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/40 shadow-lg"
                    >
                        <ImageIcon size={18} className="sm:w-5 sm:h-5 text-pink-300" />
                    </button>
                </div>
            </div>

            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 sm:py-4 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl text-white hover:bg-white/25 transition-all flex items-center justify-center gap-2 shadow-lg border border-white/30 text-sm sm:text-base"
            >
                <ImageIcon size={18} className="sm:w-5 sm:h-5 text-lime-300" />
                Change background
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomImageUpload}
                className="hidden"
            />
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default ImagePreview;