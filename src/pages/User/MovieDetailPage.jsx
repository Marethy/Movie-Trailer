import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useFetchMovies from "../../hooks/useFetchMovies";
import { PlayIcon, VideoCameraIcon, StarIcon } from "@heroicons/react/24/solid"; 
import { MovieContext } from "../../context/MovieDetailContext";

function MovieDetailPage() {
  const { handleVideoTrailer } = useContext(MovieContext);
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const { topRatedMovies } = useFetchMovies();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            },
          }
        );
        setMovie(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again.");
      }
    };

    fetchMovie();
  }, [id]);

  const renderStars = useMemo(() => (rating) => {
    const starCount = Math.round(rating / 2);
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i} 
        className={`${i < starCount ? "text-yellow-400" : "text-gray-400"} h-4 w-4`} 
      />
    ));
  }, []);

  if (error) {
    return <div className="text-center text-xl mt-10 text-red-500">{error}</div>;
  }

  if (!movie) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  const { title, poster_path, vote_average, genres, runtime, release_date, overview } = movie;

  return (
    <div className="container mx-auto my-20 px-12">
      <div className="flex flex-col md:flex-row md:gap-8 mx-auto">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <img
            src={`https://image.tmdb.org/t/p/w200/${poster_path}`}
            alt={title}
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="md:w-2/3 text-white">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <div className="flex items-center mb-4">
            {renderStars(vote_average)}
          </div>
          <p className="text-lg mb-2 "><strong>Genre:</strong> {genres.map(genre => genre.name).join(", ")}</p>
          <p className="text-lg mb-2"><strong>Duration:</strong> {Math.floor(runtime / 60)}h {runtime % 60}m</p>
          <p className="text-lg mb-4"><strong>Release Year:</strong> {new Date(release_date).getFullYear()}</p>
          <p className="mb-6">{overview}</p>

          <div className="flex gap-4">
            <button
              className="flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-700"
              onClick={() => handleVideoTrailer(movie.id)}
            >
              <VideoCameraIcon className="h-6 w-6 mr-2" /> Watch Trailer
            </button>
            <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-500">
              <PlayIcon className="h-6 w-6 mr-2" /> Play Movie
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4">Recommended Movies</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {topRatedMovies.slice(0, 5).map(movie => (
            <div key={movie.id} className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto hover:scale-110 transition-transform duration-500 ease-in-out cursor-pointer"
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
