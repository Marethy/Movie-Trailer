// src/components/HomePage.jsx
import React from 'react';
import Banner from '../components/Banner';
import MovieList from '../components/MovieList';
import MovieSearch from '../components/MovieSearch';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    (async function () {
      const urls = [
        "https://api.themoviedb.org/3/trending/movie/day?language=vi",
        "https://api.themoviedb.org/3/movie/top_rated?language=vi",
      ];
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      };
      const fetchMovies = async (url) => {
        return await fetch(url, options).then((response) => response.json());
      };

      try {
        const response = await Promise.all(urls.map(fetchMovies));
        setTrendingMovies(response[0].results);
        setTopRatedMovies(response[1].results);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <Banner />
      {searchData.length === 0 && (
        <MovieList title="Phim Hot" data={trendingMovies.slice(0, 10)} />
      )}
      {searchData.length === 0 && (
        <MovieList title="Phim đề cử" data={topRatedMovies.slice(0, 10)} />
      )}
      {searchData.length > 0 && <MovieSearch data={searchData} />}
    </>
  );
};

export default HomePage;
