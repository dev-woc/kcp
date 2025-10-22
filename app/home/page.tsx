import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import { prisma } from "@/lib/prisma";

async function getMetrics() {
  const totalApprovedApplications = await prisma.application.count({
    where: { status: "approved" },
  });

  const totalCheckInSessions = await prisma.session.count();

  const totalApplications = await prisma.application.count();

  const totalTherapists = await prisma.therapist.count({
    where: { isActive: true },
  });

  // Get total number of Wednesday rides tracked via Strava
  const totalWednesdayRides = await prisma.activity.count({
    where: { isWednesdayRide: true },
  });

  const totalActivities = await prisma.activity.count();

  // Get aggregate statistics for all activities
  const activityStats = await prisma.activity.aggregate({
    _sum: {
      distance: true,
      movingTime: true,
      totalElevationGain: true,
    },
  });

  const stravaConnectedUsers = await prisma.user.count({
    where: { stravaAthleteId: { not: null } },
  });

  // Calculate fallback estimated rides if no Strava data
  const foundationStartDate = new Date("2024-01-01");
  const currentDate = new Date();
  const weeksPassed = Math.floor(
    (currentDate.getTime() - foundationStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
  );
  const estimatedRides = totalWednesdayRides > 0 ? totalWednesdayRides : weeksPassed;

  return {
    totalApprovedApplications,
    totalCheckInSessions,
    totalApplications,
    totalTherapists,
    estimatedRides,
    totalWednesdayRides,
    totalActivities,
    totalDistanceMiles: ((activityStats._sum.distance || 0) * 0.000621371).toFixed(1),
    totalElevationFeet: ((activityStats._sum.totalElevationGain || 0) * 3.28084).toFixed(0),
    stravaConnectedUsers,
  };
}

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const metrics = await getMetrics();

  const application = await prisma.application.findFirst({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Keep Pedaling Foundation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pedaling toward healing, resilience, and a brighter, healthier future
          </p>
        </div>

        {/* Quick Actions */}
        {!application ? (
          <div className="mb-12 bg-green-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg mb-6">
              Apply for the Cycle of Support program to access free therapy resources
            </p>
            <Link
              href="/apply"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Start Your Application
            </Link>
          </div>
        ) : application.status === "approved" ? (
          <div className="mb-12 bg-green-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="text-lg mb-6">
              Your application has been approved. Check in on your therapy sessions.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="mb-12 bg-blue-50 border-l-4 border-blue-400 p-6 rounded">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Application {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </h3>
            <p className="text-blue-800">
              Your application is currently being reviewed. Check your{" "}
              <Link href="/dashboard" className="underline font-medium">
                dashboard
              </Link>{" "}
              for updates.
            </p>
          </div>
        )}

        {/* Program Impact Metrics */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {metrics.estimatedRides}
              </div>
              <div className="text-gray-600 font-medium">Community Rides</div>
              <div className="text-sm text-gray-500 mt-1">Every Wednesday</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {metrics.totalCheckInSessions}
              </div>
              <div className="text-gray-600 font-medium">Therapy Sessions</div>
              <div className="text-sm text-gray-500 mt-1">Completed globally</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {metrics.totalApprovedApplications}
              </div>
              <div className="text-gray-600 font-medium">Lives Supported</div>
              <div className="text-sm text-gray-500 mt-1">Approved applicants</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {metrics.totalTherapists}
              </div>
              <div className="text-gray-600 font-medium">Partner Therapists</div>
              <div className="text-sm text-gray-500 mt-1">In our network</div>
            </div>
          </div>
        </div>

        {/* Strava Ride Statistics */}
        {metrics.stravaConnectedUsers > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Ride Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold mb-2">
                  {metrics.totalDistanceMiles}
                </div>
                <div className="font-medium">Miles Ridden</div>
                <div className="text-sm opacity-90 mt-1">
                  Tracked via Strava
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold mb-2">
                  {metrics.totalElevationFeet}
                </div>
                <div className="font-medium">Feet Climbed</div>
                <div className="text-sm opacity-90 mt-1">
                  Total elevation gain
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold mb-2">
                  {metrics.stravaConnectedUsers}
                </div>
                <div className="font-medium">Connected Riders</div>
                <div className="text-sm opacity-90 mt-1">
                  Tracking their progress
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About the Program */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              The Cycle of Support
            </h2>
            <p className="text-gray-700 mb-4">
              Our flagship program connects individuals with free, accessible therapy
              resources through a network of partnerships, sponsorships, and donations.
              We remove financial barriers to mental health care, ensuring everyone has
              access to the support they need.
            </p>
            <p className="text-gray-700">
              By combining the transformative power of cycling with mental health support,
              we create a community where physical well-being and emotional healing go
              hand in hand.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              The Keep Pedaling Foundation is committed to advancing mental health
              awareness and breaking down barriers to support. We believe in the power
              of movement, community, and connection to promote healing and resilience.
            </p>
            <p className="text-gray-700">
              Whether you're a seasoned rider or just beginning your journey, our weekly
              rides and mental health resources are here to support you every pedal of
              the way.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How the Cycle of Support Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600">
                Complete our application to share your story and therapy goals. Our team
                reviews each application with care.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Matched</h3>
              <p className="text-gray-600">
                Once approved, we connect you with a therapist from our network or help
                you work with your preferred provider.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Healing</h3>
              <p className="text-gray-600">
                Begin your therapy journey with weekly sessions, supported by our
                community and resources at no cost to you.
              </p>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Connect with others on their healing journey. Join us for weekly rides every
            Wednesday and be part of a community that supports mental health and wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://keeppedalingfoundation.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Visit Our Website
            </a>
            <a
              href="https://www.instagram.com/keeppedalingfoundation/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
