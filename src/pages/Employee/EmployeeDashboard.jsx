import React, { useEffect, useState } from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import ShowTimeList from "../../components/ShowTimeList";
import useFetchMovies from "../../hooks/useFetchMovies";

const EmployeeDashboard = () => {
  const dataProvider = jsonServerProvider("http://localhost:5000");
  const { trendingMovies, topRatedMovies, isLoading, error } = useFetchMovies();

  // You might want to store the fetched movies in local state if you need to use them directly.
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!isLoading && trendingMovies) {
      setMovies(trendingMovies); // or topRatedMovies depending on what you need
    }
  }, [isLoading, trendingMovies]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching movies: {error.message}</div>;

  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="showtimes" list={ShowTimeList} />
      {/* If you want to display movies, you can add a custom resource here */}
      {/* <Resource name="movies" list={YourMovieListComponent} /> */}
    </Admin>
  );
};

export default EmployeeDashboard;
