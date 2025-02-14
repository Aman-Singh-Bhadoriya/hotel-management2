"use client"
import { useRouter } from "next/navigation";

const router = useRouter();

const handleViewBookings = () => {
  router.push("/pages/BookingSummary");
};

<button onClick={handleViewBookings} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
  View Booking Summary
</button>
