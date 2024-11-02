import React, { useState } from 'react';
import { Button, Modal, Typography, List, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import MovieApi from '../../api/movieApi';
import ProjectionRoom from '../../components/admin/ProjectionRoom'; // Import ProjectionRoom component
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const { Text } = Typography;

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
    items: 2,
  },
};

const CinemaMovie = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: MovieApi.getMovies,
  });

  const showModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedMovie(null);
  };

  if (isLoading) {
    return <Spin tip="Loading movies..." />; // Loading spinner while fetching movies
  }

  return (
    <div className="my-10 px-10 max-w-full">
      <h2 className="text-xl uppercase mb-4">Phim Đang Chiếu</h2>
      <Carousel responsive={responsive} draggable={false}>
        {movies?.content.map((movie) => (
          <div
            key={movie.id}
            className="bg-cover bg-no-repeat bg-center w-[200px] h-[300px] relative hover:scale-110 transition-transform duration-500 ease-in-out cursor-pointer"
            style={{
              backgroundImage: `url(${movie.urlImage})`,
            }}
            onClick={() => showModal(movie)}
          >
            <div className="bg-black w-full h-full opacity-40 absolute top-0 left-0 z-0" />
            <div className="relative p-4 flex flex-col items-center justify-end h-full">
              <h3 className="text-md uppercase">
                {movie.name || movie.title || movie.original_title}
              </h3>
            </div>
          </div>
        ))}
      </Carousel>

      <Modal
        title={selectedMovie?.name || 'Movie Details'}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedMovie && (
          <div>
            <Text strong>Description: </Text>
            <p>{selectedMovie.description}</p>
            <Text strong>Release Date: </Text>
            <p>{selectedMovie.releaseDate}</p>
            <Text strong>Duration: </Text>
            <p>{selectedMovie.durationMin} minutes</p>
            <Text strong>Director: </Text>
            <p>{selectedMovie.director.map(d => d.name).join(', ')}</p>
            <Text strong>Categories: </Text>
            <p>{selectedMovie.categories.map(c => c.name).join(', ')}</p>
            <Button onClick={() => handleModalClose()} type="primary">
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CinemaMovie;
