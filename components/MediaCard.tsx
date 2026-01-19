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
    const slug = slugify(title);

    if (rank) {
        return (
            <Link
                href={`/assistir/${slug}?id=${item.id}`}
                className="relative flex items-center min-w-[180px] md:min-w-[240px] h-[190px] md:h-[260px] group transition-transform duration-300 hover:scale-110 z-10 hover:z-20"
            >
                <span className="top-10-number absolute left-[-20px] md:left-[-40px] bottom-[-20px] md:bottom-[-40px] select-none">
                    {rank}
                </span>
                <div className="relative w-[130px] md:w-[180px] h-full ml-auto overflow-hidden rounded-sm netflix-shadow">
                    <Image
                        src={getImageUrl(item.poster_path, 'w342')}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 130px, 180px"
                    />
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/assistir/${slug}?id=${item.id}`}
            className="group block relative min-w-[140px] sm:min-w-[180px] md:min-w-[200px] aspect-[2/3] transition-transform duration-300 hover:scale-105 z-10 hover:z-20"
        >
            <div className="relative w-full h-full overflow-hidden rounded-sm netflix-shadow">
                <Image
                    src={getImageUrl(item.poster_path, 'w342')}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 200px"
                />

                {/* Netflix Badge Placeholder */}
                <div className="absolute top-0 right-0 p-1">
                    <span className="bg-[#E50914] text-[8px] font-black text-white px-1 py-0.5 rounded-sm">TOP 10</span>
                </div>
            </div>

            {/* Hover Details (Simplified Netflix Version) */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 6v12l10-6z" /></svg>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-400 bg-gray-900/50 flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                    </div>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold mt-1">
                    <span>95% relevante</span>
                    <span className="text-white border border-gray-500 px-1 rounded-sm">16+</span>
                </div>
            </div>
        </Link>
    );
}

