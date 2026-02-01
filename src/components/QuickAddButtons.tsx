// File: src/components/QuickAddButtons.tsx
import { Users, Image as ImageIcon, Link } from 'lucide-react';

const QuickAddButtons = ({
    showMore,
    setShowMore
}: {
    showMore: boolean;
    setShowMore: (b: boolean) => void;
}) => {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-3">
            <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/40 hover:bg-white/25 transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base">
                <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
                Capacity
            </button>
            <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/40 hover:bg-white/25 transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base">
                <ImageIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                Photo gallery
            </button>
            <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/40 hover:bg-white/25 transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base">
                <Link size={16} className="sm:w-[18px] sm:h-[18px]" />
                Links
            </button>
            <button
                onClick={() => setShowMore(!showMore)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-white/70 hover:text-white transition-all text-sm sm:text-base"
            >
                {showMore ? 'Show less' : 'Show more'}
            </button>
        </div>
    );
};

export default QuickAddButtons;