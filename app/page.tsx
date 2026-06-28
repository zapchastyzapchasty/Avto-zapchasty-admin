'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, Truck, Search as SearchIcon, Tag, PackageOpen } from 'lucide-react';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { CategoryCard } from '@/components/CategoryCard';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';


export default function HomePage() {
  const t = useT();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: api.categories });
  const { data: brands = [] } = useQuery({ queryKey: ['brands', 'popular'], queryFn: () => api.brands(true) });
  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-listings'],
    queryFn: () => api.search({ sort: 'newest', limit: 10 }),
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-navy-800 text-white">
        {/* Premium fon — navy gradient + nozik to'r + suzuvchi yorug'lik */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900" />
          <div className="absolute inset-0 bg-hero-grid bg-[length:40px_40px] opacity-[0.18]" />
          <div className="absolute -left-24 -top-24 h-80 w-80 animate-float rounded-full bg-amber-500/20 blur-3xl" />
          <div
            className="absolute -right-16 top-8 h-96 w-96 animate-float rounded-full bg-navy-500/40 blur-3xl"
            style={{ animationDelay: '1.5s' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-900/60 to-transparent" />
        </div>

        <div className="container-page relative py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex animate-fade-up items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur">
              <Tag size={13} /> {t.home.badge}
            </span>
            <h1
              className="mt-5 animate-fade-up text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              {t.home.heroTitle1}{' '}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {t.home.heroTitle2}
              </span>
            </h1>
            <p
              className="mx-auto mt-5 max-w-xl animate-fade-up text-base text-navy-100/90 sm:text-lg"
              style={{ animationDelay: '160ms' }}
            >
              {t.home.heroSubtitle}
            </p>
            <div
              className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                href="/search"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-amber px-7 text-base font-semibold text-ink shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-hover active:scale-95 sm:w-auto"
              >
                <PackageOpen size={19} />
                {t.home.ctaBrowse}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:scale-95 sm:w-auto"
              >
                {t.home.ctaSell}
              </Link>
            </div>
          </div>

          {/* Afzalliklar */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: <SearchIcon size={18} />, title: t.home.feat1Title, text: t.home.feat1Text },
              { icon: <ShieldCheck size={18} />, title: t.home.feat2Title, text: t.home.feat2Text },
              { icon: <Truck size={18} />, title: t.home.feat3Title, text: t.home.feat3Text },
            ].map((f, i) => (
              <div
                key={i}
                className="animate-fade-up"
                style={{ animationDelay: `${320 + i * 80}ms` }}
              >
                <Feature icon={f.icon} title={f.title} text={f.text} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATEGORIYALAR */}
      <section id="categories" className="container-page py-12">
        <SectionHead title={t.home.categories} href="/search" linkLabel={t.home.viewAll} />
        {categories.length === 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="img-skeleton h-28 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {categories.map((c, i) => (
              <CategoryCard key={c._id} category={c} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* MASHHUR BRENDLAR */}
      {brands.length > 0 && (
        <section className="container-page pb-4">
          <SectionHead title={t.home.popularBrands} />
          <div className="flex flex-wrap gap-2.5">
            {brands.slice(0, 18).map((b) => (
              <Link
                key={b._id}
                href={`/search?brandId=${b._id}`}
                className="rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:bg-amber-50 hover:shadow-card"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* YANGI E'LONLAR */}
      <section className="container-page py-12">
        <SectionHead title={t.home.newListings} href="/search?sort=newest" linkLabel={t.home.viewAll} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {recentLoading
            ? Array.from({ length: 10 }).map((_, i) => <ListingCardSkeleton key={i} />)
            : recent?.items.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
        </div>
        {!recentLoading && (!recent || recent.items.length === 0) && (
          <p className="py-12 text-center text-muted">{t.home.noListings}</p>
        )}
      </section>
    </>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-amber/40 hover:bg-white/10">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber-300 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-navy-100/80">{text}</p>
      </div>
    </div>
  );
}

function SectionHead({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
