'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { SlidersHorizontal, X, PackageSearch } from 'lucide-react';
import { api, type SearchParams } from '@/lib/api';
import { useT, useLocalize, type Dict } from '@/lib/i18n';
import type { Condition } from '@/lib/types';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import { Pagination } from '@/components/Pagination';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Misc';

const SORT_KEYS = ['relevance', 'newest', 'cheap', 'expensive'] as const;
const CONDITION_KEYS: Condition[] = ['new', 'used', 'contract', 'original', 'duplicate'];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-10" />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const t = useT();
  const [mobileFilters, setMobileFilters] = useState(false);

  const params: SearchParams = useMemo(
    () => ({
      q: sp.get('q') || undefined,
      categoryId: sp.get('categoryId') || undefined,
      partTypeId: sp.get('partTypeId') || undefined,
      brandId: sp.get('brandId') || undefined,
      modelId: sp.get('modelId') || undefined,
      condition: sp.get('condition') || undefined,
      city: sp.get('city') || undefined,
      minPrice: sp.get('minPrice') ? Number(sp.get('minPrice')) : undefined,
      maxPrice: sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined,
      sort: (sp.get('sort') as SearchParams['sort']) || undefined,
      page: sp.get('page') ? Number(sp.get('page')) : 1,
    }),
    [sp]
  );

  const setParam = useCallback(
    (patch: Record<string, string | number | undefined>, resetPage = true) => {
      const next = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === undefined || v === '' || v === null) next.delete(k);
        else next.set(k, String(v));
      });
      if (resetPage && !('page' in patch)) next.delete('page');
      router.push(`/search?${next.toString()}`);
    },
    [router, sp]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', params],
    queryFn: () => api.search({ ...params, limit: 24 }),
    placeholderData: keepPreviousData,
  });

  const activeCount = [
    params.categoryId,
    params.brandId,
    params.modelId,
    params.condition,
    params.city,
    params.minPrice,
    params.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="container-page py-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
            {params.q ? t.searchPage.resultsFor(params.q) : t.searchPage.allListings}
          </h1>
          {data && <p className="mt-0.5 text-sm text-muted">{t.searchPage.found(data.total)}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFilters(true)}
            className="flex h-10 items-center gap-1.5 rounded-md border border-line bg-card px-3 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal size={16} /> {t.searchPage.filter}
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber text-[11px] text-ink">
                {activeCount}
              </span>
            )}
          </button>
          <div className="w-40">
            <Select
              options={SORT_KEYS.map((k) => ({ value: k, label: t.sort[k] }))}
              value={params.sort || 'relevance'}
              onChange={(e) => setParam({ sort: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <Filters t={t} params={params} setParam={setParam} onReset={() => router.push('/search')} />
        </aside>

        <div className="min-w-0 flex-1">
          {isLoading ? (
            <Grid>{Array.from({ length: 12 }).map((_, i) => <ListingCardSkeleton key={i} />)}</Grid>
          ) : data && data.items.length > 0 ? (
            <>
              <div className={isFetching ? 'opacity-60 transition-opacity' : ''}>
                <Grid>
                  {data.items.map((l, i) => (
                    <ListingCard key={l._id} listing={l} index={i} />
                  ))}
                </Grid>
              </div>
              <div className="mt-8">
                <Pagination
                  page={data.page}
                  pages={data.pages}
                  onChange={(p) => {
                    setParam({ page: p }, false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </>
          ) : (
            <EmptyState
              icon={<PackageSearch size={56} strokeWidth={1.4} />}
              title={t.searchPage.notFoundTitle}
              text={t.searchPage.notFoundText}
              action={<Button variant="outline" onClick={() => router.push('/search')}>{t.searchPage.clearFilters}</Button>}
            />
          )}
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-bg p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{t.searchPage.filters}</h3>
              <button onClick={() => setMobileFilters(false)} className="text-muted hover:text-ink">
                <X size={22} />
              </button>
            </div>
            <Filters
              t={t}
              params={params}
              setParam={setParam}
              onReset={() => {
                router.push('/search');
                setMobileFilters(false);
              }}
            />
            <Button className="mt-5 w-full" onClick={() => setMobileFilters(false)}>
              {t.searchPage.showResults}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{children}</div>;
}

function Filters({
  t,
  params,
  setParam,
  onReset,
}: {
  t: Dict;
  params: SearchParams;
  setParam: (patch: Record<string, string | number | undefined>, resetPage?: boolean) => void;
  onReset: () => void;
}) {
  const lz = useLocalize();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: api.categories });
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: () => api.brands() });
  const { data: cities = [] } = useQuery({ queryKey: ['cities'], queryFn: api.cities });
  const { data: models = [] } = useQuery({
    queryKey: ['models', params.brandId],
    queryFn: () => api.brandModels(params.brandId!),
    enabled: !!params.brandId,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted">{t.searchPage.filters}</h3>
        <button onClick={onReset} className="text-xs font-semibold text-amber-600 hover:text-amber-700">
          {t.searchPage.reset}
        </button>
      </div>

      <Select
        label={t.searchPage.category}
        placeholder={t.common.all}
        value={params.categoryId || ''}
        onChange={(e) => setParam({ categoryId: e.target.value })}
        options={categories.map((c) => ({ value: c._id, label: lz(c.name) }))}
      />

      <Select
        label={t.searchPage.brand}
        placeholder={t.common.all}
        value={params.brandId || ''}
        onChange={(e) => setParam({ brandId: e.target.value, modelId: undefined })}
        options={brands.map((b) => ({ value: b._id, label: b.name }))}
      />

      {params.brandId && (
        <Select
          label={t.searchPage.model}
          placeholder={t.common.all}
          value={params.modelId || ''}
          onChange={(e) => setParam({ modelId: e.target.value })}
          options={models.map((m) => ({ value: m._id, label: m.name }))}
        />
      )}

      <Select
        label={t.searchPage.condition}
        placeholder={t.common.all}
        value={params.condition || ''}
        onChange={(e) => setParam({ condition: e.target.value })}
        options={CONDITION_KEYS.map((c) => ({ value: c, label: t.conditions[c] }))}
      />

      <Select
        label={t.common.city}
        placeholder={t.common.all}
        value={params.city || ''}
        onChange={(e) => setParam({ city: e.target.value })}
        options={cities.map((c) => ({ value: lz(c.name), label: lz(c.name) }))}
      />

      <div>
        <span className="mb-1.5 block text-sm font-medium text-muted">{t.searchPage.priceLabel}</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={t.searchPage.priceFrom}
            defaultValue={params.minPrice ?? ''}
            onBlur={(e) => setParam({ minPrice: e.target.value || undefined })}
            className="h-11 w-full rounded-md border border-line bg-card px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            placeholder={t.searchPage.priceTo}
            defaultValue={params.maxPrice ?? ''}
            onBlur={(e) => setParam({ maxPrice: e.target.value || undefined })}
            className="h-11 w-full rounded-md border border-line bg-card px-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
      </div>
    </div>
  );
}
