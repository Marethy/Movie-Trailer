import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ShowtimeApi from "../api/ShowtimeApi";
import TheaterApi from "../api/TheaterApi";
import { message } from "antd";

const OrderPage = () => {
  const { id: movieId } = useParams(); // Movie ID from route params
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fetch showtimes for the selected movie
  const { data: showtimes = [], isError: showtimeError } = useQuery(
    ["showtimes", movieId],
    () => ShowtimeApi.getShowtimesByMovieId(movieId),
    {
      onError: () => message.error("Failed to load showtimes. Please try again."),
    }
  );

  // Fetch all theaters
  const { data: theaters = [], isError: theaterError } = useQuery(
    "theaters",
    TheaterApi.getTheaters,
    {
      onError: () => message.error("Failed to load theaters. Please try again."),
    }
  );

  // Handle seat selection
  const handleSeatSelection = (seat) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat) ? prevSeats.filter((s) => s !== seat) : [...prevSeats, seat]
    );
  };

  // Confirm Order Mutation
  const confirmOrderMutation = useMutation(
    (orderData) => ShowtimeApi.getShowtimeFromOrder(orderData),
    {
      onSuccess: (response) => {
        message.success("Order confirmed!");
        navigate(`/user/orders/${response.orderId}`);
      },
      onError: () => {
        message.error("Failed to confirm order. Please try again.");
      },
    }
  );

  // Confirm Order Handler
  const handleConfirmOrder = () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      message.warning("Please select a showtime and seats.");
      return;
    }
    const orderData = {
      showtimeId: selectedShowtime.id,
      seats: selectedSeats,
    };
    confirmOrderMutation.mutate(orderData);
  };

  if (showtimeError || theaterError) return <div>Failed to load data.</div>;

  return (
    <div className="container mx-auto my-20 px-4">
      <h2 className="text-2xl font-bold mb-6">Order Tickets for Movie</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Select Showtime:</h3>
        <div className="flex flex-wrap gap-4 mt-2">
          {showtimes.map((showtime) => (
            <button
              key={showtime.id}
              onClick={() => setSelectedShowtime(showtime)}
              className={`py-2 px-4 rounded-lg shadow ${
                selectedShowtime?.id === showtime.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {showtime.time} - {theaters.find((t) => t.id === showtime.theater)?.name}
            </button>
          ))}
        </div>
      </div>

      {selectedShowtime && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Select Seats:</h3>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {selectedShowtime.seats.map((seat) => (
              <button
                key={seat.label}
                onClick={() => handleSeatSelection(seat.label)}
                className={`py-2 px-4 rounded ${
                  selectedSeats.includes(seat.label)
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
                disabled={seat.isOccupied}
              >
                {seat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleConfirmOrder}
        className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
        disabled={confirmOrderMutation.isLoading}
      >
        {confirmOrderMutation.isLoading ? "Processing..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default OrderPage;
