// src/pages/HomePage.jsx
import React from "react";
import Banner from "../components/Banner";
import MovieList from "../components/movie/MovieList";
import MovieSearch from "../components/movie/MovieSearch";
import useFetchMovies from "../hooks/useFetchMovies";

const HomePage = () => {
  const { trendingMovies, topRatedMovies, isLoading } = useFetchMovies();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 py-8">
        <MovieList title="Phim đang hot" data={trendingMovies.slice(0, 10)} />
        <MovieList title="Phim hay nhất" data={topRatedMovies.slice(0, 10)} />
      </div>
    </div>
  );
};

export default HomePage;