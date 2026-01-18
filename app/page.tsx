import { Suspense } from 'react';
import Hero from '@/components/Hero';
import MediaRow from '@/components/MediaRow';
import { HeroSkeleton, MediaRowSkeleton } from '@/components/Loading';
import { TMDBVideo } from '@/types/tmdb';
import {
  getTrendingAll,
  getTrendingMovies,
  getTrendingSeries,
  getPopularMovies,
  getPopularSeries,
  getTopRatedMovies,
  getTopRatedSeries,
  getMovieVideos,
  getSeriesVideos,
} from '@/lib/tmdb';

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    trendingAll,
    trendingMovies,
    trendingSeries,
    popularMovies,
    popularSeries,
    topRatedMovies,
    topRatedSeries,
  ] = await Promise.all([
    getTrendingAll(),
    getTrendingMovies(),
    getTrendingSeries(),
    getPopularMovies(),
    getPopularSeries(),
    getTopRatedMovies(),
    getTopRatedSeries(),
  ]);

  // Get hero item (first trending item)
  const heroItem = trendingAll.results[0];
  const heroType = heroItem && 'title' in heroItem ? 'movie' : 'tv';

  // Fetch hero videos
  let heroVideos: { id: number; results: TMDBVideo[] } = { id: 0, results: [] };
  if (heroItem) {
    try {
      heroVideos = heroType === 'movie'
        ? await getMovieVideos(heroItem.id)
        : await getSeriesVideos(heroItem.id);
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
        <Suspense fallback={<MediaRowSkeleton title="Em Alta" />}>
          <MediaRow
            title="🔥 Em Alta"
            items={trendingAll.results.slice(1, 20)}
            showRank
          />
        </Suspense>

        <Suspense fallback={<MediaRowSkeleton title="Filmes Populares" />}>
          <MediaRow
            title="🎬 Filmes Populares"
            items={popularMovies.results}
          />
        </Suspense>

        <Suspense fallback={<MediaRowSkeleton title="Séries Populares" />}>
          <MediaRow
            title="📺 Séries Populares"
            items={popularSeries.results}
          />
        </Suspense>

        <Suspense fallback={<MediaRowSkeleton title="Filmes em Tendência" />}>
          <MediaRow
            title="🎥 Filmes em Tendência"
            items={trendingMovies.results}
          />
        </Suspense>

        <Suspense fallback={<MediaRowSkeleton title="Séries em Tendência" />}>
          <MediaRow
            title="📡 Séries em Tendência"
            items={trendingSeries.results}
          />
        </Suspense>

        <Suspense fallback={<MediaRowSkeleton title="Filmes Mais Votados" />}>
          <MediaRow
            title="⭐ Filmes Mais Votados"
            items={topRatedMovies.results}
          />
        </Suspense>

        <Suspense fallback={<MediaRowSkeleton title="Séries Mais Votadas" />}>
          <MediaRow
            title="🏆 Séries Mais Votadas"
            items={topRatedSeries.results}
          />
        </Suspense>
      </div>
    </div>
  );
}
