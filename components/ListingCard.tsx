'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ImageOff, Truck } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { formatPrice, resolveImage, timeAgo } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import { FavoriteButton } from './FavoriteButton';
import { Badge } from './ui/Misc';

export function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const t = useT();
  const photo = listing.photos?.[0] ? resolveImage(listing.photos[0]) : '';
  const city = listing.city;

  return (
    <Link
      href={`/listing/${listing._id}`}
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
      className="group flex animate-fade-up flex-col overflow-hidden rounded-xl border border-line bg-card shadow-card ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-amber/40 hover:shadow-hover hover:ring-amber/20 motion-reduce:animate-none motion-reduce:transform-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="img-skeleton flex h-full w-full items-center justify-center">
            <ImageOff size={32} className="text-muted/40" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-2 top-2">
          <FavoriteButton id={listing._id} initial={listing.isFavorite} className="h-8 w-8 shadow-card" />
        </div>
        <div className="absolute left-2 top-2 flex gap-1.5">
          <Badge tone="amber">{t.conditions[listing.condition] || listing.condition}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[15px] font-bold leading-snug text-ink line-clamp-2 transition-colors group-hover:text-navy-700">
          {listing.title}
        </p>

        <p className="mt-1.5 text-lg font-extrabold tracking-tight text-navy-800">
          {formatPrice(listing.price?.amount, listing.price?.currency)}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-2.5 text-xs text-muted">
          {city && (
            <span className="flex items-center gap-1 truncate">
              <MapPin size={13} />
              {city}
            </span>
          )}
          {listing.delivery && (
            <span className="flex items-center gap-1 text-success">
              <Truck size={13} />
            </span>
          )}
          <span className="ml-auto shrink-0">{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-card">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-2 p-3.5">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-5 w-1/2 rounded" />
      </div>
    </div>
  );
}
