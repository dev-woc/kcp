import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

async function getRides() {
  const rides = await prisma.ride.findMany({
    orderBy: { date: "asc" },
  });
  return rides;
}

function getMonthDay(date: Date) {
  const d = new Date(date);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
  };
}

export default async function SchedulePage() {
  const rides = await getRides();

  const upcomingRides = rides.filter((ride) => !ride.isCompleted);
  const completedRides = rides.filter((ride) => ride.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo_new.png"
                alt="Keep Pedaling Foundation Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-green-600">Keep Pedaling Foundation</span>
            </Link>
            <Link
              href="/bike-signup"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Sign Up for a Ride
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cycling Schedule
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us for our weekly community rides. All levels welcome!
          </p>
        </div>

        {/* Upcoming Rides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Upcoming Rides
          </h2>

          {upcomingRides.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">🚴</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-600">
                New rides are being scheduled. Check back soon or follow us on Instagram for updates!
              </p>
              <a
                href="https://www.instagram.com/keeppedalingfoundation/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                @keeppedalingfoundation
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingRides.map((ride) => {
                const { day, month } = getMonthDay(ride.date);
                return (
                  <div
                    key={ride.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                      ride.isSpecialEvent ? "border-yellow-500" : "border-green-500"
                    }`}
                  >
                    <div className="flex">
                      {/* Date Box */}
                      <div className="bg-gray-900 text-white p-4 flex flex-col items-center justify-center min-w-[80px]">
                        <span className="text-3xl font-bold">{day}</span>
                        <span className="text-sm font-medium text-green-400">{month}</span>
                      </div>

                      {/* Ride Details */}
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Ride #{ride.rideNumber}
                              {ride.isSpecialEvent && (
                                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  Special Event
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600 font-medium">{ride.location}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Check-in: {ride.checkInTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Ride: {ride.rideTime}
                          </div>
                        </div>

                        {ride.description && (
                          <p className="mt-2 text-sm text-gray-500">{ride.description}</p>
                        )}
                      </div>

                      {/* Sign Up Button */}
                      <div className="p-4 flex items-center">
                        <Link
                          href="/bike-signup"
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium whitespace-nowrap"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Completed Rides */}
        {completedRides.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              Completed Rides
            </h2>

            <div className="space-y-3">
              {completedRides.map((ride) => {
                const { day, month } = getMonthDay(ride.date);
                return (
                  <div
                    key={ride.id}
                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 opacity-75"
                  >
                    <div className="flex items-center">
                      {/* Date Box */}
                      <div className="bg-gray-300 text-gray-700 p-3 flex flex-col items-center justify-center min-w-[60px]">
                        <span className="text-xl font-bold">{day}</span>
                        <span className="text-xs font-medium">{month}</span>
                      </div>

                      {/* Ride Details */}
                      <div className="p-3 flex-1">
                        <h3 className="font-semibold text-gray-700">
                          Ride #{ride.rideNumber}
                          {ride.isSpecialEvent && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              Special Event
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{ride.location}</p>
                      </div>

                      {/* Completed Badge */}
                      <div className="p-3">
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Info Section */}
        <section className="mt-12 bg-green-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Ride?</h2>
          <p className="mb-6 max-w-xl mx-auto">
            All skill levels are welcome. We have two groups: a cruising group for leisurely rides
            and an exercise group for those seeking more intensity. Bike rentals available!
          </p>
          <Link
            href="/bike-signup"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Sign Up Now
          </Link>
        </section>
      </main>
    </div>
  );
}
