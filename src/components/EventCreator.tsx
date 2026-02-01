import { useState, useRef } from 'react';
import { MapPin, DollarSign, Calendar, Users, Image as ImageIcon, Link, MessageSquare } from 'lucide-react';

interface GradientColors {
    primary: string;
    secondary: string;
    accent: string;
}

const defaultImages = [
    {
        id: 1,
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRkYTY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNhODdhZmY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY4OGZmO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ZT1UmYXBvcztyZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC43IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JTlZJVEVEPC90ZXh0Pjwvc3ZnPg==',
        gradient: { primary: '#ff4da6', secondary: '#a87aff', accent: '#6688ff' }
    },
    {
        id: 2,
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImciPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjYyYjg7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZiNGQ0O3N0b3Atb3BhY2l0eToxIiAvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSIzMCIgZmlsbD0iI2NjMDAzMyIvPjxwYXRoIGQ9Ik0xNTAgMjUwIFEgMjAwIDM1MCAyNTAgMjUwIiBzdHJva2U9IiNjYzAwMzMiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjxwb2x5Z29uIHBvaW50cz0iMjAwLDE4MCAxNzAsMjMwIDIzMCwyMzAiIGZpbGw9IiNmZmIzZDkiLz48cGF0aCBkPSJNMTUwIDMwMCBRIDIwMCAzMjAgMjUwIDMwMCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
        gradient: { primary: '#ff62b8', secondary: '#ffb4d4', accent: '#ff8ac9' }
    },
    {
        id: 3,
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjk5NWU7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZkNzZlO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI1MCIgZmlsbD0iI2ZmZDcwMCIvPjxwYXRoIGQ9Ik0xMDAgMzAwIEwgMzAwIDMwMCIgc3Ryb2tlPSIjZmY2NjAwIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIyMCIgcj0iMTUiIGZpbGw9IiNmZmE1MDAiLz48Y2lyY2xlIGN4PSIyNTAiIGN5PSIyMjAiIHI9IjE1IiBmaWxsPSIjZmZhNTAwIi8+PC9zdmc+',
        gradient: { primary: '#ff995e', secondary: '#ffd76e', accent: '#ffb847' }
    },
    {
        id: 4,
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0ZGFhZmY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojN2E4OGZmO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2cpIi8+PHBhdGggZD0iTTEwMCAxNTAgTCAyMDAgNTAgTCAzMDAgMTUwIEwgMjAwIDI1MCBaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIzMDAiIHI9IjQwIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjQiLz48L3N2Zz4=',
        gradient: { primary: '#4daeff', secondary: '#7a88ff', accent: '#639bff' }
    }
];

export const EventCreator = () => {
    const [selectedImage, setSelectedImage] = useState(defaultImages[0]);
    const [gradient, setGradient] = useState<GradientColors>(defaultImages[0].gradient);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState('');
    const [costPerPerson, setCostPerPerson] = useState('');
    const [description, setDescription] = useState('');
    const [showMore, setShowMore] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Extract dominant colors from image
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

    const handleImageSelect = async (image: typeof defaultImages[0]) => {
        setSelectedImage(image);
        setGradient(image.gradient);
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
                setSelectedImage({ id: 999, url: imageUrl, gradient: extractedGradient });
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
                <button className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30 hover:bg-white/30 transition-all">
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
                                    src={customImage || selectedImage.url}
                                    alt="Event preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all border border-white/30"
                                >
                                    <ImageIcon size={20} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white border border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
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

                        {/* Preset Images */}
                        <div className="grid grid-cols-4 gap-3">
                            {defaultImages.map((image) => (
                                <button
                                    key={image.id}
                                    onClick={() => handleImageSelect(image)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedImage.id === image.id
                                        ? 'border-white shadow-lg'
                                        : 'border-white/30'
                                        }`}
                                >
                                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="space-y-6">
                        <h2 className="text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                            Name your event
                        </h2>

                        {/* Phone Input */}
                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="Enter phone number to save the draft"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none transition-all"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                                    <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Event Details Card */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 space-y-4">
                            <div className="flex items-center gap-3 text-white/90">
                                <Calendar size={20} className="text-white/70" />
                                <input
                                    type="text"
                                    placeholder="Date and time"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/60"
                                />
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center gap-3 text-white/90">
                                <MapPin size={20} className="text-white/70" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/60"
                                />
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center gap-3 text-white/90">
                                <DollarSign size={20} className="text-white/70" />
                                <input
                                    type="text"
                                    placeholder="Cost per person"
                                    value={costPerPerson}
                                    onChange={(e) => setCostPerPerson(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none placeholder-white/60"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <textarea
                            placeholder="Describe your event"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none transition-all resize-none"
                            rows={4}
                        />

                        {/* Additional Options */}
                        <div className="flex flex-wrap gap-3">
                            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2">
                                <Users size={18} />
                                Capacity
                            </button>
                            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2">
                                <ImageIcon size={18} />
                                Photo gallery
                            </button>
                            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2">
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
                        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-6xl text-white/10">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>

                            <div className="relative z-10 text-center space-y-6">
                                <div className="flex justify-center gap-8 opacity-40">
                                    <MessageSquare size={32} className="text-white" />
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                                        <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                        <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                        <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                        <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <Users size={32} className="text-white" />
                                    <Link size={32} className="text-white" />
                                    <ImageIcon size={32} className="text-white" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Customize your event your way
                                    </h3>
                                    <p className="text-white/60 text-sm">RSVP</p>
                                </div>

                                <button className="w-full py-4 bg-white/20 backdrop-blur-sm rounded-2xl text-white border border-white/30 hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.5" />
                                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    Customize
                                </button>
                            </div>
                        </div>

                        {/* Go Live Button */}
                        <button className="w-full py-5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl text-white font-semibold text-lg hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                            </svg>
                            Go live
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};