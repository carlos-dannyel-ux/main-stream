import { Suspense } from 'react';
import { getGenres } from '@/lib/tmdb';
import CatalogGrid from '@/components/CatalogGrid';

export const metadata = {
    title: 'Filmes | Main Stream',
    description: 'Descubra os melhores filmes em Main Stream. Assista online com qualidade premium.',
};

export default async function FilmesPage() {
    const genres = await getGenres('movie');

    return (
        <main className="min-h-screen pt-20">
            <Suspense fallback={
                <div className="container-premium py-12">
                    <div className="h-10 w-48 bg-white/5 animate-pulse rounded-lg mb-12" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-xl" />
                        ))}
                    </div>
                </div>
            }>
                <CatalogGrid
                    type="movie"
                    genres={genres}
                    title="Filmes"
                />
            </Suspense>
        </main>
    );
}
