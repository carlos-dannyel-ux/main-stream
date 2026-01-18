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
        <div className="min-h-screen bg-[#0B0B0B] text-white">
            {/* JSON-LD Schema for Google Videos */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            {/* Cinema Header */}
            <div className="pt-24 pb-8 container-premium">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                </Link>
                <h1 className="text-2xl md:text-5xl font-black tracking-tighter mb-2">
                    {name}
                </h1>
                <div className="flex items-center gap-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <span>{type === 'movie' ? 'Filme' : `Temporada ${s} • Episódio ${e}`}</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                    <span className="text-[#E50914]">{item.vote_average.toFixed(1)} IMDb</span>
                </div>
            </div>

            {/* Cinema Player Area */}
            <div className="w-full bg-black border-y border-white/5 shadow-2xl">
                <div className="max-w-[1200px] mx-auto">
                    <div className="relative aspect-video bg-black group">
                        {type === 'movie' ? (
                            <Suspense fallback={<div className="w-full h-full skeleton" />}>
                                <StreamPlayer id={item.imdb_id} type="movie" />
                            </Suspense>
                        ) : (
                            <Suspense fallback={<div className="w-full h-full skeleton" />}>
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
                </div>
            </div>

            {/* Media Info & Server Selection */}
            <div className="container-premium py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">

                        {/* Server Buttons (Minimalist) */}
                        <section>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Escolha o Servidor</h3>
                            <div className="flex flex-wrap gap-3">
                                <button className="px-6 py-3 bg-[#E50914] text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-[#b90710] transition-colors flex items-center gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    Dublado (Principal)
                                </button>
                                <button className="px-6 py-3 bg-white/5 text-gray-400 text-xs font-black uppercase tracking-widest rounded-md hover:bg-white/10 hover:text-white transition-colors border border-white/5">
                                    Legendado
                                </button>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-black uppercase tracking-tight mb-4">Sinopse</h2>
                            <p className="text-gray-400 leading-relaxed text-lg max-w-3xl">
                                {item.overview || 'Sinopse não disponível em português.'}
                            </p>
                        </section>

                        {/* SEO Content */}
                        <section className="p-8 bg-[#141414] rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-4">Assistir {name} Online</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Assista <strong>{name}</strong> completo dublado online em alta definição. O Main Stream oferece a melhor experiência de cinema em casa, com carregamento rápido e sem interrupções. Desfrute do melhor do entretenimento mundial de forma totalmente gratuita e otimizada para todos os seus dispositivos.
                            </p>
                        </section>
                    </div>

                    <aside className="space-y-8">
                        <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 space-y-6">
                            <div>
                                <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Título Original</span>
                                <p className="text-sm font-bold text-gray-300">{type === 'movie' ? item.original_title : item.original_name}</p>
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Gêneros</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {item.genres?.map((g: any) => (
                                        <span key={g.id} className="text-[9px] px-2 py-1 bg-white/5 rounded text-gray-400 uppercase font-black border border-white/10">
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Ano de Lançamento</span>
                                <p className="text-sm font-bold text-gray-300">
                                    {type === 'movie'
                                        ? new Date(item.release_date).getFullYear()
                                        : new Date(item.first_air_date).getFullYear()}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
