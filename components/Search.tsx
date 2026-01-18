'use client';

import { useState, useEffect, useRef } from 'react';
import { MediaItem } from '@/types/tmdb';
import { getTitle, getReleaseYear, getImageUrl, isMovie } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MediaItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 2) {
                setIsSearching(true);
                try {
                    const response = await fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}&language=pt-BR&include_adult=false`);
                    const data = await response.json();
                    setResults(data.results?.slice(0, 5) || []);
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pesquisar filmes ou séries..."
                    className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all placeholder:text-gray-400"
                    onFocus={() => query.trim().length > 2 && setShowResults(true)}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[60] animate-fadeIn">
                    {results.map((item) => {
                        const title = getTitle(item);
                        const year = getReleaseYear(item);
                        const type = isMovie(item) ? 'movie' : 'tv';

                        return (
                            <Link
                                key={item.id}
                                href={`/${type}/${item.id}`}
                                onClick={() => {
                                    setShowResults(false);
                                    setQuery('');
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                            >
                                <div className="relative w-10 h-14 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                                    <Image
                                        src={getImageUrl(item.poster_path, 'w92')}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-white truncate">{title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span>{isMovie(item) ? 'Filme' : 'Série'}</span>
                                        {year && <span>• {year}</span>}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
