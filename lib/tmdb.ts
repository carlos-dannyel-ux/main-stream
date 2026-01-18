// TMDB API Service
import {
    TMDBMovie,
    TMDBSeries,
    TMDBResponse,
    TMDBVideoResponse,
    TMDBMovieDetails,
    TMDBSeriesDetails,
    MediaItem
} from '@/types/tmdb';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const TMDB_API_BASE = 'https://api.themoviedb.org/3';

// Image URL helpers
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-poster.svg';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: string = 'original'): string => {
    if (!path) return '/placeholder-backdrop.svg';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

// Get API key from environment (server-side only)
function getApiKey(): string {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        throw new Error('TMDB_API_KEY environment variable is not set');
    }
    return apiKey;
}

// Direct TMDB fetch (for server-side rendering)
async function fetchTMDBDirect<T>(endpoint: string): Promise<T> {
    const apiKey = getApiKey();
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${TMDB_API_BASE}${endpoint}${separator}api_key=${apiKey}`;

    const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status}`);
    }

    return response.json();
}

// Movies
export async function getTrendingMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return fetchTMDBDirect('/trending/movie/week?language=pt-BR');
}

export async function getPopularMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return fetchTMDBDirect('/movie/popular?language=pt-BR');
}

export async function getTopRatedMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return fetchTMDBDirect('/movie/top_rated?language=pt-BR');
}

export async function getUpcomingMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return fetchTMDBDirect('/movie/upcoming?language=pt-BR');
}

export async function getNowPlayingMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return fetchTMDBDirect('/movie/now_playing?language=pt-BR');
}

export async function getMovieDetails(id: number): Promise<TMDBMovieDetails> {
    const movie = await fetchTMDBDirect<TMDBMovieDetails>(`/movie/${id}?language=pt-BR`);
    const externalIds = await fetchTMDBDirect<{ imdb_id: string }>(`/movie/${id}/external_ids`);
    return { ...movie, imdb_id: externalIds.imdb_id || movie.imdb_id };
}

export async function getMovieVideos(id: number): Promise<TMDBVideoResponse> {
    return fetchTMDBDirect(`/movie/${id}/videos?language=pt-BR`);
}

// Series/TV Shows
export async function getTrendingSeries(): Promise<TMDBResponse<TMDBSeries>> {
    return fetchTMDBDirect('/trending/tv/week?language=pt-BR');
}

export async function getPopularSeries(): Promise<TMDBResponse<TMDBSeries>> {
    return fetchTMDBDirect('/tv/popular?language=pt-BR');
}

export async function getTopRatedSeries(): Promise<TMDBResponse<TMDBSeries>> {
    return fetchTMDBDirect('/tv/top_rated?language=pt-BR');
}

export async function getOnTheAirSeries(): Promise<TMDBResponse<TMDBSeries>> {
    return fetchTMDBDirect('/tv/on_the_air?language=pt-BR');
}

export async function getAiringSeries(): Promise<TMDBResponse<TMDBSeries>> {
    return fetchTMDBDirect('/tv/airing_today?language=pt-BR');
}

export async function getSeriesDetails(id: number): Promise<TMDBSeriesDetails> {
    const series = await fetchTMDBDirect<TMDBSeriesDetails>(`/tv/${id}?language=pt-BR`);
    const externalIds = await fetchTMDBDirect<{ imdb_id: string }>(`/tv/${id}/external_ids`);
    return { ...series, imdb_id: externalIds.imdb_id };
}

export async function getSeriesVideos(id: number): Promise<TMDBVideoResponse> {
    return fetchTMDBDirect(`/tv/${id}/videos?language=pt-BR`);
}

// Mixed/Trending
export async function getTrendingAll(): Promise<TMDBResponse<MediaItem>> {
    return fetchTMDBDirect('/trending/all/week?language=pt-BR');
}

// Search
export async function searchMulti(query: string, page: number = 1): Promise<TMDBResponse<MediaItem>> {
    return fetchTMDBDirect(`/search/multi?query=${encodeURIComponent(query)}&page=${page}&language=pt-BR&include_adult=false`);
}

// Get trailer from videos
export function getTrailerKey(videos: TMDBVideoResponse): string | null {
    const trailer = videos.results.find(
        (video) =>
            video.site === 'YouTube' &&
            (video.type === 'Trailer' || video.type === 'Teaser')
    );
    return trailer?.key || null;
}

// Check if item is movie
export function isMovie(item: MediaItem): item is TMDBMovie & { media_type?: 'movie' } {
    return 'title' in item || item.media_type === 'movie';
}

// Get title (works for both movie and series)
export function getTitle(item: MediaItem): string {
    if (isMovie(item)) {
        return (item as TMDBMovie).title;
    }
    return (item as TMDBSeries).name;
}

// Get release year
export function getReleaseYear(item: MediaItem): string {
    const date = isMovie(item)
        ? (item as TMDBMovie).release_date
        : (item as TMDBSeries).first_air_date;
    return date ? new Date(date).getFullYear().toString() : '';
}

// Slugify helper
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

// Search by title for specific items (used for slug-only routing)
export async function searchByTitle(title: string, type: 'movie' | 'tv'): Promise<MediaItem | null> {
    const response = await fetchTMDBDirect<TMDBResponse<MediaItem>>(`/search/${type}?query=${encodeURIComponent(title)}&language=pt-BR`);
    return response.results.length > 0 ? response.results[0] : null;
}
