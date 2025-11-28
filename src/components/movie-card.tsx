
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { TMDBItem } from '@/types';

interface MovieCardProps {
  movie: TMDBItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.svg';
  
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  
  const link = `/${movie.media_type === 'tv' ? 'tv' : 'movies'}/${movie.id}`;

  return (
    <Link href={link}>
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border-border bg-secondary">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={posterUrl}
              alt={`Poster for ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
            />
          </div>
          <div className="p-3">
            <h3 className="font-headline text-md font-semibold truncate text-foreground">{title}</h3>
            {releaseYear && <p className="text-sm text-muted-foreground">{releaseYear}</p>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
