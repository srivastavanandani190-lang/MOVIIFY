'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { getRecommendationAction } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  moviePreferences: z.string().min(10, { message: "Please describe your movie preferences in a bit more detail." }),
  viewingHistory: z.string().min(10, { message: "Please tell us about a few movies you've watched recently." }),
});

type Recommendation = {
  movieRecommendation: string;
  explanation: string;
}

export function PersonalizedRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moviePreferences: "",
      viewingHistory: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRecommendation(null);
    setError(null);
    const result = await getRecommendationAction(values);
    if (result.success && result.data) {
      setRecommendation(result.data);
    } else {
      setError(result.error ?? 'An unknown error occurred.');
    }
    setLoading(false);
  }

  return (
    <Card className="bg-secondary border-accent/50">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-accent" />
            <CardTitle className="font-headline text-2xl">AI-Powered Recommendations</CardTitle>
        </div>
        <CardDescription>
          Tell us what you like, and our AI will find the perfect movie for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="moviePreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Movie Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I love sci-fi movies with complex plots, psychological thrillers, and anything by director Denis Villeneuve."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="viewingHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recent Viewing History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Recently watched Blade Runner 2049 (loved it), The Silence of the Lambs (a classic), and enjoyed Parasite."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? 'Thinking...' : 'Get Recommendation'}
            </Button>
          </form>
        </Form>
        {loading && (
            <div className="space-y-4 pt-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {recommendation && (
            <div className="pt-4 animate-in fade-in">
                <h3 className="font-headline text-xl font-semibold text-accent">{recommendation.movieRecommendation}</h3>
                <p className="text-muted-foreground mt-2">{recommendation.explanation}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
