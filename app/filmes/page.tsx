import { Suspense } from 'react';
import Hero from '@/components/Hero';
import MediaRow from '@/components/MediaRow';
import { HeroSkeleton, MediaRowSkeleton } from '@/components/Loading';
import { TMDBVideo } from '@/types/tmdb';
import {
    getTrendingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getNowPlayingMovies,
    getMovieVideos,
} from '@/lib/tmdb';

export const metadata = {
    title: 'Filmes | Main Stream',
    description: 'Descubra os melhores filmes em Main Stream. Filmes populares, em tendência e mais votados.',
};

export default async function FilmesPage() {
    // Fetch all movie data in parallel
    const [
        trendingMovies,
        popularMovies,
        topRatedMovies,
        upcomingMovies,
        nowPlayingMovies,
    ] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
        getNowPlayingMovies(),
    ]);

    // Get hero item (first trending movie)
    const heroItem = trendingMovies.results[0];

    // Fetch hero videos
    let heroVideos: { id: number; results: TMDBVideo[] } = { id: 0, results: [] };
    if (heroItem) {
        try {
            heroVideos = await getMovieVideos(heroItem.id);
        } catch {
            // Ignore video fetch errors
        }
    }

    return (
        <div className="pb-8">
            {/* Hero Section */}
            <Suspense fallback={<HeroSkeleton />}>
                {heroItem && (
                    <Hero item={heroItem} videos={heroVideos.results} />
                )}
            </Suspense>

            {/* Content Rows */}
            <div className="-mt-16 relative z-10 space-y-2">
                <Suspense fallback={<MediaRowSkeleton title="Filmes em Tendência" />}>
                    <MediaRow
                        title="🔥 Filmes em Tendência"
                        items={trendingMovies.results.slice(1, 20)}
                        showRank
                    />
                </Suspense>

                <Suspense fallback={<MediaRowSkeleton title="Populares" />}>
                    <MediaRow
                        title="🎬 Populares"
                        items={popularMovies.results}
                    />
                </Suspense>

                <Suspense fallback={<MediaRowSkeleton title="Em Cartaz" />}>
                    <MediaRow
                        title="🎥 Em Cartaz"
                        items={nowPlayingMovies.results}
                    />
                </Suspense>

                <Suspense fallback={<MediaRowSkeleton title="Em Breve" />}>
                    <MediaRow
                        title="🗓️ Em Breve"
                        items={upcomingMovies.results}
                    />
                </Suspense>

                <Suspense fallback={<MediaRowSkeleton title="Mais Votados" />}>
                    <MediaRow
                        title="⭐ Mais Votados"
                        items={topRatedMovies.results}
                    />
                </Suspense>
            </div>
        </div>
    );
}
