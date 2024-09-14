// src/pages/MovieDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieInfo from '../components/movie/MovieInfo';
import MovieList from '../components/movie/MovieList';
import useFetchMovies from "../hooks/useFetchMovies";


const MovieDetailPage = () => {
  const { id } = useParams(); // Lấy ID phim từ URL
  const [movie, setMovie] = useState(null);
  const { trendingMovies, topRatedMovies, isLoading } = useFetchMovies();


  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          }
        });
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <div className="text-center text-xl mt-10">Loading...</div>;

  return (
    <>
    <div className="container mx-auto py-32 px-8">
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Poster Image */}
        <div className="md:w-1/3 mb-6 md:mb-0">
          <img 
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
            alt={movie.title} 
            className="rounded-lg shadow-lg"
          />
        </div>
        {/* Movie Details */}
        <MovieInfo movie={movie} />
      </div>
    </div>
    <MovieList title="Phim đề cử" data={topRatedMovies.slice(0, 10)} />

    </>
    
  );
};

export default MovieDetailPage;
