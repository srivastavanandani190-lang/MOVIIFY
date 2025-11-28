'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import placeholderImages from "@/lib/placeholder-images.json";

interface Review {
  movieId: string;
  movieTitle: string;
  rating: number;
  comment: string;
  user: string;
  date: string;
}

const dummyMovies = [
    { id: '550', title: 'Fight Club' },
    { id: '680', title: 'Pulp Fiction' },
    { id: '13', title: 'Forrest Gump' },
    { id: '278', title: 'The Shawshank Redemption' },
    { id: '238', title: 'The Godfather' },
];

export function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState<{ movieId: string; movieTitle: string; rating: number; comment: string; user: string }>({
        movieId: '',
        movieTitle: '',
        rating: 0,
        comment: '',
        user: 'GuestUser',
    });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const storedReviews = localStorage.getItem('moviifyReviews');
            if (storedReviews) {
                setReviews(JSON.parse(storedReviews));
            }
        } catch (error) {
            console.error("Failed to parse reviews from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('moviifyReviews', JSON.stringify(reviews));
        }
    }, [reviews, isMounted]);

    const handleRating = (rate: number) => {
        setNewReview({ ...newReview, rating: rate });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.movieId || !newReview.rating || !newReview.comment) {
            alert('Please select a movie, provide a rating, and write a comment.');
            return;
        }

        const review: Review = {
            ...newReview,
            date: new Date().toLocaleDateString(),
        };

        const updatedReviews = [review, ...reviews];
        setReviews(updatedReviews);

        setNewReview({ movieId: '', movieTitle: '', rating: 0, comment: '', user: 'GuestUser' });
    };
    
    if (!isMounted) {
        return null; 
    }

    const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "N/A";
    const reviewsBgImage = placeholderImages.placeholderImages.find(p => p.id === 'hero-background');

  return (
    <footer className="bg-card/50 border-t border-border/50 py-12 md:py-20">
      <div className="relative container mx-auto text-center rounded-lg overflow-hidden p-8 md:p-12 mb-12">
        {reviewsBgImage && (
             <Image
             src={reviewsBgImage.imageUrl}
             alt="Audience in a movie theater"
             fill
             className="object-cover opacity-20"
             data-ai-hint={reviewsBgImage.imageHint}
           />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50"></div>
        <div className="film-grain"></div>
        <div className="relative z-10">
          <h2 className="font-headline text-3xl font-bold text-primary mb-2">What MOVIIFY Users Say</h2>
          <p className="text-muted-foreground mb-6">Real reviews from real movie lovers.</p>
           <div className="text-center mb-6">
            <span className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
              <Star className="w-7 h-7 text-amber-400 fill-amber-400" /> 
              {averageRating} / 5
            </span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto">
        {reviews.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.slice(0, 3).map((review, i) => (
                <Card key={i} className="bg-secondary/50">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold truncate">{review.movieTitle}</h3>
                        <div className="flex">
                            {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`h-5 w-5 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/50'}`} />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-4 line-clamp-3">"{review.comment}"</p>
                    <small className="text-xs text-muted-foreground/80">@{review.user} on {review.date}</small>
                </CardContent>
                </Card>
            ))}
            </div>
        )}

        <Card className="bg-secondary/50 p-6 rounded-lg">
          <h3 className="text-xl mb-4 font-headline font-bold text-accent">Share Your Experience</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             <Select
                onValueChange={(value) => {
                    const selectedMovie = dummyMovies.find(m => m.id === value);
                    setNewReview({ ...newReview, movieId: value, movieTitle: selectedMovie?.title || '' });
                }}
                value={newReview.movieId}
             >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Movie" />
                </SelectTrigger>
                <SelectContent>
                    {dummyMovies.map(movie => (
                        <SelectItem key={movie.id} value={movie.id}>{movie.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(n => (
                  <button type="button" key={n} onClick={() => handleRating(n)}>
                    <Star className={`h-6 w-6 cursor-pointer transition-colors ${n <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/50 hover:text-amber-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <Textarea 
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={3}
            />
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Submit Review
            </Button>
          </form>
        </Card>
      </div>
    </footer>
  );
}
