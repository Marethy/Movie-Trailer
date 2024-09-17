import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useFetchMovies from "../hooks/useFetchMovies";
import { PlayIcon, VideoCameraIcon,StarIcon } from '@heroicons/react/24/solid'; // Import Heroicons v2
import { MovieContext } from '../context/MovieDetailContext';

function MovieDetailPage() {
  const { handleVideoTrailer } = useContext(MovieContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID phim từ URL
  const [movie, setMovie] = useState(null);
  const { topRatedMovies } = useFetchMovies();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
        });
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <div className="text-center text-xl mt-10">Loading...</div>;

  // Function to render star ratings based on movie rating
  const renderStars = (rating) => {
    const starCount = rating // Chuyển đổi rating sang thang điểm 5 sao
    const stars = [];
    
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <StarIcon
          key={i} // Thêm key cho mỗi phần tử
          className={`${i <= starCount ? 'text-yellow-400' : 'text-gray-400'} h-4 w-4`} // Sao được đánh giá là vàng, chưa được đánh giá là xám, và có kích thước nhỏ
          />
      );
    }
    
    return stars;
  };
  return (
    <div className="container mx-auto py-32 px-12">
      <div className="flex flex-col md:flex-row md:gap-8 mx-auto">
        {/* Poster Image */}
        <div className="md:w-1/3 mb-6 md:mb-0 " >
          <img
            src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg" />
        </div>

        {/* Movie Details */}
        <div className="md:w-2/3">
          {/* Movie Title and Rating */}
          <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
          <div className="flex items-center mb-4">
            {renderStars(movie.vote_average)}
          </div>

          {/* Genre */}
          <p className="text-lg mb-2">
            <strong>Genre:</strong> {movie.genres && movie.genres.map(genre => genre.name).join(', ')}
          </p>

          {/* Runtime and Release Date */}
          <p className="text-lg mb-2">
            <strong>Duration:</strong> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
          </p>
          <p className="text-lg mb-4">
            <strong>Release Year:</strong> {new Date(movie.release_date).getFullYear()}
          </p>

          {/* Overview */}
          <p className="mb-6">{movie.overview}</p>

          {/* Director and Producer */}
          <p className="text-lg mb-2">
            <strong>Director:</strong> {/* Add actual API data here */}
          </p>
          <p className="text-lg mb-4">
            <strong>Producer:</strong>  
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-700"
              onClick={() => handleVideoTrailer(movie.id)}>
              <VideoCameraIcon className="h-6 w-6 mr-2" /> {/* Heroicon v2 for Trailer */}
              Trailer
            </button>
            <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-500">
              <PlayIcon className="h-6 w-6 mr-2" /> {/* Heroicon v2 for Play */}
              Play
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Movies */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4">Recommended Movies</h3>
        {/* Render the top-rated movies here */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {topRatedMovies.slice(0, 5).map(movie => (
            <div key={movie.id} className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto 
                hover:scale-110 transition-transform duration-500 ease-in-out cursor-pointer"
                onClick={() => navigate(`/cinema/movies/${movie.id}`)} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
