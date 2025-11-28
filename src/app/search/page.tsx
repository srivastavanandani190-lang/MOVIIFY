
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Search as SearchIcon, Film, ServerCrash } from 'lucide-react';
import { MovieCard } from '@/components/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { TMDBItem } from '@/types';
import { Button } from '@/components/ui/button';

async function searchMovies(query: string, page: number): Promise<{ results: TMDBItem[], total_pages: number }> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY is not set');
    throw new Error('TMDB API key is not configured.');
  }

  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch search results from TMDB.');
  }
  const data = await res.json();
  const filteredResults = data.results.filter((item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path);
  return {
    ...data,
    results: filteredResults
  };
}

function SearchComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  
  const [movies, setMovies] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      setMovies([]);
      setPage(1);
      
      searchMovies(query, 1)
        .then(data => {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        })
        .catch(err => {
          setError(err.message || 'An unexpected error occurred.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [query]);

  const loadMore = () => {
    if (query && page < totalPages) {
      setLoading(true);
      searchMovies(query, page + 1)
        .then(data => {
          setMovies(prev => [...prev, ...data.results]);
          setPage(prev => prev + 1);
        })
        .catch(err => {
          setError(err.message || 'An unexpected error occurred while loading more results.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  if (!query) {
    return (
      <div className="container py-20 text-center">
        <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 font-headline text-3xl font-bold">Search for a movie or TV show</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Use the search bar in the header to find your next favorite film.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <h1 className="font-headline text-3xl font-bold mb-8">
        Search Results for: <span className="text-primary">{query}</span>
      </h1>

      {error && (
        <div className="text-center py-20 bg-destructive/10 rounded-lg">
          <ServerCrash className="mx-auto h-16 w-16 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold text-destructive">Oops! Something went wrong.</h2>
          <p className="mt-2 text-destructive/80">{error}</p>
        </div>
      )}

      {!error && movies.length === 0 && !loading && (
        <div className="text-center py-20 bg-secondary/50 rounded-lg">
          <Film className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">No movies found</h2>
          <p className="mt-2 text-muted-foreground">Try a different search term.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} />
        ))}
        {loading && Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        ))}
      </div>

      {!loading && page < totalPages && (
        <div className="flex justify-center mt-12">
          <Button onClick={loadMore} disabled={loading} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/80">
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchComponent />
        </Suspense>
    )
}
