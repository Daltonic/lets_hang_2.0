import { useState, useRef, useEffect } from 'react';
import { MapPin, DollarSign, Calendar, Users, Image as ImageIcon, Link, MessageSquare, Lock, ArrowRight, Grid2x2, Play, X, Save, Sparkles } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import type { EventDraft } from '../types';

interface GradientColors {
    primary: string;
    secondary: string;
    accent: string;
}

const defaultImage = {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRkYTY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNhODdhZmY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY4OGZmO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ZT1UmIzM5O1JFPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iODAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPklOVklURUQ8L3RleHQ+PC9zdmc+',
    gradient: { primary: '#ff4da6', secondary: '#a87aff', accent: '#6688ff' }
};

const EventCreator = () => {
    const {
        currentEvent,
        saveDraft,
        loadDraftByPhone,
        publishDraft,
        goLive,
        autoSave,
        addCustomModule,
        getEventModules,
        deleteCustomModule,
    } = useDatabase();

    const [gradient, setGradient] = useState<GradientColors>(defaultImage.gradient);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [eventName, setEventName] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState('');
    const [costPerPerson, setCostPerPerson] = useState('');
    const [description, setDescription] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [isPhoneLocked, setIsPhoneLocked] = useState(false);
    const [showModuleCreator, setShowModuleCreator] = useState(false);
    const [newModuleName, setNewModuleName] = useState('');
    const [newModuleDescription, setNewModuleDescription] = useState('');
    const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load draft when phone number is entered
    useEffect(() => {
        if (phoneNumber.length >= 10 && !hasLoadedDraft) {
            loadDraftByPhone(phoneNumber).then((draft) => {
                if (draft) {
                    setEventName(draft.name || '');
                    setDateTime(draft.dateTime || '');
                    setLocation(draft.location || '');
                    setCostPerPerson(draft.costPerPerson || '');
                    setDescription(draft.description || '');
                    if (draft.imageUrl) {
                        setCustomImage(draft.imageUrl);
                    }
                    if (draft.gradient) {
                        setGradient(draft.gradient);
                    }
                    setIsPhoneLocked(true);
                    setHasLoadedDraft(true);
                }
            });
        }
    }, [phoneNumber, loadDraftByPhone, hasLoadedDraft]);

    // Auto-save draft when data changes
    useEffect(() => {
        if (!phoneNumber || phoneNumber.length < 10) return;

        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        autoSaveTimerRef.current = setTimeout(() => {
            const draftData: Partial<EventDraft> & { phoneNumber: string } = {
                phoneNumber,
                name: eventName,
                dateTime,
                location,
                costPerPerson,
                description,
                imageUrl: customImage || defaultImage.url,
                gradient,
            };
            saveDraft(draftData);
        }, 2000);

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [phoneNumber, eventName, dateTime, location, costPerPerson, description, customImage, gradient, saveDraft]);

    // Helper functions for color analysis
    const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return [h * 360, s * 100, l * 100];
    };

    const getColorVibrancy = (r: number, g: number, b: number): number => {
        const [, s, l] = rgbToHsl(r, g, b);
        return s * (1 - Math.abs(l - 50) / 50);
    };

    const toHex = (r: number, g: number, b: number): string =>
        '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');

    const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
        s /= 100;
        l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;

        let r1 = 0, g1 = 0, b1 = 0;
        if (h < 60) { r1 = c; g1 = x; b1 = 0; }
        else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
        else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
        else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
        else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
        else { r1 = c; g1 = 0; b1 = x; }

        return [
            Math.round((r1 + m) * 255),
            Math.round((g1 + m) * 255),
            Math.round((b1 + m) * 255)
        ];
    };

    const adjustColorForGradient = (r: number, g: number, b: number, boost: boolean = false): string => {
        const hsl = rgbToHsl(r, g, b);
        const h = hsl[0];
        let s = hsl[1];
        let l = hsl[2];

        if (boost) {
            s = Math.min(100, s < 40 ? s + 30 : s * 1.2);
            if (l < 40) l = 40 + (l / 40) * 20;
            else if (l > 70) l = 70 - ((l - 70) / 30) * 20;
        }

        const [newR, newG, newB] = hslToRgb(h, s, l);
        return toHex(newR, newG, newB);
    };

    const extractGradient = (imageUrl: string): Promise<GradientColors> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';

            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) {
                    resolve(defaultImage.gradient);
                    return;
                }

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(defaultImage.gradient);
                    return;
                }

                const maxSize = 200;
                const scale = Math.min(maxSize / img.width, maxSize / img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                interface ColorSample {
                    rgb: [number, number, number];
                    vibrancy: number;
                    brightness: number;
                }

                const samples: ColorSample[] = [];
                const sampleCount = 100;

                for (let i = 0; i < sampleCount; i++) {
                    const x = Math.floor(Math.random() * canvas.width);
                    const y = Math.floor(Math.random() * canvas.height);
                    const index = (y * canvas.width + x) * 4;

                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    const a = data[index + 3];

                    if (a < 128) continue;

                    const brightness = (r + g + b) / 3;
                    const vibrancy = getColorVibrancy(r, g, b);

                    samples.push({
                        rgb: [r, g, b],
                        vibrancy,
                        brightness
                    });
                }

                const filteredSamples = samples.filter(s =>
                    s.brightness > 35 && s.brightness < 220
                );

                const workingSamples = filteredSamples.length > 10 ? filteredSamples : samples;

                if (workingSamples.length === 0) {
                    resolve(defaultImage.gradient);
                    return;
                }

                workingSamples.sort((a, b) => b.vibrancy - a.vibrancy);

                const selectColor = (index: number, boost: boolean = false): string => {
                    if (index >= workingSamples.length) {
                        index = workingSamples.length - 1;
                    }
                    const [r, g, b] = workingSamples[index].rgb;
                    return adjustColorForGradient(r, g, b, boost);
                };

                const avgVibrancy = workingSamples.reduce((sum, s) => sum + s.vibrancy, 0) / workingSamples.length;
                const needsBoost = avgVibrancy < 30;

                const primary = selectColor(0, needsBoost);
                let secondary = selectColor(Math.floor(workingSamples.length / 2), needsBoost);
                let accent = selectColor(Math.floor(workingSamples.length * 0.75), needsBoost);

                const areSimilar = (hex1: string, hex2: string): boolean => {
                    const rgb1 = hex1.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
                    const rgb2 = hex2.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
                    const diff = Math.sqrt(
                        Math.pow(rgb1[0] - rgb2[0], 2) +
                        Math.pow(rgb1[1] - rgb2[1], 2) +
                        Math.pow(rgb1[2] - rgb2[2], 2)
                    );
                    return diff < 50;
                };

                if (areSimilar(primary, secondary) || areSimilar(primary, accent)) {
                    const baseRgb = primary.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
                    const [h, s, l] = rgbToHsl(baseRgb[0], baseRgb[1], baseRgb[2]);

                    const [r2, g2, b2] = hslToRgb((h + 30) % 360, Math.min(100, s + 20), l);
                    secondary = adjustColorForGradient(r2, g2, b2, true);

                    const [r3, g3, b3] = hslToRgb((h + 60) % 360, Math.min(100, s + 10), Math.min(80, l + 10));
                    accent = adjustColorForGradient(r3, g3, b3, true);
                }

                resolve({ primary, secondary, accent });
            };

            img.onerror = () => {
                resolve(defaultImage.gradient);
            };

            img.src = imageUrl;
        });
    };

    const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageUrl = event.target?.result as string;
            setCustomImage(imageUrl);

            try {
                const extractedGradient = await extractGradient(imageUrl);
                setGradient(extractedGradient);
            } catch (error) {
                console.error('Error extracting gradient:', error);
                setGradient(defaultImage.gradient);
            }
        };
        reader.readAsDataURL(file);
    };

    const handlePhoneNumberSubmit = () => {
        if (phoneNumber.length >= 10) {
            setIsPhoneLocked(true);
        }
    };

    const handleGoLive = async () => {
        if (!currentEvent?.id) {
            alert('Please save your draft first by entering your phone number');
            return;
        }

        try {
            const newEvent = await publishDraft(currentEvent.id);
            if (newEvent) {
                await goLive(newEvent.id);
                alert('Event is now live! 🎉');
            }
        } catch {
            alert('Failed to go live. Please try again.');
        }
    };

    const handleAddModule = async () => {
        if (!currentEvent?.id || !newModuleName) return;

        try {
            await addCustomModule({
                eventId: currentEvent.id,
                name: newModuleName,
                description: newModuleDescription,
                icon: 'Sparkles',
                code: '// Custom module code goes here',
                order: getEventModules(currentEvent.id).length,
            });
            setNewModuleName('');
            setNewModuleDescription('');
            setShowModuleCreator(false);
        } catch {
            alert('Failed to add module');
        }
    };

    const modules = currentEvent ? getEventModules(currentEvent.id) : [];

    return (
        <div
            className="min-h-screen transition-all duration-700 ease-in-out relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 50%, ${gradient.accent} 100%)`
            }}
        >
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
                    style={{
                        background: gradient.primary,
                        top: '-10%',
                        left: '-5%',
                        animationDelay: '0s'
                    }}
                />
                <div
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
                    style={{
                        background: gradient.accent,
                        bottom: '-10%',
                        right: '-5%',
                        animationDelay: '2s'
                    }}
                />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Header */}
            <header className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
                <div className="flex items-center gap-4 sm:gap-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-white/90">
                        let's hang
                    </h1>
                    <nav className="hidden md:flex gap-6 lg:gap-8 text-white/80 text-sm lg:text-base">
                        <button className="hover:text-white transition-colors">Home</button>
                        <button className="hover:text-white transition-colors">People</button>
                        <button className="hover:text-white transition-colors">Search</button>
                    </nav>
                </div>
                <button className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-white/20 backdrop-blur-md rounded-full text-white border border-white/40 hover:bg-white/25 transition-all shadow-lg">
                    Sign in
                </button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
                    {/* Left Column - Image */}
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
                    </div>

                    {/* Right Column - Form */}
                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
                            Name your event
                        </h2>

                        {/* Auto-save indicator */}
                        {autoSave.isSaving && (
                            <div className="text-white/70 text-sm flex items-center gap-2">
                                <Save size={16} className="animate-pulse" />
                                Saving draft...
                            </div>
                        )}
                        {autoSave.lastSaved && !autoSave.isSaving && (
                            <div className="text-white/70 text-sm flex items-center gap-2">
                                <Save size={16} />
                                Saved {new Date(autoSave.lastSaved).toLocaleTimeString()}
                            </div>
                        )}

                        {/* Phone Number Input */}
                        <div className="relative bg-black/10 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                                <Lock size={18} className="sm:w-5 sm:h-5 text-gray-300" />
                            </div>
                            <input
                                type="tel"
                                placeholder="Enter phone number to save the draft"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isPhoneLocked}
                                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-black/10 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base disabled:opacity-50"
                            />
                            {!isPhoneLocked && (
                                <button
                                    onClick={handlePhoneNumberSubmit}
                                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-white/20 bg-white/10 rounded-lg transition-all"
                                >
                                    <ArrowRight size={18} className="sm:w-5 sm:h-5 text-white" />
                                </button>
                            )}
                        </div>

                        {/* Event Details Card */}
                        <div className="bg-black/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 bg-black/30 backdrop-blur-sm border border-white/20 focus:border-white/40">
                            <div className="flex items-center gap-3 text-white/90">
                                <Calendar size={18} className="sm:w-5 sm:h-5 text-white/60 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Date and time"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/50 text-sm sm:text-base"
                                />
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center gap-3 text-white/90">
                                <MapPin size={18} className="sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/50 text-sm sm:text-base"
                                />
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center gap-3 text-white/90">
                                <DollarSign size={18} className="sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Cost per person"
                                    value={costPerPerson}
                                    onChange={(e) => setCostPerPerson(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/50 text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <textarea
                            placeholder="Describe your event"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40 transition-all resize-none text-sm sm:text-base"
                            rows={4}
                        />

                        {/* Quick Add Modules */}
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

                        {/* Customize Section */}
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

                                {/* Display existing modules */}
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

                                {/* Module creator */}
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
                                        className="w-full py-3 sm:py-4 bg-gradient-to-r from-white/90 to-white/70 rounded-xl sm:rounded-2xl text-white hover:from-white hover:to-white/90 transition-all flex items-center justify-center gap-2 relative z-20 shadow-lg border border-white/50 backdrop-blur-sm text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 50%, ${gradient.accent} 100%)`
                                        }}
                                    >
                                        <Sparkles size={18} className="sm:w-5 sm:h-5 text-yellow-200" />
                                        Customize
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Go Live Button */}
                        <button
                            onClick={handleGoLive}
                            disabled={!currentEvent || !phoneNumber}
                            className="w-full py-3 sm:py-4 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl text-white hover:bg-white/25 transition-all flex items-center justify-center gap-2 shadow-lg border border-white/30 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play size={20} className="sm:w-6 sm:h-6 text-green-400 fill-green-400" />
                            Go live
                        </button>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default EventCreator;