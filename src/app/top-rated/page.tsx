import { Star } from "lucide-react";

export default function TopRatedPage() {
  return (
    <div className="container py-20 text-center">
      <Star className="mx-auto h-16 w-16 text-primary" />
      <h1 className="mt-4 font-headline text-4xl font-bold">Top Rated Movies</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        This section is under construction. Soon you'll be able to see the top rated movies.
      </p>
    </div>
  );
}
