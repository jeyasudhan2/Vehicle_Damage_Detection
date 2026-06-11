import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
    onFileSelected: (file: File) => void;
    isLoading?: boolean;
}

/**
 * Drag-and-drop image upload component with preview.
 * Accepts JPG, PNG, WebP files up to 10 MB.
 */
export default function ImageUploader({ onFileSelected, isLoading }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10 MB
        disabled: isLoading,
    });

    const handleDetect = () => {
        if (selectedFile) onFileSelected(selectedFile);
    };

    const handleRemove = () => {
        setPreview(null);
        setSelectedFile(null);
    };

    return (
        <div className="w-full max-w-2xl pt-10 mx-auto">
            {/* Drop zone */}
            {!preview ? (
                <div
                    {...getRootProps()}
                    className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-500 p-12 text-center ${isDragActive
                            ? 'border-purple-400 bg-purple-500/5 scale-[1.02]'
                            : 'border-white/10 hover:border-purple-400/50 hover:bg-white/[0.02]'
                        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <input {...getInputProps()} />

                    {/* Upload icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <svg
                            className="w-10 h-10 text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                    </div>

                    <h3 className="text-white text-lg font-semibold mb-2">
                        {isDragActive ? 'Drop your image here' : 'Drag & drop your vehicle image'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                        or <span className="text-purple-400 underline underline-offset-4">browse files</span> from your computer
                    </p>
                    <p className="text-slate-500 text-xs">
                        Supports JPG, PNG, WebP • Max 10 MB
                    </p>
                </div>
            ) : (
                /* Preview state */
                <div className="space-y-6">
                    <div className="relative rounded-2xl overflow-hidden glass group">
                        <img
                            src={preview}
                            alt="Vehicle preview"
                            className="w-full h-80 object-cover"
                        />

                        {/* Loading overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                                {/* Scan line */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan" />
                                </div>
                                <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mb-4" />
                                <p className="text-purple-400 font-medium">Analyzing damage…</p>
                                <p className="text-slate-400 text-sm mt-1">AI model processing your image</p>
                            </div>
                        )}

                        {/* Remove button (only shown when not loading) */}
                        {!isLoading && (
                            <button
                                onClick={handleRemove}
                                className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 backdrop-blur text-white/70 hover:text-white hover:bg-red-500/50 transition-all duration-300"
                                aria-label="Remove image"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* File info and detect button */}
                    {!isLoading && (
                        <div className="flex flex-col pt-10 sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium truncate max-w-[200px]">
                                        {selectedFile?.name}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                        {selectedFile && (selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleDetect}
                                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                Detect Damage
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
