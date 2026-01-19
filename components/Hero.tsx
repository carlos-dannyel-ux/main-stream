'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { MediaItem, TMDBVideo } from '@/types/tmdb';
import { getBackdropUrl, getTitle, getReleaseYear, getTrailerKey, slugify } from '@/lib/tmdb';
import TrailerModal from './TrailerModal';

interface HeroProps {
    item: MediaItem;
    videos?: TMDBVideo[];
}

export default function Hero({ item, videos = [] }: HeroProps) {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const title = getTitle(item);
    const year = getReleaseYear(item);
    const trailerKey = getTrailerKey({ id: item.id, results: videos });
    const slug = slugify(title);

    return (
        <>
            <section className="relative w-full h-[85vh] sm:h-[95vh] min-h-[600px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    {!imageError && item.backdrop_path ? (
                        <Image
                            src={getBackdropUrl(item.backdrop_path, 'original')}
                            alt={title}
                            fill
                            priority
                            className="object-cover object-center animate-netflix-entrance"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-[#141414]" />
                    )}

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 netflix-gradient-bottom" />
                    <div className="absolute inset-0 netflix-gradient-left hidden md:block" />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center px-4 md:px-12 pt-20">
                    <div className="max-w-2xl space-y-4 md:space-y-6">
                        {/* Netflix Original Tag Placeholder (Optional) */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[#E50914] font-black text-xl tracking-[0.2em]">N</span>
                            <span className="text-gray-300 font-bold text-xs md:text-sm tracking-widest uppercase">
                                {item.media_type === 'tv' ? 'Série' : 'Filme'}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                            {title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-white text-sm md:text-lg font-semibold">
                            <span className="text-green-500">98% relevante</span>
                            <span>{year}</span>
                            <span className="border border-gray-500 px-1.5 py-0.5 text-xs rounded-sm">16+</span>
                            <span>{item.media_type === 'tv' ? '5 Temporadas' : '2h 14min'}</span>
                            <span className="border border-gray-500 px-1 text-[10px] rounded-[2px] font-bold">HD</span>
                        </div>

                        {/* Description */}
                        <p className="text-white text-sm md:text-lg lg:text-xl line-clamp-3 leading-snug max-w-xl drop-shadow-lg font-medium">
                            {item.overview || 'Sem descrição disponível.'}
                        </p>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <Link
                                href={`/assistir/${slug}?id=${item.id}`}
                                className="flex items-center justify-center gap-3 px-6 md:px-8 py-2 md:py-3 bg-white hover:bg-white/80 transition-colors text-black rounded-md font-bold text-sm md:text-xl"
                            >
                                <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 6v12l10-6z" />
                                </svg>
                                Assistir
                            </Link>

                            <button
                                onClick={() => setIsTrailerOpen(true)}
                                className="flex items-center justify-center gap-3 px-6 md:px-8 py-2 md:py-3 bg-gray-500/50 hover:bg-gray-500/40 transition-colors text-white rounded-md font-bold text-sm md:text-xl backdrop-blur-md"
                            >
                                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Mais informações
                            </button>
                        </div>
                    </div>
                </div>

                {/* Maturity Rating Fixed (Bottom Right) */}
                <div className="absolute bottom-10 right-0 bg-gray-500/30 border-l-4 border-gray-400 py-1.5 px-10 text-white font-bold text-lg backdrop-blur-sm">
                    16+
                </div>
            </section>

            {/* Trailer Modal */}
            {trailerKey && (
                <TrailerModal
                    isOpen={isTrailerOpen}
                    onClose={() => setIsTrailerOpen(false)}
                    videoKey={trailerKey}
                    title={title}
                />
            )}
        </>
    );
}

