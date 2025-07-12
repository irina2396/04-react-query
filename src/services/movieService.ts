import axios from 'axios';
import { type Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

export interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number = -1
): Promise<MovieHttpResponse> => {
  const { data } = await axios.get<MovieHttpResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return data;
};
