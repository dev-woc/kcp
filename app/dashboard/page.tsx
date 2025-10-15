import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import SessionCheckIn from "@/components/session-checkin";
import Nav from "@/components/nav";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const session = await getServerSession();
  const params = await searchParams;
  if (!session) {
    redirect("/login");
  }

  // Redirect admins to admin portal
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  const application = await prisma.application.findFirst({
    where: { userId: session.user.id },
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewing: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {params.submitted && (
          <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            Application submitted successfully! We'll review your application and get back to you soon.
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Dashboard</h2>

          {!application ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                You haven't submitted an application yet
              </h3>
              <p className="text-gray-600 mb-6">
                Apply for the Cycle of Support program to get started
              </p>
              <Link
                href="/apply"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Start Application
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Your Application</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[application.status as keyof typeof statusColors]
                  }`}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Submitted On</h4>
                  <p className="text-gray-900">
                    {new Date(application.submittedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Email</h4>
                  <p className="text-gray-900">{application.email}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Phone</h4>
                  <p className="text-gray-900">{application.phone}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Location</h4>
                  <p className="text-gray-900">{application.cityState}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-700 mb-2">Current Challenges</h4>
                <div className="flex flex-wrap gap-2">
                  {application.currentChallenges.map((challenge) => (
                    <span
                      key={challenge}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {challenge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-700 mb-2">Therapy Goals</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{application.therapyGoals}</p>
              </div>

              {application.introVideoUrl && (
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-700 mb-2">Introduction Video</h4>
                  <a
                    href={application.introVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    View Video
                  </a>
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                <p className="text-sm text-blue-700">
                  {application.status === "pending" && "Your application is being reviewed. We'll notify you of any updates."}
                  {application.status === "reviewing" && "Your application is currently under review by our team."}
                  {application.status === "approved" && "Congratulations! Your application has been approved. We'll contact you soon with next steps."}
                  {application.status === "rejected" && "Thank you for your interest. Unfortunately, we were unable to accept your application at this time."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Session Check-In (only shown for approved applications) */}
        {application && application.status === "approved" && (
          <div className="mt-8">
            <SessionCheckIn applicationStatus={application.status} />
          </div>
        )}
      </main>
    </div>
  );
}
