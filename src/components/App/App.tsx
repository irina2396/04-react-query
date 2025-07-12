import css from './App.module.css'
import { fetchMovies, type MovieHttpResponse } from "../../services/movieService"
import SearchBar from "../SearchBar/SearchBar"
import { useEffect, useState } from "react"
import { type Movie } from "../../types/movie"
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import { useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate'


function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isFetching, isError, isSuccess } = useQuery <
    MovieHttpResponse,
    Error,
    MovieHttpResponse,
    [string, string, number]
  >({
    queryKey: ['movie', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
  })

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return ( 
    <>
      <div className={css.app} />
      <Toaster/>
      <SearchBar onSubmit={handleSearch} />
      {isLoading || isFetching ? <Loader/> : null}
      {isError && (
        <ErrorMessage />
      )}

      {isSuccess && data?.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          </>
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
