'use client';

import { useState, useEffect } from 'react';
import { TMDBGenre, MediaItem } from '@/types/tmdb';
import { getDiscoverMedia } from '@/lib/tmdb';
import MediaCard from './MediaCard';

interface CatalogGridProps {
    type: 'movie' | 'tv';
    genres: TMDBGenre[];
    title: string;
}

export default function CatalogGrid({ type, genres, title }: CatalogGridProps) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [activeGenre, setActiveGenre] = useState<string>('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMedia = async () => {
            setIsLoading(true);
            try {
                const response = await getDiscoverMedia(type, page, activeGenre);
                if (page === 1) {
                    setMediaItems(response.results);
                } else {
                    setMediaItems(prev => [...prev, ...response.results]);
                }
                setTotalPages(response.total_pages);
            } catch (error) {
                console.error('Error fetching catalog:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedia();
    }, [type, page, activeGenre]);

    const handleGenreChange = (genreId: string) => {
        setActiveGenre(genreId);
        setMediaItems([]);
        setPage(1);
    };

    return (
        <section className="px-4 md:px-12 py-8">
            <div className="flex items-center gap-8 mb-8 sticky top-[70px] z-[80] bg-[#141414] py-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white transition-colors">{title}</h1>

                <div className="relative">
                    <select
                        onChange={(e) => handleGenreChange(e.target.value)}
                        value={activeGenre}
                        className="bg-black text-white text-sm font-bold border border-white px-4 py-1.5 pr-10 appearance-none cursor-pointer hover:bg-white/10 transition-colors rounded-sm"
                    >
                        <option value="">Gêneros</option>
                        {genres.map(genre => (
                            <option key={genre.id} value={genre.id.toString()}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                {mediaItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="animate-netflix-entrance">
                        <MediaCard item={item} />
                    </div>
                ))}
            </div>

            {page < totalPages && (
                <div className="mt-16 flex justify-center pb-20 md:pb-12">
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={isLoading}
                        className="px-10 py-2 bg-transparent hover:bg-white/5 text-white font-bold border border-[#808080] rounded-sm transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Carregando...' : 'Carregar mais'}
                    </button>
                </div>
            )}
        </section>
    );
}

