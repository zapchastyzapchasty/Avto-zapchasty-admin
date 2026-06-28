'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Heart, MessageCircle, Plus, User as UserIcon, LogOut, Package, ChevronDown } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth, auth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

function Logo() {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Zapchasty — bosh sahifa">
      <Image
        src="/logo.png"
        alt="Zapchasty"
        width={160}
        height={150}
        priority
        className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12"
      />
    </Link>
  );
}

export function Header() {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    const rt = auth.getRefresh();
    if (rt) api.logout(rt).catch(() => {});
    auth.clear();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 shadow-header backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70">
      <div className="container-page">
        <div className="flex h-16 items-center gap-4">
          <Logo />

          <div className="hidden flex-1 md:block">
            <SearchBar />
          </div>

          <nav className="ml-auto flex items-center gap-1">
            <LanguageSwitcher className="mr-1" />

            <Link
              href="/favorites"
              className="hidden h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-ink sm:flex"
              title={t.header.favoritesTitle}
            >
              <Heart size={20} />
            </Link>
            {accessToken && (
              <Link
                href="/messages"
                className="hidden h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-ink sm:flex"
                title={t.header.messagesTitle}
              >
                <MessageCircle size={20} />
              </Link>
            )}

            <Link
              href="/sell"
              className="group flex h-10 items-center gap-1.5 rounded-md bg-amber px-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-hover active:scale-95"
            >
              <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline">{t.common.sell}</span>
            </Link>

            {accessToken && user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-10 items-center gap-1.5 rounded-md border border-line bg-card px-2.5 text-sm font-medium text-ink hover:bg-surface"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                    <UserIcon size={15} />
                  </span>
                  <span className="hidden max-w-[100px] truncate md:inline">{user.name || t.header.account}</span>
                  <ChevronDown size={15} className="text-muted" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-50 mt-1.5 w-52 origin-top-right animate-fade-down overflow-hidden rounded-md border border-line bg-card py-1 shadow-hover">
                      <MenuLink href="/profile" icon={<UserIcon size={16} />} onClick={() => setMenuOpen(false)}>
                        {t.common.profile}
                      </MenuLink>
                      <MenuLink href="/my-listings" icon={<Package size={16} />} onClick={() => setMenuOpen(false)}>
                        {t.common.myListings}
                      </MenuLink>
                      <MenuLink href="/favorites" icon={<Heart size={16} />} onClick={() => setMenuOpen(false)}>
                        {t.common.favorites}
                      </MenuLink>
                      <MenuLink href="/messages" icon={<MessageCircle size={16} />} onClick={() => setMenuOpen(false)}>
                        {t.common.messages}
                      </MenuLink>
                      <div className="my-1 border-t border-line" />
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-danger hover:bg-surface"
                      >
                        <LogOut size={16} />
                        {t.common.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex h-10 items-center rounded-md border border-line bg-card px-4 text-sm font-semibold text-ink hover:bg-surface"
              >
                {t.common.login}
              </Link>
            )}
          </nav>
        </div>

        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('flex items-center gap-2.5 px-4 py-2 text-sm text-ink hover:bg-surface')}
    >
      <span className="text-muted">{icon}</span>
      {children}
    </Link>
  );
}
