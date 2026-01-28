import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedRides() {
  console.log("Seeding January 2026 rides...");

  const rides = [
    {
      rideNumber: 91,
      date: new Date("2026-01-03T08:00:00"),
      location: "Seminole Wekiva Trail",
      checkInTime: "8:00 AM",
      rideTime: "8:30 AM",
      isSpecialEvent: false,
      isCompleted: true, // Past ride
    },
    {
      rideNumber: 92,
      date: new Date("2026-01-10T08:00:00"),
      location: "Cady Way/Urban Trail",
      checkInTime: "8:00 AM",
      rideTime: "8:30 AM",
      isSpecialEvent: false,
      isCompleted: true, // Past ride
    },
    {
      rideNumber: 93,
      date: new Date("2026-01-17T08:00:00"),
      location: "Seminole Wekiva Trail",
      checkInTime: "8:00 AM",
      rideTime: "8:30 AM",
      isSpecialEvent: false,
      isCompleted: true, // Past ride
    },
    {
      rideNumber: 94,
      date: new Date("2026-01-24T08:00:00"),
      location: "Cady Way/Urban Trail",
      checkInTime: "8:00 AM",
      rideTime: "8:30 AM",
      isSpecialEvent: false,
      isCompleted: true, // Past ride
    },
    {
      rideNumber: 95,
      date: new Date("2026-01-31T08:00:00"),
      location: "RTW Creative Space + Studio",
      checkInTime: "8:00 AM",
      rideTime: "8:45 AM",
      isSpecialEvent: true,
      isCompleted: false, // Upcoming ride
    },
  ];

  for (const ride of rides) {
    try {
      await prisma.ride.upsert({
        where: { rideNumber: ride.rideNumber },
        update: ride,
        create: ride,
      });
      console.log(`  ✓ Ride #${ride.rideNumber} - ${ride.location}`);
    } catch (error) {
      console.error(`  ✗ Failed to seed ride #${ride.rideNumber}:`, error);
    }
  }

  console.log("\nDone seeding rides!");
}

seedRides()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
