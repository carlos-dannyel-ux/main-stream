'use client';

import { useState } from 'react';
import StreamPlayer from './StreamPlayer';

interface Episode {
    episode_number: number;
    name: string;
    overview: string;
}

interface Season {
    season_number: number;
    episode_count: number;
    name: string;
}

interface SeriesSelectorProps {
    id: number;
    seasons: Season[];
    initialSeason?: number;
    initialEpisode?: number;
}

export default function SeriesSelector({ id, seasons }: SeriesSelectorProps) {
    const [activeSeason, setActiveSeason] = useState(1);
    const [activeEpisode, setActiveEpisode] = useState(1);

    const currentSeason = seasons.find(s => s.season_number === activeSeason) || seasons[0];

    return (
        <div className="space-y-8">
            {/* Player */}
            <StreamPlayer
                id={id}
                type="tv"
                season={activeSeason}
                episode={activeEpisode}
            />

            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Seasons List */}
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold mb-4">Temporadas</h3>
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                        {seasons.filter(s => s.season_number > 0).map((season) => (
                            <button
                                key={season.season_number}
                                onClick={() => {
                                    setActiveSeason(season.season_number);
                                    setActiveEpisode(1);
                                }}
                                className={`text-left px-4 py-3 rounded-lg transition-all ${activeSeason === season.season_number
                                    ? 'bg-red-600 text-white font-bold'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                            >
                                <span className="block text-sm">Temporada {season.season_number}</span>
                                <span className="text-[10px] opacity-60">{season.episode_count} Episódios</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Episodes Grid */}
                <div className="md:col-span-3">
                    <h3 className="text-xl font-bold mb-4">Episódios</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Array.from({ length: currentSeason.episode_count }, (_, i) => i + 1).map((ep) => (
                            <button
                                key={ep}
                                onClick={() => setActiveEpisode(ep)}
                                className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ${activeEpisode === ep
                                    ? 'bg-red-600 border-red-500 text-white font-bold shadow-lg shadow-red-600/20'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}
                            >
                                <span className="text-lg">{ep}</span>
                                <span className="text-[10px] uppercase tracking-tighter opacity-60">Ep</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
