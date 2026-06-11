import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import { useDetection } from '../hooks/useDetection';
import { useScrollFadeIn } from '../animations/gsapEffects';

/**
 * Upload Page
 * - Drag-and-drop image upload with preview
 * - Triggers detection mutation and navigates to result page
 */
export default function UploadPage() {
    const navigate = useNavigate();
    const detection = useDetection();
    const headerRef = useScrollFadeIn<HTMLDivElement>(0);

    const handleFileSelected = (file: File) => {
        detection.mutate(file, {
            onSuccess: (result) => {
                navigate(`/result/${result.id}`, { state: { result } });
            },
        });
    };

    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-12">
                    <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">
                        Damage Detection
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Upload Your <span className="gradient-text font-[Zangezi] ">Vehicle Image</span>
                    </h1>
                    <p className="text-slate-400 text-xs max-w-lg mx-auto">
                        Drag and drop or browse to upload a clear photo of your vehicle.
                        Our AI will analyze it for damage within seconds.
                    </p>
                </div>

                {/* Upload component */}
                <ImageUploader
                    onFileSelected={handleFileSelected}
                    isLoading={detection.isPending}
                />

                {/* Error state */}
                {detection.isError && (
                    <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        <p className="font-medium">Detection failed</p>
                        <p className="text-red-400/70 mt-1">
                            {detection.error?.message || 'Something went wrong. Please try again.'}
                        </p>
                    </div>
                )}

                {/* Tips section */}
                <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                </svg>
                            ),
                            title: 'Clear Photo',
                            desc: 'Take a well-lit, focused photo of the damaged area',
                        },
                        {
                            icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                </svg>
                            ),
                            title: 'Close-Up Shot',
                            desc: 'Capture close-up views for better damage detection',
                        },
                        {
                            icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            ),
                            title: 'Good Lighting',
                            desc: 'Natural daylight produces the most accurate results',
                        },
                    ].map((tip) => (
                        <div key={tip.title} className="glass rounded-xl p-5 text-center">
                            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                                {tip.icon}
                            </div>
                            <h3 className="text-white text-sm font-semibold mb-1">{tip.title}</h3>
                            <p className="text-slate-400 text-xs">{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
