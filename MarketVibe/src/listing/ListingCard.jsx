import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Key, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/lib/LanguageContext';

const currencySymbols = { USD:'$', EUR:'€', GBP:'£', NGN:'₦', TRY:'₺', AED:'د.إ', SAR:'﷼', GHS:'₵', ZAR:'R', CAD:'C$', AUD:'A$', BTC:'₿', ETH:'Ξ', USDT:'₮' };

export default function ListingCard({ listing }) {
  const { t } = useLanguage();
  const mainImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop';
  const currSymbol = currencySymbols[listing.currency] || '$';

  const rentalPeriodLabels = { hour: t('perHour'), day: t('perDay'), week: t('perWeek'), month: t('perMonth') };
  const conditionLabels = { new: t('condNew'), like_new: t('condLikeNew'), good: t('condGood'), fair: t('condFair'), poor: t('condPoor') };
  const categoryLabels = {
    electronics: t('catElectronics'), clothing: t('catClothing'), furniture: t('catFurniture'),
    vehicles: t('catVehicles'), sports: t('catSports'), books: t('catBooks'),
    home_garden: t('catHomeGarden'), toys: t('catToys'), collectibles: t('catCollectibles'), other: t('catOther'),
  };

  const handleShare = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/listing/${listing.id}`;
    if (navigator.share) {
      navigator.share({ title: listing.title, text: listing.description, url });
    } else {
      navigator.clipboard.writeText(url);
      alert(t('linkCopied'));
    }
  };

  return (
    <Link to={`/listing/${listing.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-card border border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={mainImage}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {(listing.status === 'sold' || listing.status === 'rented') && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <span className="text-background font-bold text-lg tracking-wider uppercase">
                {listing.status === 'rented' ? t('rented') : t('sold')}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 text-xs font-medium">
              {categoryLabels[listing.category] || listing.category}
            </Badge>
            {listing.listing_type === 'rental' && (
              <Badge className="bg-primary text-primary-foreground border-0 text-xs font-medium gap-1">
                <Key className="w-2.5 h-2.5" />
                {t('rent')}
              </Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            <span className="text-lg font-bold text-primary whitespace-nowrap">
              {currSymbol}{listing.price?.toLocaleString()}
              {listing.listing_type === 'rental' && listing.rental_period && (
                <span className="text-sm font-normal text-muted-foreground">
                  {rentalPeriodLabels[listing.rental_period]}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <div />
            <button onClick={handleShare} className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title={t('share')}>
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {listing.condition && (
              <span className="capitalize">{conditionLabels[listing.condition]}</span>
            )}
            {listing.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {listing.location}
              </span>
            )}
            {listing.created_date && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(listing.created_date), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}