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
                        <div className="max-w-2xl">
                            {/* Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                                    {isMovie(item) ? 'FILME' : 'SÉRIE'}
                                </span>
                                {year && (
                                    <span className="text-gray-300 text-sm">{year}</span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                {title}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-white font-semibold">{item.vote_average.toFixed(1)}</span>
                                </div>
                            </div>

                            {/* Overview */}
                            <p className="text-gray-300 text-sm sm:text-base lg:text-lg line-clamp-3 sm:line-clamp-4 mb-8">
                                {item.overview || 'Sem descrição disponível.'}
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Link
                                    href={`/assistir/${slugify(getTitle(item))}?id=${item.id}`}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    <span>Assistir Agora</span>
                                </Link>
                                {trailerKey && (
                                    <button
                                        onClick={() => setIsTrailerOpen(true)}
                                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all active:scale-95 border border-white/20"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        <span>Trailers</span>
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
