import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdCarCrash } from "react-icons/md";
import { useAuthContext } from '../context/AuthContext';

/**
 * Top navigation bar — fixed, glassmorphism background.
 * Active link highlighted with purple accent.
 */
export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const [isModel , setIsmodel] = useState<boolean>(false)

     const { user, signOut } = useAuthContext();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobileOpen(false);
    }, [location]);

    const handleModel =()=>{
        setIsmodel(!isModel)
    }

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/upload', label: 'Detect' },
        { to: '/history', label: 'History' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'glass-strong shadow-lg shadow-black/20'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-full   py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-300">
                    <MdCarCrash className="w-6 h-6 text-white" />
                    </div>
                    <span className=" capitalize font-display text-sm font-bold tracking-wider text-white group-hover:text-purple-400 transition-colors duration-300">
                   vehicle  <span className=' font-[Zangezi] gradient-text  '>Damage</span> Detect<span className="text-purple-400">. </span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`relative px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.to)
                                    ? 'text-purple-400 bg-purple-400/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                            {isActive(link.to) && (
                                <span className="absolute bottom-0 left-1/2 duration-1000 -translate-x-1/2 w-9/12 h-0.5 bg-purple-400 rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                           {user && (
                    <div onClick={handleModel} className=" cursor-pointer  relative rounded-full   flex items-center
                                    justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div   className="w-9 h-9 rounded-full bg-violet-500/20 border
                                            border-violet-500/30 flex items-center justify-center">
                                <span className="text-violet-400 text-sm font-bold uppercase">
                                    {user.email?.[0] ?? '?'}
                                </span>
                            </div>
                            <div>
                                {isModel && (
                                      <div  className="absolute z-1001 right-5 p-5 top-15 w-60 backdrop-blur-md bg-[#100312] border-[1.5px] border-purple-400 rounded-xl flex items-center
                                    justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-4xl bg-violet-500/20 border
                                            border-violet-500/30 flex items-center justify-center">
                                <span className="text-violet-400 text-sm font-bold uppercase">
                                    {user.email?.[0] ?? '?'}
                                </span>
                            </div>
                            <span className=' absolute top-1 right-4 cursor-pointer '  onClick={handleModel}>X</span>
                            <div>
                                <p className="text-white text-sm font-semibold">{user.email?.slice(0,9)}</p>
                                <p className="text-slate-500 text-xs">
                                    Showing your detections only
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-emerald-400 text-xs font-mono">CONNECTED</span>
                        </div>

                        <button
                            onClick={signOut}
                            className="px-4 py-1 glass rounded-xl text-xs font-extrabold text-slate-400
                                       hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                            Sign Out
                        </button>
                    </div>
                                )}
                            </div>
                           
                        </div>
                    
                    </div>
                )} 

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden glass-strong transition-all duration-300 ${mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 pb-4 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(link.to)
                                    ? 'text-purple-400 bg-purple-400/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/upload"
                        className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-500 text-white text-sm font-semibold rounded-xl text-center mt-2"
                    >
                        Upload Image
                    </Link>
                </div>
            </div>
        </nav>
    );
}
