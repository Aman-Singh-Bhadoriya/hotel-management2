"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [roomNumbers, setRoomNumbers] = useState("");
  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    const roomArray = roomNumbers
      .split(",")
      .map(num => parseInt(num.trim(), 10))
      .filter(num => num) // Removes NaN values
      .slice(0, 5); // Max 5 rooms

    if (!roomArray.length) return setMessage("Enter at least one valid room number.");
    
    try {
      const res = await fetch("/api/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumbers: roomArray }),
      });

      const data = await res.json();
      setMessage(res.ok 
        ? `Checkout successful! Rooms: ${data.checkedOutRooms?.join(", ")}. ${data.warnings?.join(" ") || ""}` 
        : data.error || "Checkout failed."
      );
    } catch {
      setMessage("Error checking out. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Multiple Room Checkout</h2>
        <input
          type="text"
          placeholder="Enter Room Numbers (e.g. 101, 102)"
          value={roomNumbers}
          onChange={(e) => setRoomNumbers(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <button 
          onClick={handleCheckout} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Checkout
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </div>
    </div>
  );
}
