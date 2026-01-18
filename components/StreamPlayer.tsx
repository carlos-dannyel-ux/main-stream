'use client';

interface StreamPlayerProps {
    imdbId: string | null;
    type: 'movie' | 'tv';
    season?: number;
    episode?: number;
}

export default function StreamPlayer({ imdbId, type, season = 1, episode = 1 }: StreamPlayerProps) {
    if (!imdbId) {
        return (
            <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-white/5">
                <p className="text-gray-500">Player não disponível para este título.</p>
            </div>
        );
    }

    const baseUrl = 'https://superflixapi.bond/stape/';
    const path = type === 'movie' ? imdbId : `${imdbId}/${season}/${episode}`;
    const branding = '?logo=https://mainstream.com/logo/logo.png&logo_link=https://mainstream.com&lang=pt-BR';
    const embedUrl = `${baseUrl}${path}${branding}`;

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
