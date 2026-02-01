import { useState, useRef } from 'react';
import { MapPin, DollarSign, Calendar, Users, Image as ImageIcon, Link, MessageSquare } from 'lucide-react';

interface GradientColors {
    primary: string;
    secondary: string;
    accent: string;
}

const defaultImage = {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRkYTY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNhODdhZmY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY4OGZmO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ZT1UmYXBvcztyZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JTlZJVEVEPC90ZXh0Pjwvc3ZnPg==',
    gradient: { primary: '#ff4da6', secondary: '#a87aff', accent: '#6688ff' }
};

export const EventCreator = () => {
    const [gradient, setGradient] = useState<GradientColors>(defaultImage.gradient);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState('');
    const [costPerPerson, setCostPerPerson] = useState('');
    const [description, setDescription] = useState('');
    const [showMore, setShowMore] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const extractGradient = (imageUrl: string): Promise<GradientColors> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';

            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Sample colors from different regions
                const colors: Array<[number, number, number]> = [];
                const sampleSize = 20;

                for (let i = 0; i < sampleSize; i++) {
                    const x = Math.floor((canvas.width / sampleSize) * i);
                    const y = Math.floor(canvas.height / 2);
                    const index = (y * canvas.width + x) * 4;
                    colors.push([data[index], data[index + 1], data[index + 2]]);
                }

                // Convert to hex
                const toHex = (r: number, g: number, b: number) =>
                    '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

                const primary = toHex(...colors[0]);
                const secondary = toHex(...colors[Math.floor(colors.length / 2)]);
                const accent = toHex(...colors[colors.length - 1]);

                resolve({ primary, secondary, accent });
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
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div
            className="min-h-screen transition-all duration-700 ease-in-out relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 50%, ${gradient.accent} 100%)`
            }}
        >
            {/* Animated background elements */}
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
            <header className="relative z-10 px-6 py-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white/90" style={{ fontFamily: 'Georgia, serif' }}>
                    let's hang
                </h1>
                <nav className="hidden md:flex gap-8 text-white/80">
                    <button className="hover:text-white transition-colors">Home</button>
                    <button className="hover:text-white transition-colors">People</button>
                    <button className="hover:text-white transition-colors">Search</button>
                </nav>
                <button className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/40 hover:bg-white/25 transition-all shadow-lg">
                    Sign in
                </button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column - Image Preview */}
                    <div className="space-y-6">
                        <div className="relative group">
                            <div className="aspect-square rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                                <img
                                    src={customImage || defaultImage.url}
                                    alt="Event preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-4 right-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/40 shadow-lg"
                                >
                                    <ImageIcon size={20} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/25 transition-all flex items-center justify-center gap-2 shadow-lg border border-white/30"
                        >
                            <ImageIcon size={20} />
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
                    <div className="space-y-6">
                        <h2 className="text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                            Name your event
                        </h2>

                        {/* Phone Input with Lock Icon */}
                        <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="5" y="11" width="14" height="10" rx="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            </div>
                            <input
                                type="tel"
                                placeholder="Enter phone number to save the draft"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-transparent rounded-2xl text-white placeholder-white/50 border-none focus:outline-none"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                                    <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Event Details Card */}
                        <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-6 space-y-4">
                            <div className="flex items-center gap-3 text-white/90">
                                <Calendar size={20} className="text-white/60" />
                                <input
                                    type="text"
                                    placeholder="Date and time"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/50"
                                />
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center gap-3 text-white/90">
                                <MapPin size={20} className="text-white/60" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/50"
                                />
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center gap-3 text-white/90">
                                <DollarSign size={20} className="text-white/60" />
                                <input
                                    type="text"
                                    placeholder="Cost per person"
                                    value={costPerPerson}
                                    onChange={(e) => setCostPerPerson(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/50"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <textarea
                            placeholder="Describe your event"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-6 py-4 bg-black/20 backdrop-blur-sm rounded-2xl text-white placeholder-white/50 border-none focus:outline-none transition-all resize-none"
                            rows={4}
                        />

                        {/* Additional Options */}
                        <div className="flex flex-wrap gap-3">
                            <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/40 hover:bg-white/25 transition-all flex items-center gap-2 shadow-lg">
                                <Users size={18} />
                                Capacity
                            </button>
                            <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/40 hover:bg-white/25 transition-all flex items-center gap-2 shadow-lg">
                                <ImageIcon size={18} />
                                Photo gallery
                            </button>
                            <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/40 hover:bg-white/25 transition-all flex items-center gap-2 shadow-lg">
                                <Link size={18} />
                                Links
                            </button>
                            <button
                                onClick={() => setShowMore(!showMore)}
                                className="px-6 py-3 text-white/70 hover:text-white transition-all"
                            >
                                {showMore ? 'Show less' : 'Show more'}
                            </button>
                        </div>

                        {/* Customize Section */}
                        <div className="bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 relative overflow-hidden shadow-2xl">
                            {/* Decorative icons scattered around */}
                            <div className="absolute top-8 left-8 text-white/25 z-0">
                                <MessageSquare size={32} strokeWidth={1.5} />
                            </div>
                            <div className="absolute top-8 right-8 text-white/25 z-0">
                                <Link size={32} strokeWidth={1.5} />
                            </div>
                            <div className="absolute bottom-8 left-10 text-white/25 z-0">
                                <Users size={32} strokeWidth={1.5} />
                            </div>
                            <div className="absolute bottom-8 right-10 text-white/25 z-0">
                                <ImageIcon size={32} strokeWidth={1.5} />
                            </div>
                            <div className="absolute top-1/2 left-6 -translate-y-1/2 text-white/25 z-0">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                </svg>
                            </div>

                            <div className="relative z-10 text-center space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Customize your event your way
                                    </h3>
                                    <p className="text-white/40 text-sm font-bold tracking-widest">RSVP</p>
                                </div>

                                <button 
                                    className="w-full py-4 bg-gradient-to-r from-white/90 to-white/70 rounded-2xl text-white hover:from-white hover:to-white/90 transition-all flex items-center justify-center gap-2 relative z-20 shadow-lg border border-white/50 backdrop-blur-sm"
                                    style={{
                                        background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 50%, ${gradient.accent} 100%)`
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.5" />
                                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                    Customize
                                </button>
                            </div>
                        </div>

                        {/* Go Live Button */}
                        <button 
                            className="w-full py-5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl text-white font-semibold text-lg hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm border border-white/30"
                            style={{
                                background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 50%, ${gradient.accent} 100%)`
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                            </svg>
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