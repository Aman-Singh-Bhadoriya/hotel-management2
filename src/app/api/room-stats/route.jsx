import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(),  "src", "data", "rooms.json");
    const rooms = JSON.parse(await fs.readFile(filePath, "utf-8"));

    const { totalRooms, bookedRooms } = rooms.reduce(
      (acc, room) => {
        acc.totalRooms++;
        if (room.isBooked) acc.bookedRooms++;
        return acc;
      },
      { totalRooms: 0, bookedRooms: 0 }
    );

    return Response.json({ totalRooms, bookedRooms, availableRooms: totalRooms - bookedRooms });
  } catch (error) {
    console.error("Error fetching room stats:", error);
    return Response.json({ error: "Failed to load room statistics" }, { status: 500 });
  }
}
