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
        <section className="container-premium py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">{title}</h1>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-select">
                    <button
                        onClick={() => handleGenreChange('')}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeGenre === ''
                                ? 'bg-[#E50914] text-white shadow-lg shadow-red-600/20'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        Todos
                    </button>
                    {genres.map(genre => (
                        <button
                            key={genre.id}
                            onClick={() => handleGenreChange(genre.id.toString())}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeGenre === genre.id.toString()
                                    ? 'bg-[#E50914] text-white shadow-lg shadow-red-600/20'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {mediaItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="animate-fade-in" style={{ animationDelay: `${(index % 12) * 50}ms` }}>
                        <MediaCard item={item} />
                    </div>
                ))}
            </div>

            {page < totalPages && (
                <div className="mt-16 flex justify-center">
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={isLoading}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50 border border-white/10"
                    >
                        {isLoading ? 'Carregando...' : 'Ver Mais'}
                    </button>
                </div>
            )}
        </section>
    );
}
