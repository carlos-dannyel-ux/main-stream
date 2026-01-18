'use client';

import { useRef, useState } from 'react';
import { MediaItem } from '@/types/tmdb';
import MediaCard from './MediaCard';

interface MediaRowProps {
    title: string;
    items: MediaItem[];
    showRank?: boolean;
}

export default function MediaRow({ title, items, showRank = false }: MediaRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction: 'left' | 'right') => {
        if (!rowRef.current) return;

        const scrollAmount = rowRef.current.clientWidth * 0.8;
        const newScrollLeft = direction === 'left'
            ? rowRef.current.scrollLeft - scrollAmount
            : rowRef.current.scrollLeft + scrollAmount;

        rowRef.current.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth',
        });
    };

    const handleScroll = () => {
        if (!rowRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    if (!items || items.length === 0) return null;

    return (
        <section className="relative py-2 sm:py-6 lg:py-8 overflow-hidden">
            {/* Title */}
            <h2 className="text-section-title font-black uppercase tracking-tighter text-white px-4 sm:px-6 lg:px-8">
                {title}
            </h2>

            {/* Row Container */}
            <div className="relative group">
                {/* Left Arrow - Hidden on Mobile */}
                <button
                    onClick={() => scroll('left')}
                    className={`hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-12 lg:w-16 bg-gradient-to-r from-black/80 to-transparent items-center justify-center transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    aria-label="Scroll left"
                >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Scrollable Row */}
                <div
                    ref={rowRef}
                    onScroll={handleScroll}
                    className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 touch-scroll"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, index) => (
                        <MediaCard
                            key={item.id}
                            item={item}
                            rank={showRank ? index + 1 : undefined}
                        />
                    ))}
                </div>

                {/* Right Arrow - Hidden on Mobile */}
                <button
                    onClick={() => scroll('right')}
                    className={`hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-12 lg:w-16 bg-gradient-to-l from-black/80 to-transparent items-center justify-center transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    aria-label="Scroll right"
                >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
}
