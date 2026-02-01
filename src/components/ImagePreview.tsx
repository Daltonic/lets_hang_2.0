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

    const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageUrl = event.target?.result as string;
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