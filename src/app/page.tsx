
import Image from 'next/image';
import { Film, PlayCircle, Search } from 'lucide-react';

import { MovieCard } from '@/components/movie-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PersonalizedRecommendations } from '@/components/ai/personalized-recommendations';
import { MOVIIFYLogo } from '@/components/icons';
import type { TMDBItem, TMDBVideo } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

async function getMixedContent(): Promise<TMDBItem[]> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY is not set');
    return [];
  }

  const fetchContent = async (url: string, media_type: 'movie' | 'tv'): Promise<TMDBItem[]> => {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || []).map((item: any) => ({ ...item, media_type }));
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      return [];
    }
  };

  const hollywoodUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1&region=US`;
  const bollywoodUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=hi-IN&region=IN&sort_by=popularity.desc&with_original_language=hi`;
  const kDramaUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=ko-KR&sort_by=popularity.desc&with_original_language=ko`;
  
  const [hollywood, bollywood, kDramas] = await Promise.all([
    fetchContent(hollywoodUrl, 'movie'),
    fetchContent(bollywoodUrl, 'movie'),
    fetchContent(kDramaUrl, 'tv'),
  ]);

  const allContent = [...hollywood, ...bollywood, ...kDramas];
  
  // Shuffle the array to mix content
  for (let i = allContent.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allContent[i], allContent[j]] = [allContent[j], allContent[i]];
  }

  return allContent.slice(0, 18);
}


type ItemWithTrailer = TMDBItem & { trailer?: TMDBVideo };

async function getTrendingTrailers(): Promise<ItemWithTrailer[]> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY is not set');
    return [];
  }

  const trendingUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
  
  let trendingItems: TMDBItem[] = [];
  try {
    const res = await fetch(trendingUrl, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      trendingItems = (data.results || []).filter(
        (item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.backdrop_path
      );
    }
  } catch (error) {
    console.error(`Failed to fetch trending items:`, error);
  }

  const itemsWithTrailers: ItemWithTrailer[] = [];

  for (const item of trendingItems) {
    if (itemsWithTrailers.length >= 3) break;
    if (!item.media_type) continue;

    try {
      const videosUrl = `https://api.themoviedb.org/3/${item.media_type}/${item.id}/videos?api_key=${apiKey}&language=en-US`;
      const videosRes = await fetch(videosUrl);
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        const trailer = videosData.results.find((v: TMDBVideo) => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) {
          itemsWithTrailers.push({ ...item, trailer });
        }
      }
    } catch (error) {
      console.error(`Failed to fetch trailer for ${item.media_type} ID ${item.id}:`, error);
    }
  }

  return itemsWithTrailers;
}


export default async function Home() {
  const featuredContent = await getMixedContent();
  const trailers = await getTrendingTrailers();
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-background -z-10"></div>
        <div className="film-grain"></div>

        <div className="container px-4 md:px-6 z-10">
          <MOVIIFYLogo className="h-24 md:h-32 w-auto mx-auto mb-8" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
            Your Universe of Movies, Unlocked.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300 drop-shadow">
            Discover your next favorite film, get personalized AI recommendations, and see where it's streaming.
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
           {featuredContent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {featuredContent.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} movie={item} />
              ))}
            </div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {Array.from({ length: 18 }).map((_, i) => (
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
            {trailers.map((item) => {
              const trailerImageUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : '/placeholder.svg';
              const title = item.title || item.name;
              const link = `/${item.media_type === 'tv' ? 'tv' : 'movies'}/${item.id}`;
              return (
                <Link href={link} key={item.id} className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
                  <Image 
                    src={trailerImageUrl}
                    alt={`Trailer for ${title}`}
                    width={780}
                    height={439}
                    className="w-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <PlayCircle className="h-12 w-12 text-white/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all group-hover:text-white group-hover:scale-110" />
                    <h3 className="font-headline text-xl text-white font-bold">{title}</h3>
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
