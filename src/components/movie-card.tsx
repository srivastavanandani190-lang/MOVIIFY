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
      <Card className="overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            {poster && (
               <Image
                src={poster.imageUrl}
                alt={`Poster for ${movie.title}`}
                fill
                className="object-cover"
                data-ai-hint={poster.imageHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
          <div className="p-4">
            <h3 className="font-headline text-lg font-semibold truncate">{movie.title}</h3>
            <p className="text-sm text-muted-foreground">{movie.releaseYear}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
