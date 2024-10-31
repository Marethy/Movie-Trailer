import React from "react";
import Banner from "../../components/Banner";
import MovieList from "../../components/movie/MovieList";
import MovieSearch from "../../components/movie/MovieSearch";
import useFetchMovies from "../../hooks/useFetchMovies";
import CinemaMovie from "../../components/movie/CinemaMovie";
const HomePage = ({ searchData }) => {
  const { trendingMovies, topRatedMovies, isLoading } = useFetchMovies();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 py-8 text-white">
        {searchData.length > 0 ? (
          <MovieSearch title="Kết quả tìm kiếm" data={searchData} />
        ) : (
          <>
            <h1 className=" text-red-700 text-5xl text-center  font-[arial]">
              ĐẶT VÉ PHIM
            </h1>
            <CinemaMovie />
            <h1 className="text-red-700 text-5xl text-center">
              {" "}
              XEM TRỰC TIẾP TRONG KHO PHIM
            </h1>

            <MovieList
              title="Phim đang hot"
              data={trendingMovies.slice(0, 10)}
            />
            <MovieList
              title="Phim hay nhất"
              data={topRatedMovies.slice(0, 10)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
