"use client";
import { useEffect, useState } from "react";

const BookingSummary = () => {
  const [bookings, setBookings] = useState([]);
  const [totalRoomsBooked, setTotalRoomsBooked] = useState(0);

  useEffect(() => {
    fetch("/api/get-bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        const total = data.reduce((sum, booking) => sum + booking.rooms.length, 0);
        setTotalRoomsBooked(total);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">Booking Summary</h2>
        <p className="mt-2 text-lg">Total Rooms Booked: <span className="font-semibold">{totalRoomsBooked}</span></p>

        <h3 className="mt-4 text-xl font-semibold">Recent Bookings</h3>
        <ul className="mt-2 space-y-2">
          {bookings.map((booking) => (
            <li key={booking.id} className="p-2 border rounded-lg shadow-sm">
              <p><strong>Name:</strong> {booking.name}</p>
              <p><strong>Rooms:</strong> {booking.rooms.join(", ")}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingSummary;
