import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import FloatingElements from '../components/FloatingElements';
import { useHeroEntrance, useStaggerIn, useScrollFadeIn } from '../animations/gsapEffects';
import { useHistory } from '../hooks/useHistory';


/**
 * Landing Page
 * - Full-viewport hero with GSAP entrance animation
 * - Floating parallax elements
 * - Features section with staggered scroll-in cards
 * - Stats ribbon + CTA section
 */
export default function LandingPage() {
     const { data: history } = useHistory();
     const len = history?.length
    const heroRef = useHeroEntrance<HTMLDivElement>();
    const featuresRef = useStaggerIn<HTMLDivElement>(0.15);
    const statsRef = useScrollFadeIn<HTMLDivElement>(0);
    const ctaRef = useScrollFadeIn<HTMLDivElement>(0.1);
 const stats = [
        { value: '80.2%', label: 'Detection Accuracy' },
        { value: '<7s', label: 'Analysis Time' },
        { value: len, label: 'Images Processed' },
        { value: '12+', label: 'Damage Types' },
    ];
    const features = [
        {
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
            ),
            title: 'AI Damage Detection',
            description: 'Advanced deep learning models trained on thousands of vehicle damage images for precise identification of dents, scratches, cracks, and more.',
            accentColor: 'emerald',
        },
        {
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            ),
            title: 'Real-Time Analysis',
            description: 'Get instant results within seconds. Our optimized inference pipeline processes images in real-time with GPU-accelerated detection.',
            accentColor: 'amber',
        },
      
        {
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            title: 'Insurance Claim Assist',
            description: 'Generate comprehensive damage reports formatted for insurance claims. Includes damage classification, photographic evidence, and cost breakdowns.',
            accentColor: 'violet',
        },
    ];

  

    return (
        <div className="relative font-[poppins]">
            {/* ═══════════════ HERO SECTION ═══════════════ */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Floating animated background elements */}
                <FloatingElements />

                {/* Hero content */}
                <div
                    ref={heroRef}
                    className="relative   z-10 max-w-6xl mx-auto px-6 text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1  rounded-full glass text-xs text-purple-400 font-medium mb-8">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Powered by YOLOv8 Deep Learning
                    </div>

                    {/* Main heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                        <span className="text-white">AI Powered</span>
                        <br />
                        <span className="gradient-text font-[Zangezi] ">Vehicle Damage</span>
                        <br />
                        <span className="text-white">Detection</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-slate-400 text-lg sm:text-sm max-w-2xl mx-auto  mb-10 leading-relaxed">
                        Upload a photo of your vehicle and let our AI instantly detect damages,
                        estimate repair costs, and generate insurance-ready reports.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center pt-5 gap-2">
                        <Link
                            to="/upload"
                            className="group px-5 py-2 bg-gradient-to-r from-purple-500 via-zinc-700 to-purple-900 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            Start Detection
                        </Link>
                        <Link
                            to="/history"
                            className="group px-10 py-2  relative glass rounded-xl text-slate-300 font-medium hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                            View History 
                            <span className=' right-4 absolute  group-hover:translate-x-2 duration-1500 ease-out '> →</span>
                        </Link>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-[#030712] to-transparent" />
            </section>

            {/* ═══════════════ STATS RIBBON ═══════════════ */}
            <section className="relative flex justify-center min-w-full lg:py-16">
                <div
                    ref={statsRef}
                    className="w-full "
                >
                    <div className="glass rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                                <p className="text-slate-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ FEATURES SECTION ═══════════════ */}
            <section className="relative py-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section heading */}
                    <div className="text-center mb-16">
                        <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">
                            Capabilities
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Everything you need for{' '}
                            <span className="gradient-text">damage analysis</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Our platform combines state-of-the-art computer vision with
                            practical automotive expertise.
                        </p>
                    </div>

                    {/* Feature cards — stagger animated */}
                    <div
                        ref={featuresRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((f) => (
                            <FeatureCard key={f.title} {...f} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA SECTION ═══════════════ */}
            <section className="relative  py-15">
                <div
                    ref={ctaRef}
                    className="max-w-5xl  mx-auto px-6 text-center"
                >
                    <div className="glass glass rounded-3xl p-12 md:p-10 relative overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />

                        <div className="relative flex flex-col justify-between gap-4 items-center z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to detect damage?
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto mb-8">
                                Upload your first image and experience the power of AI-driven
                                vehicle damage analysis in seconds.
                            </p>
                            <Link
                                to="/upload"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300"
                            >
                                Upload Vehicle Image
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
