import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const s = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star className={`${s} transition-colors ${(hovered || value) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'}`} />
        </button>
      ))}
    </div>
  );
}

export function RatingSummary({ sellerEmail }) {
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', sellerEmail],
    queryFn: () => base44.entities.Review.filter({ seller_email: sellerEmail }),
    enabled: !!sellerEmail,
  });
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <div className="flex items-center gap-2">
      <StarRating value={Math.round(avg)} size="sm" />
      <span className="text-sm font-semibold">{avg.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
    </div>
  );
}

export default function SellerReviews({ sellerEmail, sellerName, listingId, listingTitle }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', sellerEmail],
    queryFn: () => base44.entities.Review.filter({ seller_email: sellerEmail }, '-created_date', 50),
    enabled: !!sellerEmail,
  });

  const createReview = useMutation({
    mutationFn: () => base44.entities.Review.create({
      seller_email: sellerEmail,
      seller_name: sellerName,
      listing_id: listingId || '',
      listing_title: listingTitle || '',
      reviewer_name: user?.full_name || user?.email?.split('@')[0],
      reviewer_email: user?.email,
      rating,
      comment,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', sellerEmail] });
      setRating(0);
      setComment('');
      setShowForm(false);
    },
  });

  const canReview = user && user.email !== sellerEmail;
  const alreadyReviewed = reviews.some(r => r.reviewer_email === user?.email && r.listing_id === (listingId || ''));
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mt-6">
      {/* Summary header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold">Reviews & Ratings</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(avg)} size="sm" />
              <span className="text-sm font-semibold">{avg.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviews.length})</span>
            </div>
          )}
        </div>
        {canReview && !alreadyReviewed && !showForm && (
          <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={() => setShowForm(true)}>
            <Star className="w-3.5 h-3.5" /> Leave a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-card border border-border/50 rounded-2xl p-5 mb-5">
          <p className="font-medium mb-3">Your Review</p>
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-1.5">Rating *</p>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <Textarea
            placeholder="Share your experience with this seller..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="min-h-[90px] mb-3"
          />
          <div className="flex gap-2">
            <Button onClick={() => createReview.mutate()} disabled={!rating || createReview.isPending} className="rounded-full">
              {createReview.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-full">Cancel</Button>
          </div>
        </div>
      )}

      {alreadyReviewed && (
        <p className="text-sm text-muted-foreground mb-4 italic">You've already reviewed this seller for this listing.</p>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="space-y-3">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm bg-muted/30 rounded-xl">
          No reviews yet. Be the first to review this seller!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-card border border-border/50 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{r.reviewer_name || 'Anonymous'}</p>
                  {r.listing_title && <p className="text-xs text-muted-foreground">re: {r.listing_title}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} size="sm" />
                  {r.created_date && (
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.created_date), { addSuffix: true })}</span>
                  )}
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}