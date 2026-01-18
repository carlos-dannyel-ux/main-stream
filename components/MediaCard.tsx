'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MediaItem } from '@/types/tmdb';
import { getImageUrl, slugify } from '@/lib/tmdb';

interface MediaCardProps {
    item: MediaItem;
    rank?: number;
}

export default function MediaCard({ item, rank }: MediaCardProps) {
    const isMovie = 'title' in item;
    const title = isMovie ? (item as any).title : (item as any).name;
    const rawDate = isMovie ? (item as any).release_date : (item as any).first_air_date;
    const year = rawDate ? new Date(rawDate).getFullYear() : 'N/A';
    const slug = slugify(title);

    return (
        <Link
            href={`/assistir/${slug}?id=${item.id}`}
            className="group block relative card-premium aspect-[2/3] w-full"
        >
            {/* Poster Image */}
            <Image
                src={getImageUrl(item.poster_path, 'w342')}
                alt={title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            />

            {/* Hover Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 rounded-md">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#E50914] mb-1">
                        {isMovie ? 'Filme' : 'Série'}
                    </p>
                    <h3 className="text-sm font-bold leading-tight line-clamp-2 mb-2 text-white">
                        {title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                        <span>{year}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-white">{item.vote_average.toFixed(1)} IMDb</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rank Badge (Optional) */}
            {rank && (
                <div className="absolute top-2 left-2 w-8 h-8 md:w-10 md:h-10 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-lg md:text-xl font-black text-white z-20">
                    {rank}
                </div>
            )}
        </Link>
    );
}
