import { Film } from "lucide-react";
import { MovieCard } from "@/components/movie-card";
import { genreMap } from "@/lib/data";
import type { TMDBMovie } from "@/types";

async function getMoviesByGenre(genreId: number): Promise<{ results: TMDBMovie[] }> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
        console.error('TMDB_API_KEY is not set');
        return { results: [] };
    }

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=1`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch movies for genre ID ${genreId} from TMDB.`);
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return { results: [] };
    }
}

export default async function GenrePage({ params }: { params: { slug: string } }) {
    const genreName = Object.keys(genreMap).find(key => key.toLowerCase().replace(/ /g, '-') === params.slug);
    const genreId = genreName ? genreMap[genreName] : null;

    let movies: TMDBMovie[] = [];
    if (genreId) {
        const response = await getMoviesByGenre(genreId);
        movies = response.results;
    }

    return (
        <div className="container py-12">
            <div className="flex items-center gap-3 mb-8">
                <Film className="h-10 w-10 text-primary" />
                <h1 className="font-headline text-4xl font-bold">{genreName || 'Genre'}</h1>
            </div>

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-secondary/50 rounded-lg">
                    <h2 className="text-2xl font-bold">No movies found for this genre</h2>
                    <p className="mt-2 text-muted-foreground">Please try a different genre or check back later.</p>
                </div>
            )}
        </div>
    );
}

// This function can be used by Next.js to pre-render all genre pages at build time.
export async function generateStaticParams() {
  return Object.keys(genreMap).map((name) => ({
    slug: name.toLowerCase().replace(/ /g, '-'),
  }));
}
