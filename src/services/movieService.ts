import axios from 'axios';
import { type Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

export interface MovieHttpResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  const response = await axios.get<MovieHttpResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.results;
};
