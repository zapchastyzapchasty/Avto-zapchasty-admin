'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Car, DoorOpen, Package, Lightbulb, AppWindow, Droplets, Wrench, Navigation, Disc, Cog,
  Zap, Fuel, Wind, CloudFog, Thermometer, Filter, Settings, GitMerge, Snowflake,
  Armchair, ShieldCheck, CircleDot, FlaskConical, Boxes, BatteryCharging, PlugZap, Fan,
  Radio, Scan, Speaker, Bolt, Sparkles, ChevronRight, ArrowLeft, type LucideIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useLocalize } from '@/lib/i18n';
import type { PartCategory, PartType } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  podkapot: Cog,
  body: Car,
  doors: DoorOpen,
  trunk: Package,
  lights: Lightbulb,
  'glass-mirrors': AppWindow,
  wipers: Droplets,
  suspension: Wrench,
  steering: Navigation,
  brakes: Disc,
  engine: Cog,
  ignition: Zap,
  'fuel-system': Fuel,
  intake: Wind,
  exhaust: CloudFog,
  cooling: Thermometer,
  filters: Filter,
  transmission: Settings,
  drivetrain: GitMerge,
  electrical: Zap,
  sensors: Radio,
  climate: Snowflake,
  interior: Armchair,
  safety: ShieldCheck,
  'wheels-tires': CircleDot,
  'oils-fluids': FlaskConical,
  consumables: Boxes,
  hybrid: BatteryCharging,
  'electric-vehicle': PlugZap,
  turbo: Fan,
  adas: Scan,
  audio: Speaker,
  fasteners: Bolt,
  tuning: Sparkles,
};

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="container-page py-8" />}>
      <CategoryContent />
    </Suspense>
  );
}

function CategoryContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const level = sp.get('level') === '2' ? 2 : 1;
  const name = sp.get('name') || 'Kategoriya';
  const parentName = sp.get('parentName') || '';
  const parentId = sp.get('parentId') || '';
  const lz = useLocalize();

  const { data: subs, isLoading: subsLoading } = useQuery({
    queryKey: ['subcategories', id],
    queryFn: () => api.subcategories(id),
    enabled: level === 1,
  });

  const { data: partTypes, isLoading: ptLoading } = useQuery({
    queryKey: ['part-types', id],
    queryFn: () => api.categoryPartTypes(id),
    enabled: level === 2,
  });

  const isLoading = level === 1 ? subsLoading : ptLoading;

  const backHref =
    level === 2 && parentId
      ? `/category/${parentId}?name=${encodeURIComponent(parentName)}`
      : '/';

  return (
    <div className="container-page py-8">
      {/* Breadcrumb / back */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted">
        <button
          onClick={() => router.push(backHref)}
          className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} />
          {level === 2 ? (parentName || 'Orqaga') : 'Bosh sahifa'}
        </button>
        <ChevronRight size={13} className="opacity-40" />
        <span className="font-semibold text-ink truncate">{name}</span>
      </div>

      <h1 className="mb-6 text-xl font-extrabold tracking-tight text-navy-800">{name}</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : level === 1 ? (
        /* ── Level 1 → show Level 2 subcategories ── */
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(subs ?? []).length === 0 ? (
            <p className="col-span-2 py-12 text-center text-sm text-muted">
              Bu kategoriyada pastki bo'limlar yo'q
            </p>
          ) : (
            (subs ?? []).map((sub: PartCategory) => {
              const Icon = ICONS[sub.slug] || Wrench;
              const subName = lz(sub.name);
              return (
                <Link
                  key={sub._id}
                  href={`/category/${sub._id}?level=2&name=${encodeURIComponent(subName)}&parentName=${encodeURIComponent(name)}&parentId=${id}`}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-card p-4 transition-all hover:border-amber/50 hover:shadow-hover"
                >
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-all group-hover:bg-amber-100 group-hover:text-amber-700">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink">{subName}</span>
                  <ChevronRight
                    size={16}
                    className="text-muted transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              );
            })
          )}
        </div>
      ) : (
        /* ── Level 2 → show PartTypes ── */
        <div className="overflow-hidden rounded-xl border border-line bg-card">
          {(partTypes ?? []).length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">
              Bu bo'limda detal turlari yo'q
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {(partTypes ?? []).map((pt: PartType) => (
                <li key={pt._id}>
                  <Link
                    href={`/search?partTypeId=${pt._id}`}
                    className="group flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-amber-50/60"
                  >
                    <span className="text-sm font-medium text-ink">{pt.name}</span>
                    <ChevronRight
                      size={14}
                      className="text-muted transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
