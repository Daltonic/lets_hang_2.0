// File: src/components/AutoSaveIndicator.tsx
import { Save } from 'lucide-react';

interface AutoSave {
    isSaving: boolean;
    lastSaved?: number;
}

const AutoSaveIndicator = ({ autoSave }: { autoSave: AutoSave }) => {
    if (autoSave.isSaving) {
        return (
            <div className="text-white/70 text-sm flex items-center gap-2">
                <Save size={16} className="animate-pulse" />
                Saving draft...
            </div>
        );
    }
    if (autoSave.lastSaved && !autoSave.isSaving) {
        return (
            <div className="text-white/70 text-sm flex items-center gap-2">
                <Save size={16} />
                Saved {new Date(autoSave.lastSaved).toLocaleTimeString()}
            </div>
        );
    }
    return null;
};

export default AutoSaveIndicator;