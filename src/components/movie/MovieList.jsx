import PropTypes from "prop-types";
import { useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MovieContext } from "../../context/MovieDetailContext";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 10,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 7,
  },
  tablet: {
    breakpoint: { max: 1200, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 3,
  },
};

const MovieList = ({ title, data }) => {
  const navigate = useNavigate();

  return (
    <div className="my-10 px-2 md:px-10 max-w-full">
      <h2 className="text-lg md:text-2xl   mb-4">{title}</h2>
      <Carousel responsive={responsive} draggable={false}>
        {data?.map((movie) => (
          <div
            key={movie.id}
            className="w-auto h-[200px] rounded-md md:w-auto md:h-[300px] bg-cover bg-no-repeat bg-center relative hover:scale-110 transition-transform duration-500 ease-in-out cursor-pointer m-1"
            style={{
              backgroundImage: `url(${import.meta.env.VITE_IMG_URL}${
                movie.poster_path
              })`,
            }}
            onClick={() => navigate(`/user/movies/${movie.id}`)}
          >
            <div className="hidden md:block bg-black w-full h-full opacity-40 absolute top-0 left-0 z-0">
              <div className="relative mx-auto p-4 flex flex-col items-center justify-end h-full">
                <h3 className="text-md uppercase">
                  {movie.name || movie.title || movie.original_title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

MovieList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
};

export default MovieList;
