
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clapperboard, Languages, Star, Tv, Video, Youtube } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { TMDBItem, TMDBMovieCredits, TMDBVideo, TMDBWatchProviders } from '@/types';

type TVShowDetails = TMDBItem & {
  credits: TMDBMovieCredits;
  videos: { results: TMDBVideo[] };
  'watch/providers': { results: { [country: string]: TMDBWatchProviders } };
  created_by?: { name: string }[];
};

async function getTVShowData(id: string): Promise<TVShowDetails | null> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY is not set');
    return null;
  }
  const baseUrl = 'https://api.themoviedb.org/3';

  const tvUrl = `${baseUrl}/tv/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits,videos,watch/providers`;

  try {
    const res = await fetch(tvUrl);

    if (!res.ok) return null;

    const tvShow = await res.json();
    
    return tvShow;
  } catch (error) {
    console.error('Failed to fetch TV show data from TMDB:', error);
    return null;
  }
}

export default async function TVShowDetailPage({ params }: { params: { id: string } }) {
  const show = await getTVShowData(params.id);

  if (!show) {
    notFound();
  }
  const title = show.title || show.name;
  const releaseDate = show.release_date || show.first_air_date;

  const posterUrl = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder.svg';
  const creators = show.created_by;
  const mainCast = show.credits?.cast.slice(0, 5);
  const trailer = show.videos?.results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
  const providers = show['watch/providers']?.results?.US;

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1">
          <Card className="overflow-hidden sticky top-24">
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={posterUrl}
                alt={`Poster for ${title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="font-headline text-4xl font-bold">{title}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              {releaseDate && <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(releaseDate).getFullYear()}</span>}
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Clapperboard className="h-4 w-4" />
                {show.genres?.map((genre) => (
                  <Badge key={genre.id} variant="outline">{genre.name}</Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-lg leading-relaxed">{show.overview}</p>

          <div className="grid grid-cols-2 gap-6 text-sm">
            {creators && creators.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Creator(s)</h3>
                <p>{creators.map(c => c.name).join(', ')}</p>
              </div>
            )}
            {mainCast && mainCast.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-primary" /> Cast</h3>
                <p>{mainCast.map(c => c.name).join(', ')}</p>
              </div>
            )}
            {show.spoken_languages && show.spoken_languages.length > 0 && (
                 <div className="space-y-4">
                 <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Languages className="h-5 w-5 text-primary" /> Languages</h3>
                 <p>{show.spoken_languages.map(l => l.english_name).join(', ')}</p>
               </div>
            )}
          </div>

          {trailer && (
             <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Youtube className="h-5 w-5 text-primary" /> Trailer</h3>
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
             </div>
          )}
          
          {providers && (providers.flatrate || providers.rent || providers.buy) && (
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Tv className="h-5 w-5 text-primary" /> Where to Watch</h3>
              <div className="flex flex-wrap gap-4">
                {providers.flatrate?.map((p) => (
                  <a key={p.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md border bg-secondary/50 hover:bg-secondary transition-colors">
                    <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={32} height={32} className="rounded-md" />
                    <span>{p.provider_name}</span>
                    <Badge variant='secondary'>Stream</Badge>
                  </a>
                ))}
                 {providers.rent?.map((p) => (
                  <a key={p.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md border bg-secondary/50 hover:bg-secondary transition-colors">
                    <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={32} height={32} className="rounded-md" />
                    <span>{p.provider_name}</span>
                    <Badge variant='outline'>Rent</Badge>
                  </a>
                ))}
                 {providers.buy?.map((p) => (
                  <a key={p.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md border bg-secondary/50 hover:bg-secondary transition-colors">
                    <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={32} height={32} className="rounded-md" />
                    <span>{p.provider_name}</span>
                    <Badge variant='default' className='bg-accent text-accent-foreground'>Buy</Badge>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <Separator />
          
          <div className="space-y-6">
            <h3 className="font-headline text-2xl font-bold">Comments & Reviews</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=guest" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="w-full space-y-2">
                    <Textarea placeholder="Share your review..." />
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Post Comment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-muted-foreground text-center py-4">Comments are coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
