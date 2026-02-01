// File: src/components/GoLiveButton.tsx
import { Play } from 'lucide-react';

const GoLiveButton = ({
    handleGoLive,
    disabled
}: {
    handleGoLive: () => void;
    disabled: boolean;
}) => {
    return (
        <button
            onClick={handleGoLive}
            disabled={disabled}
            className="w-full py-3 sm:py-4 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl text-white hover:bg-white/25 transition-all flex items-center justify-center gap-2 shadow-lg border border-white/30 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Play size={20} className="sm:w-6 sm:h-6 text-green-400 fill-green-400" />
            Go live
        </button>
    );
};

export default GoLiveButton;