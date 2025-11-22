"use client";

import { useState } from "react";
import { Review, reviews as initialReviews } from "@/data/reviews";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Star, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

interface ReviewSectionProps {
    bookSlug: string;
}

export function ReviewSection({ bookSlug }: ReviewSectionProps) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>(
        initialReviews.filter((r) => r.bookSlug === bookSlug)
    );
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newReview.trim()) return;

        const review: Review = {
            id: Math.random().toString(36).substr(2, 9),
            bookSlug,
            userName: user.name,
            rating,
            date: new Date().toISOString().split("T")[0],
            content: newReview,
        };

        setReviews([review, ...reviews]);
        setNewReview("");
        setRating(5);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>

            {/* Add Review Form */}
            <GlassPanel intensity="low" className="p-6">
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold">Write a Review</h3>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-6 w-6 ${star <= rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full min-h-[100px] p-3 rounded-md bg-white/50 dark:bg-black/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                            required
                        />
                        <Button type="submit">Post Review</Button>
                    </form>
                ) : (
                    <div className="text-center py-6 space-y-4">
                        <p className="text-muted-foreground">
                            Please login to write a review.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/login">Login to Review</Link>
                        </Button>
                    </div>
                )}
            </GlassPanel>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <GlassPanel key={review.id} intensity="low" className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{review.userName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {review.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground/30"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {review.content}
                            </p>
                        </GlassPanel>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center py-8">
                        No reviews yet. Be the first to review!
                    </p>
                )}
            </div>
        </div>
    );
}
