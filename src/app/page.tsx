
import Image from 'next/image';
import { Film, PlayCircle, Search } from 'lucide-react';

import { MovieCard } from '@/components/movie-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PersonalizedRecommendations } from '@/components/ai/personalized-recommendations';
import { MOVIIFYLogo } from '@/components/icons';
import type { TMDBMovie, TMDBVideo } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

async function getPopularMovies(): Promise<{ results: TMDBMovie[] }> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
        console.error('TMDB_API_KEY is not set');
        return { results: [] };
    }

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

    try {
        const res = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
        if (!res.ok) {
            throw new Error('Failed to fetch popular movies from TMDB.');
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return { results: [] };
    }
}

type MovieWithTrailer = TMDBMovie & { trailer?: TMDBVideo };

async function getMoviesWithTrailers(): Promise<MovieWithTrailer[]> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY is not set');
    return [];
  }

  const fetchMovies = async (url: string) => {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      const data = await res.json();
      return data.results || [];
    } catch (error) {
      console.error(`Failed to fetch movies from ${url}:`, error);
      return [];
    }
  };

  const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
  const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;

  const [nowPlaying, topRated] = await Promise.all([
    fetchMovies(nowPlayingUrl),
    fetchMovies(topRatedUrl),
  ]);

  const allMovies = [...nowPlaying, ...topRated];
  const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());

  const moviesWithTrailers: MovieWithTrailer[] = [];

  for (const movie of uniqueMovies) {
    if (moviesWithTrailers.length >= 3) break;
    try {
      const videosUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`;
      const videosRes = await fetch(videosUrl);
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        const trailer = videosData.results.find((v: TMDBVideo) => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) {
          moviesWithTrailers.push({ ...movie, trailer });
        }
      }
    } catch (error) {
      console.error(`Failed to fetch trailer for movie ID ${movie.id}:`, error);
    }
  }

  return moviesWithTrailers;
}


export default async function Home() {
  const { results: popularMovies } = await getPopularMovies();
  const featuredMovies = popularMovies.slice(0, 12);
  const trailers = await getMoviesWithTrailers();
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-background -z-10"></div>
        <div className="film-grain"></div>

        <div className="container px-4 md:px-6 z-10">
          <MOVIIFYLogo className="h-24 md:h-32 w-auto mx-auto mb-8" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
            Find Your Next Favorite Film
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300 drop-shadow">
            Explore thousands of movies, get personalized recommendations, and find where to watch.
          </p>
          <form action="/search" className="mt-8 max-w-xl mx-auto flex gap-2">
            <Input
              type="search"
              name="query"
              placeholder="Search movies by genre, title, or year..."
              className="flex-1 bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus:ring-accent"
            />
            <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12 md:py-20 space-y-20">
        
        {/* Featured Movie Treasures */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Film className="h-8 w-8 text-accent" />
            <h2 className="font-headline text-3xl font-bold">Movie Treasures</h2>
          </div>
           {featuredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {featuredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-[2/3] w-full" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
          )}
        </section>

        {/* AI Recommendations */}
        <section>
          <PersonalizedRecommendations />
        </section>
        
        {/* Latest Trailers */}
        <section>
           <div className="flex items-center gap-3 mb-8">
            <PlayCircle className="h-8 w-8 text-accent" />
            <h2 className="font-headline text-3xl font-bold">Latest Trailers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trailers.map((movie) => {
              const trailerImageUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : '/placeholder.svg';
              return (
                <Link href={`/movies/${movie.id}`} key={movie.id} className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
                  <Image 
                    src={trailerImageUrl}
                    alt={`Trailer for ${movie.title}`}
                    width={780}
                    height={439}
                    className="w-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <PlayCircle className="h-12 w-12 text-white/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all group-hover:text-white group-hover:scale-110" />
                    <h3 className="font-headline text-xl text-white font-bold">{movie.title}</h3>
                  </div>
                </Link>
              );
            })}
             {trailers.length === 0 && Array.from({length: 3}).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
