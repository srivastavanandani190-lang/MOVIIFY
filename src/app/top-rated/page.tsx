import { Star } from "lucide-react";
import { MovieCard } from "@/components/movie-card";
import type { TMDBMovie } from "@/types";

async function getTopRatedMovies(): Promise<{ results: TMDBMovie[] }> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
      console.error('TMDB_API_KEY is not set');
      return { results: [] };
    }
  
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch top rated movies from TMDB.');
      }
      return res.json();
    } catch (error) {
      console.error(error);
      return { results: [] };
    }
}


export default async function TopRatedPage() {
    const { results: movies } = await getTopRatedMovies();

    return (
        <div className="container py-12">
            <div className="flex items-center gap-3 mb-8">
                <Star className="h-10 w-10 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Top Rated Movies</h1>
            </div>

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-secondary/50 rounded-lg">
                    <h2 className="text-2xl font-bold">Could not load movies</h2>
                    <p className="mt-2 text-muted-foreground">Please try again later.</p>
                </div>
            )}
        </div>
    );
}
