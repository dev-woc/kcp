"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";

interface BikeSignup {
  id: string;
  name: string;
  email: string;
  instagramHandle?: string;
  rideGroup: string;
  needsBikeRental: boolean;
  driversLicenseUrl?: string;
  generalConsentAccepted: boolean;
  rentalConsentAccepted: boolean;
  submittedAt: string;
  rideDate?: string;
}

interface GroupedSignups {
  [date: string]: BikeSignup[];
}

export default function AdminBikeSignupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [signups, setSignups] = useState<BikeSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignup, setSelectedSignup] = useState<BikeSignup | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      const response = await fetch("/api/bike-signup");
      const data = await response.json();
      setSignups(data.signups || []);
    } catch (error) {
      console.error("Error fetching bike signups:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  // Group signups by week/event
  const groupedSignups: GroupedSignups = signups.reduce((acc, signup) => {
    const date = new Date(signup.submittedAt);
    const weekKey = signup.rideDate
      ? new Date(signup.rideDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Upcoming Wednesday Ride";

    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(signup);
    return acc;
  }, {} as GroupedSignups);

  const stats = {
    total: signups.length,
    cruising: signups.filter((s) => s.rideGroup === "cruising").length,
    exercise: signups.filter((s) => s.rideGroup === "exercise").length,
    needingBikes: signups.filter((s) => s.needsBikeRental).length,
    withInstagram: signups.filter((s) => s.instagramHandle).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              Applications
            </Link>
            <Link href="/admin/sessions" className="text-gray-600 hover:text-gray-900">
              Sessions
            </Link>
            <Link href="/admin/therapists" className="text-gray-600 hover:text-gray-900">
              Therapists
            </Link>
            <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
              Users
            </Link>
            <Link href="/admin/bike-signups" className="text-green-600 font-semibold border-b-2 border-green-600 pb-1">
              Bike Signups
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bike Ride Signups</h2>
          <p className="text-gray-600">Manage weekly Wednesday bike ride registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Signups</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.cruising}</div>
            <div className="text-sm text-gray-600">Cruising Group</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{stats.exercise}</div>
            <div className="text-sm text-gray-600">Exercise Group</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{stats.needingBikes}</div>
            <div className="text-sm text-gray-600">Need Bike Rental</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-pink-600">{stats.withInstagram}</div>
            <div className="text-sm text-gray-600">In IG Group</div>
          </div>
        </div>

        {/* Signups by Event */}
        {Object.keys(groupedSignups).length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No bike signups yet
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSignups)
              .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
              .map(([eventDate, eventSignups]) => (
                <div key={eventDate} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                    <h3 className="text-lg font-semibold text-gray-900">{eventDate}</h3>
                    <p className="text-sm text-gray-600">
                      {eventSignups.length} {eventSignups.length === 1 ? "participant" : "participants"}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Instagram
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ride Group
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bike Rental
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {eventSignups.map((signup) => (
                          <tr key={signup.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{signup.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{signup.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {signup.instagramHandle ? (
                                  <a
                                    href={`https://instagram.com/${signup.instagramHandle.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-600 hover:text-pink-800"
                                  >
                                    {signup.instagramHandle}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  signup.rideGroup === "cruising"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {signup.rideGroup === "cruising" ? "Cruising" : "Exercise"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {signup.needsBikeRental ? (
                                <span className="text-purple-600 font-medium text-sm">Yes</span>
                              ) : (
                                <span className="text-gray-400 text-sm">No</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => setSelectedSignup(signup)}
                                className="text-green-600 hover:text-green-900"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedSignup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Signup Details</h3>
                  <button
                    onClick={() => setSelectedSignup(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">{selectedSignup.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{selectedSignup.email}</p>
                  </div>

                  {selectedSignup.instagramHandle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Instagram Handle</label>
                      <p className="mt-1 text-gray-900">
                        <a
                          href={`https://instagram.com/${selectedSignup.instagramHandle.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800"
                        >
                          {selectedSignup.instagramHandle}
                        </a>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ride Group</label>
                    <p className="mt-1">
                      <span
                        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          selectedSignup.rideGroup === "cruising"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {selectedSignup.rideGroup === "cruising" ? "Cruising" : "Exercise"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Needs Bike Rental</label>
                    <p className="mt-1 text-gray-900">
                      {selectedSignup.needsBikeRental ? "Yes" : "No"}
                    </p>
                  </div>

                  {selectedSignup.needsBikeRental && selectedSignup.driversLicenseUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Driver's License</label>
                      <img
                        src={selectedSignup.driversLicenseUrl}
                        alt="Driver's License"
                        className="max-w-full h-auto rounded border border-gray-300"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Waivers Signed</label>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-600">
                        ✓ General Waiver: {selectedSignup.generalConsentAccepted ? "Yes" : "No"}
                      </p>
                      {selectedSignup.needsBikeRental && (
                        <p className="text-sm text-gray-600">
                          ✓ Rental Agreement: {selectedSignup.rentalConsentAccepted ? "Yes" : "No"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedSignup.submittedAt).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedSignup(null)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
