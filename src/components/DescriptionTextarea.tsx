// File: src/components/DescriptionTextarea.tsx
const DescriptionTextarea = ({
    description,
    setDescription
}: {
    description: string;
    setDescription: (s: string) => void;
}) => {
    return (
        <textarea
            placeholder="Describe your event"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 transition-all resize-none text-sm sm:text-base"
            rows={4}
        />
    );
};

export default DescriptionTextarea;