'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { MediaItem, TMDBVideo } from '@/types/tmdb';
import { getBackdropUrl, getTitle, getReleaseYear, isMovie, getTrailerKey, slugify } from '@/lib/tmdb';
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
            <section className="relative w-full h-[75vh] sm:h-[70vh] lg:h-[85vh] min-h-[500px] sm:min-h-[400px]">
                {/* Background Image */}
                <div className="absolute inset-0">
                    {!imageError && item.backdrop_path ? (
                        <Image
                            src={getBackdropUrl(item.backdrop_path)}
                            alt={title}
                            fill
                            priority
                            className="object-cover object-center"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                    )}

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-end pb-12 sm:pb-16 lg:pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-2xl space-y-6 animate-fade-in">
                            {/* Tags */}
                            <div className="flex items-center gap-3 text-xs font-black tracking-widest uppercase">
                                <span className="text-[#E50914] bg-[#E50914]/10 px-2 py-1 rounded">Em Tendência</span>
                                {year && <span className="text-gray-400">{year}</span>}
                                <span className="text-gray-400">{item.vote_average.toFixed(1)} IMDb</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-hero-title text-white">
                                {title}
                            </h1>

                            {/* Description */}
                            <p className="text-gray-300 text-sm md:text-lg lg:text-xl line-clamp-3 leading-relaxed max-w-xl">
                                {item.overview || 'Sem descrição disponível.'}
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <Link
                                    href={`/assistir/${slug}?id=${item.id}`}
                                    className="px-8 py-4 bg-[#E50914] hover:bg-[#b90710] text-white font-black uppercase tracking-widest rounded-md transition-all shadow-xl shadow-red-600/20 flex items-center gap-2"
                                >
                                    Assistir Agora
                                </Link>

                                {trailerKey && (
                                    <button
                                        onClick={() => setIsTrailerOpen(true)}
                                        className="px-8 py-4 glass-morphism hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-md transition-all flex items-center gap-2"
                                    >
                                        Trailers
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
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
