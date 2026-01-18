export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-t-red-500 border-r-orange-500 border-b-red-500 border-l-orange-500 rounded-full animate-spin" />
                </div>
                <span className="text-white/60 text-sm">Carregando...</span>
            </div>
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] min-h-[400px] bg-gray-900 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative h-full flex items-end pb-12 sm:pb-16 lg:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl space-y-4">
                        <div className="h-6 w-24 bg-gray-800 rounded-full" />
                        <div className="h-12 w-3/4 bg-gray-800 rounded-lg" />
                        <div className="h-4 w-1/4 bg-gray-800 rounded" />
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-800 rounded" />
                            <div className="h-4 w-5/6 bg-gray-800 rounded" />
                            <div className="h-4 w-4/6 bg-gray-800 rounded" />
                        </div>
                        <div className="flex gap-4 pt-2">
                            <div className="h-12 w-40 bg-gray-800 rounded-lg" />
                            <div className="h-12 w-40 bg-gray-800 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function MediaRowSkeleton({ title }: { title?: string }) {
    return (
        <section className="py-4 sm:py-6 lg:py-8">
            {title ? (
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 px-4 sm:px-6 lg:px-8">
                    {title}
                </h2>
            ) : (
                <div className="h-7 w-48 bg-gray-800 rounded mb-4 mx-4 sm:mx-6 lg:mx-8" />
            )}
            <div className="flex gap-3 sm:gap-4 overflow-hidden px-4 sm:px-6 lg:px-8">
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </section>
    );
}
