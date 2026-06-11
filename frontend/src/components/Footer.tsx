import { Link } from 'react-router-dom';
import { MdCarCrash } from "react-icons/md";


/**
 * Footer with branding, quick nav, and social-placeholder links.
 */
export default function Footer() {
    return (
        <footer className="relative border-t border-white/5">
            {/* Gradient fade at the top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-500 flex items-center justify-center">
                                < MdCarCrash />
                            </div>
                            <span className="font-display text-lg font-bold tracking-wider text-white">
                                VDD<span className="text-purple-400">.</span>AI
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm pt-10 leading-relaxed max-w-sm">
                            AI-powered vehicle damage detection providing instant analysis,
                            cost estimation, and insurance claim assistance for automotive
                            professionals and vehicle owners.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/upload', label: 'Detect Damage' },
                                { to: '/history', label: 'History' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-slate-400 text-sm hover:text-purple-400 transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                   
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} VDD.AI — All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {['Privacy', 'Terms'].map((item) => (
                            <button
                                key={item}
                                className="text-slate-500 text-xs hover:text-purple-400 transition-colors duration-300"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
