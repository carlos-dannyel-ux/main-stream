import { Suspense } from 'react';
import { getSeriesDetails, getBackdropUrl } from '@/lib/tmdb';
import SeriesSelector from '@/components/SeriesSelector';
import Image from 'next/image';
import Link from 'next/link';

interface TVPageProps {
    params: Promise<{ id: string }>;
}

export default async function TVPage({ params }: TVPageProps) {
    const { id } = await params;
    const seriesId = parseInt(id);

    const series = await getSeriesDetails(seriesId);

    return (
        <div className="min-h-screen bg-black text-white pb-12">
            {/* Backdrop Header */}
            <div className="relative w-full h-[40vh] md:h-[60vh]">
                <Image
                    src={getBackdropUrl(series.backdrop_path)}
                    alt={series.name}
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar para o Início
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{series.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300">
                        <span className="px-2 py-0.5 bg-white/10 rounded border border-white/20">
                            {new Date(series.first_air_date).getFullYear()}
                        </span>
                        <span>{series.number_of_seasons} Temporadas</span>
                        <span>{series.number_of_episodes} Episódios</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-bold text-white">{series.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection and Player Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                <div className="mb-12">
                    <Suspense fallback={
                        <div className="w-full aspect-video bg-gray-900 animate-pulse rounded-xl flex items-center justify-center">
                            <span className="text-gray-500">Carregando Player...</span>
                        </div>
                    }>
                        <SeriesSelector id={seriesId} seasons={series.seasons} />
                    </Suspense>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">Sinopse</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {series.overview || 'Sinopse não disponível em português.'}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-2">
                            {series.genres?.map((genre: any) => (
                                <span
                                    key={genre.id}
                                    className="px-4 py-2 bg-white/5 rounded-full text-sm font-medium border border-white/10"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Título Original</h3>
                            <p className="text-white">{series.original_name}</p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Criadores</h3>
                            <p className="text-white">
                                {series.created_by?.map((c: any) => c.name).join(', ') || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Status</h3>
                            <p className="text-white">{series.status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
