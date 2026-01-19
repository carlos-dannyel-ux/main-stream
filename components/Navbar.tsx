'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Search from './Search';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/series', label: 'Séries' },
        { href: '/filmes', label: 'Filmes' },
        { href: '/bombando', label: 'Bombando' },
        { href: '/minha-lista', label: 'Minha Lista' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 h-[70px] flex items-center px-4 md:px-12 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'
                }`}
        >
            {/* Left: Logo & Desktop Links */}
            <div className="flex items-center flex-1">
                <Link href="/" className="mr-8 shrink-0">
                    <div className="relative w-28 h-8">
                        <Image
                            src="/logo/logo.png"
                            alt="Netflix"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                <div className="hidden lg:flex items-center space-x-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm transition-colors duration-300 hover:text-gray-300 ${isActive(link.href) ? 'font-bold text-white' : 'text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile "Navegar" Dropdown Placeholder */}
                <div className="lg:hidden text-white text-sm font-bold flex items-center gap-1 cursor-pointer">
                    Navegar
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                </div>
            </div>

            {/* Right: Search, Notifications, Profile */}
            <div className="flex items-center space-x-6 text-white text-sm">
                <div className="hidden sm:block">
                    <Search />
                </div>

                <button className="hidden sm:block hover:text-gray-300 transition-colors">
                    Infantil
                </button>

                <button className="relative p-1 hover:text-gray-300 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {/* Badge */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-[10px] rounded-full flex items-center justify-center border border-[#141414]">1</span>
                </button>

                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="relative w-8 h-8 rounded shrink-0 overflow-hidden bg-blue-500">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                </div>
            </div>

            {/* Mobile Top Tabs (Séries, Filmes, Categorias) - Visible on mobile only */}
            <div className={`lg:hidden fixed top-[70px] left-0 right-0 z-[90] flex items-center justify-center gap-8 py-2 transition-colors duration-500 ${isScrolled ? 'bg-[#141414]/90 backdrop-blur-md' : 'bg-transparent'}`}>
                <Link href="/series" className="text-white text-sm font-medium">Séries</Link>
                <Link href="/filmes" className="text-white text-sm font-medium">Filmes</Link>
                <div className="flex items-center gap-1 text-white text-sm font-medium cursor-pointer">
                    Categorias
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                </div>
            </div>

            {/* Mobile Bottom Navigation - Kept for UX convenience on mobile as per screenshot */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-white/5 px-6 py-2 pb-safe-area flex items-center justify-between">
                <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-white' : 'text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                    <span className="text-[10px]">Início</span>
                </Link>
                <Link href="/novidades" className="flex flex-col items-center gap-1 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <span className="text-[10px]">Novidades</span>
                </Link>
                <div className="flex flex-col items-center gap-1 text-gray-400">
                    <div className="relative w-6 h-6 rounded bg-blue-500 overflow-hidden">
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="" fill className="object-cover" />
                    </div>
                    <span className="text-[10px]">Minha Net</span>
                </div>
            </div>
        </nav>
    );
}

