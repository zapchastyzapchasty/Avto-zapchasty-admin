'use client';

import Link from 'next/link';
import {
  Car, DoorOpen, Package, Lightbulb, AppWindow, Droplets, Wrench, Navigation, Disc, Cog,
  Zap, Fuel, Wind, CloudFog, Thermometer, Filter, Settings, GitMerge, Radio, Snowflake,
  Armchair, ShieldCheck, CircleDot, FlaskConical, Boxes, BatteryCharging, PlugZap, Fan,
  Scan, Speaker, Bolt, Sparkles, type LucideIcon,
} from 'lucide-react';
import type { PartCategory } from '@/lib/types';
import { useLocalize } from '@/lib/i18n';

// Har bir kategoriya slug'iga mos lucide ikonka
const CATEGORY_ICONS: Record<string, LucideIcon> = {
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
  diesel: Fuel,
  hybrid: BatteryCharging,
  'electric-vehicle': PlugZap,
  turbo: Fan,
  adas: Scan,
  audio: Speaker,
  fasteners: Bolt,
  tuning: Sparkles,
};

export function CategoryCard({ category, index = 0 }: { category: PartCategory; index?: number }) {
  const lz = useLocalize();
  const name = lz(category.name);
  const Icon = CATEGORY_ICONS[category.slug] || Wrench;

  return (
    <Link
      href={`/category/${category._id}?name=${encodeURIComponent(name)}`}
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className="group flex animate-fade-up flex-col items-center gap-2.5 rounded-xl border border-line bg-card p-4 text-center shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-amber/50 hover:shadow-hover motion-reduce:animate-none motion-reduce:transform-none"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 ring-1 ring-amber/10 transition-all duration-300 group-hover:scale-110 group-hover:from-amber-100 group-hover:to-amber-50 group-hover:text-amber-700 group-hover:ring-amber/30">
        <Icon size={24} strokeWidth={2} className="transition-transform duration-300 group-hover:-rotate-6" />
      </span>
      <span className="text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-navy-700">{name}</span>
    </Link>
  );
}
