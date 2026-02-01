// File: src/components/Header.tsx
const Header = () => {
    return (
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
    );
};

export default Header;