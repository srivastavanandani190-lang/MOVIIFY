import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Film, Languages, Mic, Star, Tv, User, Video } from 'lucide-react';

import { getMovieById, movies } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export async function generateStaticParams() {
  return movies.map((movie) => ({
    id: movie.id,
  }));
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = getMovieById(params.id);

  if (!movie) {
    notFound();
  }

  const poster = placeholderImages.placeholderImages.find(p => p.id === movie.posterId);

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1">
          <Card className="overflow-hidden sticky top-24">
            <div className="relative aspect-[2/3] w-full">
              {poster && (
                <Image
                  src={poster.imageUrl}
                  alt={`Poster for ${movie.title}`}
                  fill
                  className="object-cover"
                  data-ai-hint={poster.imageHint}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
              )}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="font-headline text-4xl font-bold">{movie.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {movie.releaseYear}</span>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                {movie.genres.map((genre) => (
                  <Badge key={genre} variant="outline">{genre}</Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-lg leading-relaxed">{movie.summary}</p>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Director</h3>
              <p>{movie.director}</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-primary" /> Cast</h3>
              <p>{movie.cast.join(', ')}</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Languages className="h-5 w-5 text-primary" /> Languages</h3>
              <p>{movie.languages.join(', ')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Tv className="h-5 w-5 text-primary" /> Where to Watch</h3>
            <div className="flex flex-wrap gap-4">
              {movie.platforms.map((platform) => (
                <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md border bg-secondary/50 hover:bg-secondary transition-colors">
                  <span>{platform.name}</span>
                  <Badge variant={platform.type === 'paid' ? 'default' : 'secondary'} className={platform.type === 'paid' ? 'bg-accent text-accent-foreground' : ''}>{platform.type}</Badge>
                </a>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold">Comments & Reviews</h3>
            {/* New Comment Form */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=guest" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="w-full space-y-2">
                    <Textarea placeholder="Share your review..." />
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Post Comment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Comments */}
            <div className="space-y-6">
              {movie.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={comment.avatarUrl} alt={comment.author} />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
               {movie.comments.length === 0 && (
                <p className="text-muted-foreground text-center py-4">Be the first to leave a review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
