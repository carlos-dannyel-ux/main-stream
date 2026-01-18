import { Suspense } from 'react';
import Hero from '@/components/Hero';
import MediaRow from '@/components/MediaRow';
import { HeroSkeleton, MediaRowSkeleton } from '@/components/Loading';
import { TMDBVideo } from '@/types/tmdb';
import {
    getTrendingSeries,
    getPopularSeries,
    getTopRatedSeries,
    getOnTheAirSeries,
    getAiringSeries,
    getSeriesVideos,
} from '@/lib/tmdb';

export const metadata = {
    title: 'Séries | Main Stream',
    description: 'Descubra as melhores séries em Main Stream. Séries populares, em tendência e mais votadas.',
};

export default async function SeriesPage() {
    // Fetch all series data in parallel
    const [
        trendingSeries,
        popularSeries,
        topRatedSeries,
        onTheAirSeries,
        airingSeries,
    ] = await Promise.all([
        getTrendingSeries(),
        getPopularSeries(),
        getTopRatedSeries(),
        getOnTheAirSeries(),
        getAiringSeries(),
    ]);

    // Get hero item (first trending series)
    const heroItem = trendingSeries.results[0];

    // Fetch hero videos
    let heroVideos: { id: number; results: TMDBVideo[] } = { id: 0, results: [] };
    if (heroItem) {
        try {
            heroVideos = await getSeriesVideos(heroItem.id);
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
                <Suspense fallback={<MediaRowSkeleton title="Séries em Tendência" />}>
                    <MediaRow
                        title="🔥 Séries em Tendência"
                        items={trendingSeries.results.slice(1, 20)}
                        showRank
                    />
                </Suspense>

                <Suspense fallback={<MediaRowSkeleton title="Populares" />}>
                    <MediaRow
                        title="📺 Populares"
                        items={popularSeries.results}
                    />
                </Suspense>

                <Suspense fallback={<MediaRowSkeleton title="No Ar" />}>
                    <MediaRow
                        title="📡 No Ar"
                        items={onTheAirSeries.results}
                    />
                </Suspense>

                <Suspense fallback={<MediaRowSkeleton title="Exibindo Hoje" />}>
                    <MediaRow
                        title="🗓️ Exibindo Hoje"
                        items={airingSeries.results}
                    />
                </Suspense>

                <Suspense fallback={<MediaRowSkeleton title="Mais Votadas" />}>
                    <MediaRow
                        title="⭐ Mais Votadas"
                        items={topRatedSeries.results}
                    />
                </Suspense>
            </div>
        </div>
    );
}
