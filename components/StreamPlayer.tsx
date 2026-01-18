'use client';

interface StreamPlayerProps {
    id: number;
    type: 'movie' | 'tv';
    season?: number;
    episode?: number;
}

export default function StreamPlayer({ id, type, season = 1, episode = 1 }: StreamPlayerProps) {
    // Construct the URL based on the instructions:
    // Movie: https://playerflixapi.com/filme/[id]
    // TV Series: https://playerflixapi.com/serie/[id]/[season]/[episode] (assumed format for TV)

    // The user mentioned: link correto "https://playerflixapi.com/filme/7451"
    // I will assume for TV it follows common patterns or https://playerflixapi.com/serie/[id]/[season]/[episode]

    const baseUrl = 'https://playerflixapi.com';
    const embedUrl = type === 'movie'
        ? `${baseUrl}/filme/${id}`
        : `${baseUrl}/serie/${id}/${season}/${episode}`;

    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                title={`${type === 'movie' ? 'Movie' : 'TV Series'} Player`}
            />
        </div>
    );
}
