// File: src/components/CustomizeSection.tsx
import { MessageSquare, Link, Users, Image as ImageIcon, Grid2x2, Sparkles, X } from 'lucide-react';

const CustomizeSection = ({
    modules,
    showModuleCreator,
    setShowModuleCreator,
    newModuleName,
    setNewModuleName,
    newModuleDescription,
    setNewModuleDescription,
    handleAddModule,
    deleteCustomModule,
    currentEvent,
    gradient
}: {
    modules: { id: string; name: string; description?: string }[];
    showModuleCreator: boolean;
    setShowModuleCreator: (b: boolean) => void;
    newModuleName: string;
    setNewModuleName: (s: string) => void;
    newModuleDescription: string;
    setNewModuleDescription: (s: string) => void;
    handleAddModule: () => void;
    deleteCustomModule: (id: string) => void;
    currentEvent: { id: string; name?: string; dateTime?: string; location?: string; gradient?: { primary: string; secondary: string; accent: string } } | null;
    gradient: { primary: string; secondary: string; accent: string };
}) => {
    return (
        <div className="bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 text-white/25 z-0">
                <MessageSquare size={24} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
            </div>
            <div className="absolute top-4 sm:top-8 right-4 sm:right-8 text-white/25 z-0">
                <Link size={24} className="sm:w-8 sm:h-8 text-cyan-400" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-10 text-white/25 z-0">
                <Users size={24} className="sm:w-8 sm:h-8 text-orange-400" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-10 text-white/25 z-0">
                <ImageIcon size={24} className="sm:w-8 sm:h-8 text-purple-400" strokeWidth={1.5} />
            </div>
            <div className="absolute top-1/2 left-3 sm:left-6 -translate-y-1/2 text-white/25 z-0">
                <Grid2x2 size={24} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
            </div>

            <div className="relative z-10 text-center space-y-4 sm:space-y-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                        Customize your event your way
                    </h3>
                    <p className="text-white/40 text-xs sm:text-sm font-bold tracking-widest">RSVP</p>
                </div>

                {modules.length > 0 && (
                    <div className="space-y-2">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                            >
                                <div className="text-left flex-1">
                                    <p className="text-white font-semibold text-sm">{module.name}</p>
                                    {module.description && (
                                        <p className="text-white/60 text-xs">{module.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteCustomModule(module.id)}
                                    className="p-1 hover:bg-white/20 rounded transition-all"
                                >
                                    <X size={16} className="text-white/70" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {showModuleCreator ? (
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl">
                        <input
                            type="text"
                            placeholder="Module name"
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={newModuleDescription}
                            onChange={(e) => setNewModuleDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 text-sm"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddModule}
                                className="flex-1 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all text-sm"
                            >
                                Add Module
                            </button>
                            <button
                                onClick={() => {
                                    setShowModuleCreator(false);
                                    setNewModuleName('');
                                    setNewModuleDescription('');
                                }}
                                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white/70 hover:bg-white/20 transition-all text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowModuleCreator(true)}
                        disabled={!currentEvent}
                        className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white transition-all flex items-center justify-center gap-2 relative z-20 shadow-lg border border-white/50 backdrop-blur-sm text-sm sm:text-base disabled:cursor-not-allowed"
                        style={{
                            background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 50%, ${gradient.accent} 100%)`,
                            opacity: !currentEvent ? 0.5 : 1
                        }}
                    >
                        <Sparkles size={18} className="sm:w-5 sm:h-5 text-yellow-200" />
                        Customize
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomizeSection;