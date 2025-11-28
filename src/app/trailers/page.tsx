import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { movies } from "@/lib/data";
import placeholderImages from "@/lib/placeholder-images.json";

export default function TrailersPage() {
  const trailers = movies.filter(m => m.trailerId);

  return (
    <div className="container py-12 md:py-20">
      <div className="flex items-center gap-3 mb-8">
        <PlayCircle className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-headline text-4xl font-bold">Latest Trailers</h1>
      </div>
      <p className="mt-2 mb-12 text-lg text-muted-foreground">
        Watch the latest and greatest movie trailers right here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <PlayCircle className="h-12 w-12 text-white/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all group-hover:text-white group-hover:scale-110" />
                <h3 className="font-headline text-xl text-white font-bold">{movie.title}</h3>
                <p className="text-sm text-neutral-300">{movie.releaseYear}</p>
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
