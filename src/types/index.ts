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

export type TMDBMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[];
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
};

export type TMDBMovieCredits = {
  cast: {
    name: string;
    character: string;
  }[];
  crew: {
    name: string;
    job: string;
  }[];
};

export type TMDBVideo = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
};

export type TMDBWatchProvider = {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
};

export type TMDBWatchProviders = {
  link: string;
  flatrate?: TMDBWatchProvider[];
  rent?: TMDBWatchProvider[];
  buy?: TMDBWatchProvider[];
};
