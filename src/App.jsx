import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/Search";
import { BeatLoader } from "react-spinners";
import MovieCard from "./components/MovieCard";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMovies,
  getTrendingMovies,
  updateSearchCount,
} from "./utils/utils";
import { useDebounce } from "react-use";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  const {
    data: movieList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movieList", debouncedSearchTerm],
    queryFn: () => fetchMovies(debouncedSearchTerm),
  });
  const {
    data: trendingMovies,
    isLoading: isTrendingMoviesLoading,
    error: isTrendingMoviesError
  } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: () => getTrendingMovies(),
  });
  useEffect(() => {
    if (movieList && debouncedSearchTerm) {
      updateSearchCount(debouncedSearchTerm, movieList[0]);
    }
  }, [movieList, debouncedSearchTerm]);
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero-Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          {isTrendingMoviesLoading ? (
            <BeatLoader color="white" />
          ) : isTrendingMoviesError ? (
            <p className="text-red">{error}</p>
          ) : (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies?.map((movie,index) => (
                  <li key={movie.id}>
                    <p>{index+1}</p>
                    <img
                      src={movie.poster_url}
                      alt={movie.searchTerm} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all-movies">
            <h2 className="mt-[20px]">All Movies</h2>
            {isLoading ? (
              <BeatLoader color="white" />
            ) : error ? (
              <p className="text-red">{error}</p>
            ) : (
              <ul>
                {movieList?.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
