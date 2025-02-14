"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [roomStats, setRoomStats] = useState({
    totalRooms: 0,
    bookedRooms: 0,
    availableRooms: 0,
  });

  useEffect(() => {
    fetch("/api/room-stats")
      .then((res) => res.json())
      .then((data) => setRoomStats(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <header className="bg-blue-500 w-full p-8 text-white flex justify-center">
        <div>
          <h1 className="text-4xl font-sans font-semibold">Welcome To Shrey</h1>
        </div>

      </header>
      <main className="flex flex-col items-center mt-10">

        <div className="bg-white p-4 mt-5 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Room Availability</h2>
          <div className="flex gap-5 p-4">
            <p className="p-2 w-[100px] border border-blue-500 rounded-md font-mono flex flex-col">
              Total Rooms{" "}
              <span className="text-2xl">{roomStats.totalRooms}</span>
            </p>
            <p className="p-2 w-[100px] border border-blue-500 rounded-md font-mono flex flex-col">
              Booked Rooms{" "}
              <span className="text-2xl">{roomStats.bookedRooms}</span>
            </p>
            <p className="p-2 w-[100px] border border-blue-500 rounded-md font-mono flex flex-col">
              Available Rooms
              <span className="text-2xl">{roomStats.availableRooms}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-7">
        <Link href="/booking">
          <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Book a Room
          </button>
        </Link>

        <Link href="/checkout">
          <button className="mt-6 px-6 py-3 bg-orange-400 text-white rounded-lg shadow hover:bg-orange-600 transition">
            Checkout Room
          </button>
        </Link>
        </div>
      </main>
    </div>
  );
}
