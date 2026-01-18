'use client';

import { useState } from 'react';
import StreamPlayer from './StreamPlayer';
import { useRouter } from 'next/navigation';

interface Season {
    season_number: number;
    episode_count: number;
    id: number;
}

interface SeriesSelectorProps {
    id: number;
    imdbId: string | null;
    seasons: Season[];
    initialSeason?: number;
    initialEpisode?: number;
    slug: string;
}

export default function SeriesSelector({ id, imdbId, seasons, initialSeason = 1, initialEpisode = 1, slug }: SeriesSelectorProps) {
    const router = useRouter();
    const [activeSeason, setActiveSeason] = useState(initialSeason);
    const [activeEpisode, setActiveEpisode] = useState(initialEpisode);

    const handleSeasonChange = (s: number) => {
        setActiveSeason(s);
        setActiveEpisode(1);
        router.push(`/assistir/${slug}?id=${id}&s=${s}&e=1`, { scroll: false });
    };

    const handleEpisodeChange = (e: number) => {
        setActiveEpisode(e);
        router.push(`/assistir/${slug}?id=${id}&s=${activeSeason}&e=${e}`, { scroll: false });
    };

    const currentSeason = seasons.find(s => s.season_number === activeSeason) || seasons[0];

    return (
        <div className="flex flex-col gap-6">
            {/* Player Container */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/5">
                <StreamPlayer
                    id={imdbId || id.toString()}
                    type="tv"
                    season={activeSeason}
                    episode={activeEpisode}
                />
            </div>

            {/* Selectors */}
            <div className="space-y-6 p-4 bg-[#141414] rounded-xl border border-white/5">
                {/* Seasons */}
                <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Temporadas</h4>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {seasons.filter(s => s.season_number > 0).map((season) => (
                            <button
                                key={season.id}
                                onClick={() => handleSeasonChange(season.season_number)}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeSeason === season.season_number
                                        ? 'bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-red-600/20'
                                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                Temp {season.season_number}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Episodes */}
                <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Episódios</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2">
                        {Array.from({ length: currentSeason.episode_count }, (_, i) => i + 1).map((ep) => (
                            <button
                                key={`${activeSeason}-${ep}`}
                                onClick={() => handleEpisodeChange(ep)}
                                className={`py-2 text-[10px] font-black rounded border transition-all ${activeEpisode === ep
                                        ? 'bg-[#E50914] border-[#E50914] text-white'
                                        : 'bg-black border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                    }`}
                            >
                                EP {ep}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
