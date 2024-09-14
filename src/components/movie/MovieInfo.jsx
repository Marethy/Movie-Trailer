import React from 'react';
import PropTypes from 'prop-types';

const MovieInfo = ({ movie }) => {
  if (!movie) return <div>Loading...</div>;

  return (
    <div className="md:w-2/3 my-10 px-10 max-w-full ">
      <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>

      <p className="text-gray-300 mb-4"><strong>Overview:</strong> {movie.overview}</p>
      <p className="text-gray-700 mb-2"><strong>Release Date:</strong> {movie.release_date}</p>
      <p className="text-gray-700 mb-2"><strong>Duration:</strong> {movie.runtime} minutes</p>
      <p className="text-gray-700 mb-2"><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
      <p className="text-gray-700 mb-2"><strong>Rating:</strong> {movie.vote_average} / 10</p>
    </div>
  );
};

// Thêm PropTypes validation
MovieInfo.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    runtime: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    vote_average: PropTypes.number,
  }).isRequired,
};

export default MovieInfo;
