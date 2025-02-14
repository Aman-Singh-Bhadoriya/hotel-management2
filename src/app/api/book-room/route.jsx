import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const filePathRooms = path.join(process.cwd(), "src", "public", "rooms.json");
    const filePathBookings = path.join(process.cwd(), "src", "public", "bookings.json");

    // Read room and booking data
    const roomList = JSON.parse(fs.readFileSync(filePathRooms, "utf-8"));
    const bookingList = JSON.parse(fs.readFileSync(filePathBookings, "utf-8"));

    const { name, mobile, email, roomsRequested } = await req.json();

    if (!name || !mobile || !email || roomsRequested < 1 || roomsRequested > 5) {
      return new Response(JSON.stringify({ error: "Invalid booking request" }), { status: 400 });
    }

    let availableRooms = roomList.filter(room => !room.isBooked);
    if (availableRooms.length < roomsRequested) {
      return new Response(JSON.stringify({ error: "Not enough rooms available" }), { status: 400 });
    }

    availableRooms.sort((a, b) => a.floor - b.floor || a.id - b.id);

    let bookedRooms = availableRooms.slice(0, roomsRequested);
    bookedRooms.forEach(room => {
      let index = roomList.findIndex(r => r.id === room.id);
      roomList[index].isBooked = true;
    });

    let totalTravelTime = 0;
    let sortedRooms = bookedRooms.sort((a, b) => a.floor - b.floor || a.id - b.id);
    
    const getLeftmostRoom = (floor) => Math.min(...roomList.filter(r => r.floor === floor).map(r => r.id));

    for (let i = 1; i < sortedRooms.length; i++) {
      let prevRoom = sortedRooms[i - 1];
      let currRoom = sortedRooms[i];

      if (prevRoom.floor === currRoom.floor) {
        // Travel time on the same floor (1 min per skipped room)
        totalTravelTime += Math.abs(prevRoom.id - currRoom.id);
      } else {
        // Moving between floors:
        const prevLeftmost = getLeftmostRoom(prevRoom.floor);
        const currLeftmost = getLeftmostRoom(currRoom.floor);

        // Travel to the staircase first
        totalTravelTime += Math.abs(prevRoom.id - prevLeftmost);

        // Vertical travel time
        totalTravelTime += Math.abs(prevRoom.floor - currRoom.floor) * 2;

        // Travel from the staircase to the destination room
        totalTravelTime += Math.abs(currRoom.id - currLeftmost);
      }
    }

    const newBooking = {
      id: bookingList.length + 1,
      name,
      mobile,
      email,
      rooms: bookedRooms.map(room => room.id),
      totalTravelTime,
      date: new Date().toISOString(),
    };

    bookingList.push(newBooking);
    console.log(newBooking);

    // Save updated data
    fs.writeFileSync(filePathRooms, JSON.stringify(roomList, null, 2));
    fs.writeFileSync(filePathBookings, JSON.stringify(bookingList, null, 2));

    return new Response(JSON.stringify({ message: "Booking successful", booking: newBooking }), { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
