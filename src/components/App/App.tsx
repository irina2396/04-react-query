import css from './App.module.css'
import { fetchMovies } from "../../services/movieService"
import SearchBar from "../SearchBar/SearchBar"
import { useState } from "react"
import { type Movie } from "../../types/movie"
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'


function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setLoading(true);
    setError(false);

    try {
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error("No movies found for your request.");
      }
      setMovies(results);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className={css.app} />
      <Toaster/>
      <SearchBar onSubmit={handleSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      
      {!loading && !error && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  )
}
export default App
