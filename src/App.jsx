
import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import MovieCard from './components/MovieCard';
import BG from './assets/BG.png';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = searchTerm
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      setMovieList(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again.');
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchTerm]);

  return (
    <main>
      <div
        className="pattern"
        style={{ backgroundImage: `url(${BG})` }}
      >
        <header>
          <img src="/hero-img.png" alt="Hero Banner" />

          <h1>
            Find{' '}
            <span className="text-gradient">Movies</span>{' '}
            You Will Enjoy Without the Hassle
          </h1>

          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </header>

        <section className="allMovies">
          <h2 className="text-center my-[40px] box">
            All Movies
          </h2>

          {isLoading ? (
            <p className="text-white text-center">
              Loading...
            </p>
          ) : errorMessage ? (
            <p className="text-red-500 text-center">
              {errorMessage}
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

