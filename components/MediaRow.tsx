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
        <section className="relative group/row pt-4 md:pt-8 bg-[#141414]">
            {/* Title */}
            <h2 className="text-lg md:text-2xl font-bold text-[#e5e5e5] px-4 md:px-12 mb-2 md:mb-4 transition-colors hover:text-white cursor-pointer inline-flex items-center gap-2">
                {title}
                <span className="text-[10px] md:text-xs text-[#54b9c5] font-bold opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center">
                    Explorar todos
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
                </span>
            </h2>

            {/* Row Container */}
            <div className="relative group">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className={`absolute left-0 top-0 bottom-4 z-[40] w-4 md:w-12 bg-black/50 items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${!showLeftArrow && 'pointer-events-none'}`}
                    aria-label="Scroll left"
                >
                    <svg className="w-8 h-8 text-white scale-75 md:scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Scrollable Row */}
                <div
                    ref={rowRef}
                    onScroll={handleScroll}
                    className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-4 touch-scroll"
                >
                    {items.map((item, index) => (
                        <MediaCard
                            key={item.id}
                            item={item}
                            rank={showRank ? index + 1 : undefined}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className={`absolute right-0 top-0 bottom-4 z-[40] w-4 md:w-12 bg-black/50 items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${!showRightArrow && 'pointer-events-none'}`}
                    aria-label="Scroll right"
                >
                    <svg className="w-8 h-8 text-white scale-75 md:scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
}

