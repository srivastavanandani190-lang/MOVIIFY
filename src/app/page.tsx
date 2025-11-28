import Image from 'next/image';
import { Film, PlayCircle, Search } from 'lucide-react';

import { movies } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';
import { MovieCard } from '@/components/movie-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PersonalizedRecommendations } from '@/components/ai/personalized-recommendations';

export default function Home() {
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'hero-background');
  const featuredMovies = movies.slice(0, 6);
  const trailers = movies.filter(m => m.trailerId).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Abstract cinematic background"
            fill
            className="object-cover -z-10 brightness-50"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="container px-4 md:px-6">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg">
            Find Your Next Favorite Film
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200 drop-shadow">
            Explore thousands of movies, get personalized recommendations, and find where to watch.
          </p>
          <div className="mt-8 max-w-xl mx-auto flex gap-2">
            <Input
              type="search"
              placeholder="Search by title, genre, actor..."
              className="flex-1 text-black"
            />
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12 md:py-20 space-y-20">
        
        {/* Featured Movie Treasures */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Film className="h-8 w-8 text-primary" />
            <h2 className="font-headline text-3xl font-bold">Featured Movie Treasures</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* AI Recommendations */}
        <section>
          <PersonalizedRecommendations />
        </section>
        
        {/* Latest Trailers */}
        <section>
           <div className="flex items-center gap-3 mb-8">
            <PlayCircle className="h-8 w-8 text-primary" />
            <h2 className="font-headline text-3xl font-bold">Latest Trailers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trailers.map((movie) => {
              const trailerImage = placeholderImages.placeholderImages.find(p => p.id === movie.trailerId);
              return trailerImage ? (
                <div key={movie.id} className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
                  <Image 
                    src={trailerImage.imageUrl}
                    alt={`Trailer for ${movie.title}`}
                    width={640}
                    height={360}
                    className="w-full object-cover transition-transform group-hover:scale-110"
                    data-ai-hint={trailerImage.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <PlayCircle className="h-12 w-12 text-white/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all group-hover:text-white group-hover:scale-110" />
                    <h3 className="font-headline text-xl text-white font-bold">{movie.title}</h3>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
