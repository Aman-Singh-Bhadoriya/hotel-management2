import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  try {
    const filePath = path.join(process.cwd(), "src", "public", "rooms.json");

    // Read and parse room data
    const rooms = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const roomMap = new Map(rooms.map(room => [room.id, room])); // O(1) lookup

    // Parse request body
    const { roomNumbers } = await req.json();
    if (!Array.isArray(roomNumbers) || roomNumbers.length === 0)
      return Response.json({ error: "At least one room number is required." }, { status: 400 });

    if (roomNumbers.length > 5)
      return Response.json({ error: "You can only checkout up to 5 rooms at a time." }, { status: 400 });

    let checkedOutRooms = [];
    let warnings = [];

    // Process each room
    for (const roomId of roomNumbers) {
      if (!roomMap.has(roomId)) {
        warnings.push(`Room ${roomId} does not exist.`);
        continue;
      }

      const room = roomMap.get(roomId);
      if (!room.isBooked) {
        warnings.push(`Room ${roomId} is already available.`);
        continue;
      }

      // Checkout the room
      room.isBooked = false;
      checkedOutRooms.push(roomId);
    }

    if (checkedOutRooms.length === 0)
      return Response.json({ error: warnings.join(" ") }, { status: 400 });

    // Save updated data back to JSON
    await fs.writeFile(filePath, JSON.stringify([...roomMap.values()], null, 2));

    return Response.json({ message: "Checkout successful", checkedOutRooms, warnings });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
