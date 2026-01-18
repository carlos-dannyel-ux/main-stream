import { Suspense } from 'react';
import { getMovieDetails, getSeriesDetails, getBackdropUrl, searchByTitle, isMovie } from '@/lib/tmdb';
import { generateVideoSchema, generateSEOTitle, generateSEODescription } from '@/lib/seo';
import StreamPlayer from '@/components/StreamPlayer';
import SeriesSelector from '@/components/SeriesSelector';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface WatchPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ id?: string; s?: string; e?: string }>;
}

export async function generateMetadata({ params, searchParams }: WatchPageProps): Promise<Metadata> {
    const { slug } = await params;
    const { id } = await searchParams;

    const titleText = slug.replace(/-/g, ' ');
    let item;

    if (id) {
        try {
            item = await getMovieDetails(parseInt(id));
        } catch {
            item = await getSeriesDetails(parseInt(id));
        }
    } else {
        // Try movie first
        item = await searchByTitle(titleText, 'movie');
        if (!item) {
            item = await searchByTitle(titleText, 'tv');
        }
    }

    if (!item) return { title: 'Assistir Online | Main Stream' };

    const name = 'title' in item ? item.title : item.name;

    return {
        title: generateSEOTitle(name),
        description: generateSEODescription(name),
        openGraph: {
            title: generateSEOTitle(name),
            description: generateSEODescription(name),
            images: [getBackdropUrl(item.backdrop_path)],
        }
    };
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
    const { slug } = await params;
    const { id, s = '1', e = '1' } = await searchParams;

    let item: any;
    let type: 'movie' | 'tv' = 'movie';

    if (id) {
        try {
            item = await getMovieDetails(parseInt(id));
            type = 'movie';
        } catch {
            item = await getSeriesDetails(parseInt(id));
            type = 'tv';
        }
    } else {
        const titleText = slug.replace(/-/g, ' ');
        item = await searchByTitle(titleText, 'movie');
        if (item) {
            item = await getMovieDetails(item.id);
            type = 'movie';
        } else {
            item = await searchByTitle(titleText, 'tv');
            if (item) {
                item = await getSeriesDetails(item.id);
                type = 'tv';
            }
        }
    }

    if (!item) notFound();

    const name = type === 'movie' ? item.title : item.name;
    const schema = generateVideoSchema(item, type, slug);

    return (
        <div className="min-h-screen bg-black text-white pb-12">
            {/* JSON-LD Schema for Google Videos */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            {/* Backdrop Header */}
            <div className="relative w-full h-[40vh] md:h-[60vh]">
                <Image
                    src={getBackdropUrl(item.backdrop_path)}
                    alt={name}
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar ao Início
                    </Link>

                    <h1 className="text-3xl md:text-6xl font-bold mb-4">
                        Assistir {name} {type === 'movie' ? 'Filme' : 'Série'} Completo Dublado Online
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300">
                        <span className="px-2 py-0.5 bg-red-600/20 text-red-500 rounded border border-red-500/20 font-bold">
                            {type === 'movie' ? 'FILME' : 'SÉRIE'}
                        </span>
                        <span className="text-white font-medium">
                            {type === 'movie'
                                ? new Date(item.release_date).getFullYear()
                                : new Date(item.first_air_date).getFullYear()}
                        </span>
                        {type === 'movie' && <span>{item.runtime} min</span>}
                        <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-bold text-white">{item.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
                <div className="mb-12">
                    {type === 'movie' ? (
                        <Suspense fallback={<div className="w-full aspect-video bg-gray-900 animate-pulse rounded-xl" />}>
                            <StreamPlayer imdbId={item.imdb_id} type="movie" />
                        </Suspense>
                    ) : (
                        <Suspense fallback={<div className="w-full aspect-video bg-gray-900 animate-pulse rounded-xl" />}>
                            <SeriesSelector
                                id={item.id}
                                imdbId={item.imdb_id}
                                seasons={item.seasons}
                                initialSeason={parseInt(s)}
                                initialEpisode={parseInt(e)}
                                slug={slug}
                            />
                        </Suspense>
                    )}
                </div>

                {/* SEO Text Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Sobre o {type === 'movie' ? 'Filme' : 'Série'}</h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {item.overview || 'Sinopse não disponível em português.'}
                            </p>
                        </section>

                        <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4">Assistir {name} Online Gratis</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Está procurando onde assistir <strong>{name}</strong> completo dublado? No Main Stream você assiste com a melhor qualidade de imagem e som, sem anúncios intrusivos e totalmente grátis. Nossa plataforma é otimizada para dispositivos móveis, permitindo que você acompanhe seus conteúdos favoritos em qualquer lugar.
                            </p>
                            <p className="text-gray-400 leading-relaxed mt-4">
                                Lançado em {type === 'movie' ? new Date(item.release_date).getFullYear() : new Date(item.first_air_date).getFullYear()}, o {type === 'movie' ? 'filme' : 'título'} <strong>{name}</strong> rapidamente se tornou um dos mais buscados pelos fãs do gênero. Aproveite nossa biblioteca com milhares de títulos atualizados diariamente.
                            </p>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 text-center">Informações Técnicas</h4>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase">Título Original</span>
                                    <p className="text-sm font-medium">{type === 'movie' ? item.original_title : item.original_name}</p>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase">Gêneros</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {item.genres?.map((g: any) => (
                                            <span key={g.id} className="text-[10px] px-2 py-0.5 bg-white/10 rounded uppercase">
                                                {g.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase">Popularidade</span>
                                    <p className="text-sm font-medium">{item.popularity.toFixed(0)} pontos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
