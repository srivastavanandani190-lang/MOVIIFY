import { Film } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { TMDBGenre } from "@/types";

async function getGenres(): Promise<{ genres: TMDBGenre[] }> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
        console.error('TMDB_API_KEY is not set');
        return { genres: [] };
    }

    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Failed to fetch genres from TMDB.');
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return { genres: [] };
    }
}

export default async function GenresPage() {
    const { genres } = await getGenres();

    return (
        <div className="container py-12">
            <div className="flex items-center gap-3 mb-8">
                <Film className="h-10 w-10 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Movie Genres</h1>
            </div>
            
            <p className="mt-2 mb-12 text-lg text-muted-foreground">
                Browse movies by genre to find your next favorite film.
            </p>

            {genres.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {genres.map((genre) => (
                        <Link key={genre.id} href={`/genres/${genre.name.toLowerCase().replace(/ /g, '-')}`}>
                             <Badge 
                                variant="outline" 
                                className="text-lg px-6 py-2 border-accent/50 bg-secondary/50 hover:bg-accent/80 hover:text-accent-foreground transition-all cursor-pointer transform hover:scale-105"
                            >
                                {genre.name}
                            </Badge>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-secondary/50 rounded-lg">
                    <h2 className="text-2xl font-bold">Could not load genres</h2>
                    <p className="mt-2 text-muted-foreground">Please try again later.</p>
                </div>
            )}
        </div>
    );
}
