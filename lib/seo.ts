import { TMDBMovieDetails, TMDBSeriesDetails } from '@/types/tmdb';

interface VideoObject {
    '@context': string;
    '@type': string;
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    contentUrl: string;
    embedUrl: string;
    publisher: {
        '@type': string;
        name: string;
        logo: {
            '@type': string;
            url: string;
        };
    };
}

/**
 * Converts minutes to ISO 8601 Duration format (e.g., 102 min -> PT1H42M)
 */
export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `PT${hours}H${mins}M`;
}

/**
 * Generates Schema.org VideoObject JSON-LD
 */
export function generateVideoSchema(
    item: TMDBMovieDetails | TMDBSeriesDetails,
    type: 'movie' | 'tv',
    slug: string
): VideoObject {
    const isMovie = type === 'movie';
    const name = isMovie
        ? `${(item as TMDBMovieDetails).title} - Filme Completo Dublado`
        : `${(item as TMDBSeriesDetails).name} - Episódio Completo Dublado`;

    const description = `Assista ${isMovie ? (item as TMDBMovieDetails).title : (item as TMDBSeriesDetails).name} completo dublado online no Main Stream.`;

    const posterPath = item.poster_path;
    const thumbnailUrl = `https://mainstream.com/api/og?image=${posterPath}`; // Placeholder or direct TMDB URL

    const uploadDate = isMovie
        ? (item as TMDBMovieDetails).release_date
        : (item as TMDBSeriesDetails).first_air_date;

    const durationMinutes = isMovie
        ? (item as TMDBMovieDetails).runtime
        : 45; // Default for series episodes

    return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name,
        description,
        thumbnailUrl,
        uploadDate: uploadDate || '2024-01-01',
        duration: formatDuration(durationMinutes || 0),
        contentUrl: `https://mainstream.com/assistir/${slug}`,
        embedUrl: `https://superflixapi.bond/stape/${item.imdb_id}`,
        publisher: {
            '@type': 'Organization',
            name: 'Main Stream',
            logo: {
                '@type': 'ImageObject',
                url: 'https://mainstream.com/logo/logo.png'
            }
        }
    };
}

/**
 * Generates SEO Title for the page
 */
export function generateSEOTitle(name: string): string {
    return `Assistir ${name} Filme Completo Dublado | Main Stream`;
}

/**
 * Generates SEO Description for the page
 */
export function generateSEODescription(name: string): string {
    return `Assista ${name} filme completo dublado online em alta qualidade no Main Stream. O melhor site de streaming gratuito.`;
}
