import Image from 'next/image';
import Link from 'next/link';

import type { Movie } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import placeholderImages from '@/lib/placeholder-images.json';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const poster = placeholderImages.placeholderImages.find(p => p.id === movie.posterId);

  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border-border bg-secondary">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            {poster && (
               <Image
                src={poster.imageUrl}
                alt={`Poster for ${movie.title}`}
                fill
                className="object-cover"
                data-ai-hint={poster.imageHint}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
              />
            )}
          </div>
          <div className="p-3">
            <h3 className="font-headline text-md font-semibold truncate text-foreground">{movie.title}</h3>
            <p className="text-sm text-muted-foreground">{movie.releaseYear}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
