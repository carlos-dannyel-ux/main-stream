'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MediaItem } from '@/types/tmdb';
import { getImageUrl, getTitle, getReleaseYear, isMovie } from '@/lib/tmdb';

interface MediaCardProps {
    item: MediaItem;
    rank?: number;
}

export default function MediaCard({ item, rank }: MediaCardProps) {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const title = getTitle(item);
    const year = getReleaseYear(item);
    const type = isMovie(item) ? 'movie' : 'tv';

    return (
        <Link
            href={`/${type}/${item.id}`}
            className="group relative flex-shrink-0 w-[110px] sm:w-[160px] md:w-[180px] lg:w-[200px] touch-scroll-item transition-all active:scale-95"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Rank Badge */}
            {rank && (
                <div className="absolute -left-1 -top-1 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-sm shadow-lg">
                    {rank}
                </div>
            )}

            {/* Card */}
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                {!imageError && item.poster_path ? (
                    <Image
                        src={getImageUrl(item.poster_path, 'w342')}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                    </div>
                )}

                {/* Metadata Overlay - Always partially visible on mobile, full on hover */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-300 md:${isHovered ? 'opacity-100' : 'opacity-0'} ${isHovered ? 'opacity-100' : 'opacity-100'}`}
                >
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                        <h3 className="text-white font-semibold text-[10px] sm:text-sm line-clamp-2 mb-0.5 sm:mb-1 leading-tight">{title}</h3>
                        <div className="flex items-center gap-1.5 text-[8px] sm:text-xs text-gray-300">
                            {year && <span>{year}</span>}
                            <div className="flex items-center gap-0.5">
                                <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-white">{item.vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
