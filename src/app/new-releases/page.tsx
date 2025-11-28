import { Sparkles } from "lucide-react";

export default function NewReleasesPage() {
  return (
    <div className="container py-20 text-center">
      <Sparkles className="mx-auto h-16 w-16 text-primary" />
      <h1 className="mt-4 font-headline text-4xl font-bold">New Releases</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        This section is under construction. Check back soon for the latest movie releases.
      </p>
    </div>
  );
}
