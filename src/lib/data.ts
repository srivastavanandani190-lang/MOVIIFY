import type { Movie } from '@/types';

export const movies: Movie[] = [
  {
    id: 'stellar-odyssey',
    title: 'Stellar Odyssey',
    releaseYear: 2023,
    summary: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterId: 'movie-poster-1',
    trailerId: 'movie-trailer-1',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    director: 'Christopher Nolan',
    languages: ['English', 'Spanish'],
    platforms: [
      { name: 'Netflix', url: '#', type: 'paid' },
      { name: 'Amazon Prime', url: '#', type: 'paid' },
    ],
    comments: [
      { id: 1, author: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?u=alex', timestamp: '2 days ago', text: 'Mind-bending visuals and a powerful story. A must-watch!' },
      { id: 2, author: 'Maria', avatarUrl: 'https://i.pravatar.cc/150?u=maria', timestamp: '1 day ago', text: 'The ending was a bit confusing, but I enjoyed the ride.' },
    ],
  },
  {
    id: 'the-last-cipher',
    title: 'The Last Cipher',
    releaseYear: 2024,
    summary: 'A brilliant cryptographer is lured into a global conspiracy when she deciphers an ancient code, putting her life in danger.',
    posterId: 'movie-poster-2',
    trailerId: 'movie-trailer-2',
    genres: ['Thriller', 'Mystery'],
    cast: ['Alicia Vikander', 'Tom Hardy', 'Idris Elba'],
    director: 'Denis Villeneuve',
    languages: ['English', 'French'],
    platforms: [
      { name: 'Hulu', url: '#', type: 'paid' },
    ],
    comments: [
      { id: 1, author: 'Chris', avatarUrl: 'https://i.pravatar.cc/150?u=chris', timestamp: '5 hours ago', text: 'Edge of my seat the entire time! The plot twists were insane.' },
    ],
  },
  {
    id: 'echoes-of-the-past',
    title: 'Echoes of the Past',
    releaseYear: 2022,
    summary: 'A historian discovers a diary that transports him back to the 1920s, where he must navigate a world of glamour and danger.',
    posterId: 'movie-poster-3',
    trailerId: 'movie-trailer-3',
    genres: ['Romance', 'Fantasy', 'History'],
    cast: ['Ryan Gosling', 'Emma Stone', 'Viola Davis'],
    director: 'Damien Chazelle',
    languages: ['English'],
    platforms: [
      { name: 'YouTube', url: '#', type: 'free' },
      { name: 'Tubi', url: '#', type: 'free' },
    ],
    comments: [],
  },
  {
    id: 'crimson-peak',
    title: 'Crimson Peak',
    releaseYear: 2015,
    summary: 'In the aftermath of a family tragedy, an aspiring author is torn between love for her childhood friend and the temptation of a mysterious outsider.',
    posterId: 'movie-poster-4',
    genres: ['Horror', 'Gothic', 'Romance'],
    cast: ['Mia Wasikowska', 'Jessica Chastain', 'Tom Hiddleston'],
    director: 'Guillermo del Toro',
    languages: ['English', 'German'],
    platforms: [
      { name: 'Netflix', url: '#', type: 'paid' },
    ],
    comments: [
      { id: 1, author: 'Sam', avatarUrl: 'https://i.pravatar.cc/150?u=sam', timestamp: '1 week ago', text: 'Visually stunning, but more of a gothic romance than a straight horror film.' },
    ],
  },
  {
    id: 'neon-dreams',
    title: 'Neon Dreams',
    releaseYear: 2024,
    summary: 'A struggling musician in a futuristic city gets a chance to make it big, but fame comes at a steep price.',
    posterId: 'movie-poster-5',
    genres: ['Sci-Fi', 'Music', 'Drama'],
    cast: ['Anya Taylor-Joy', 'Adam Driver', 'Lakeith Stanfield'],
    director: 'Nicolas Winding Refn',
    languages: ['English', 'Japanese'],
    platforms: [
      { name: 'Amazon Prime', url: '#', type: 'paid' },
    ],
    comments: [],
  },
  {
    id: 'the-gilded-cage',
    title: 'The Gilded Cage',
    releaseYear: 2021,
    summary: 'A family of Portuguese immigrants living in a wealthy Paris neighborhood navigates the complexities of class, culture, and family secrets.',
    posterId: 'movie-poster-6',
    genres: ['Comedy', 'Drama'],
    cast: ['Rita Blanco', 'Joaquim de Almeida', 'Chantal Lauby'],
    director: 'Ruben Alves',
    languages: ['French', 'Portuguese'],
    platforms: [
      { name: 'Tubi', url: '#', type: 'free' },
    ],
    comments: [],
  },
];

export const getMovieById = (id: string) => {
  return movies.find((movie) => movie.id === id);
}
