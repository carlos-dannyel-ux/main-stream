'use client';

interface StreamPlayerProps {
    id: string | number | null; // IMDb ID for movies, TMDB ID for series
    type: 'movie' | 'tv';
    season?: number;
    episode?: number;
}

export default function StreamPlayer({ id, type, season = 1, episode = 1 }: StreamPlayerProps) {
    if (!id) {
        return (
            <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-white/5">
                <p className="text-gray-500">Player não disponível para este título.</p>
            </div>
        );
    }

    // According to SuperFlixAPI docs:
    // Movies use /filme/ttID_DO_FILME
    // Series use /serie/ID_DA_SERIE/TEMPORADA/EPISODIO (TMDB ID)
    const baseUrl = type === 'movie'
        ? `https://superflixapi.bond/filme/${id}`
        : `https://superflixapi.bond/serie/${id}/${season}/${episode}`;

    // Premium Branding Parameters
    const params = [
        '#color:E50914', // Netflix Red
        '#noLink',
        '#transparent',
        'logo=https://mainstream.com/logo/logo.png',
        'logo_link=https://mainstream.com',
        'lang=pt-BR'
    ].join('&');

    const embedUrl = `${baseUrl}${params}`;

    return (
        <div className="mainstream-player rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <iframe
                src={embedUrl}
                allowFullScreen
                scrolling="no"
            />

            <style jsx>{`
                .mainstream-player {
                    position: relative;
                    width: 100%;
                    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
                    background: #000;
                }

                .mainstream-player iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }
            `}</style>
        </div>
    );
}
