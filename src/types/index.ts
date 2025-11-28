export type StreamingPlatform = {
  name: string;
  url: string;
  type: 'free' | 'paid';
};

export type Comment = {
  id: number;
  author: string;
  avatarUrl: string;
  timestamp: string;
  text: string;
};

export type Movie = {
  id: string;
  title: string;
  releaseYear: number;
  summary: string;
  posterId: string;
  trailerId?: string;
  genres: string[];
  cast: string[];
  director: string;
  languages: string[];
  platforms: StreamingPlatform[];
  comments: Comment[];
};
