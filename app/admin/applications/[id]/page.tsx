"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ApplicationDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  cityState: string;
  therapyExperience: string;
  hasInsurance: string;
  currentChallenges: string[];
  testimonialWillingness: string;
  mentalHealthDescription: string;
  therapyReason: string;
  therapyGoals: string;
  weeklyAvailability: string;
  hasDevice: string;
  therapyBarriers: string;
  introVideoUrl?: string;
  status: string;
  submittedAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${params.id}`);
      const data = await response.json();
      setApplication(data.application);
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchApplication();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user.role !== "admin" || !application) {
    return null;
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewing: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Admin Portal</h1>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Back to Applications
              </Link>
              <Link href="/api/auth/signout" className="text-gray-600 hover:text-gray-900">
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Application Details</h2>
            <div className="flex items-center space-x-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  statusColors[application.status as keyof typeof statusColors]
                }`}
              >
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Status Update */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => updateStatus("pending")}
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
              >
                Pending
              </button>
              <button
                onClick={() => updateStatus("reviewing")}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
              >
                Reviewing
              </button>
              <button
                onClick={() => updateStatus("approved")}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus("rejected")}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
              >
                Reject
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-gray-900">{application.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{application.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{application.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-gray-900">{application.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-gray-900">{application.cityState}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Submitted On</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(application.submittedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </section>

            {/* Therapy Background */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Therapy Background
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Previous Therapy Experience
                  </label>
                  <p className="mt-1 text-gray-900">{application.therapyExperience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Has Insurance</label>
                  <p className="mt-1 text-gray-900">{application.hasInsurance}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Current Challenges
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
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
              </div>
            </section>

            {/* Mental Health & Goals */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Mental Health & Goals
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mental/Emotional Health Description
                  </label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {application.mentalHealthDescription}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Reason for Starting Therapy
                  </label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {application.therapyReason}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Therapy Goals</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {application.therapyGoals}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Therapy Barriers</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {application.therapyBarriers}
                  </p>
                </div>
              </div>
            </section>

            {/* Logistics */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Logistics
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Weekly Availability
                  </label>
                  <p className="mt-1 text-gray-900">{application.weeklyAvailability}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Has Device</label>
                  <p className="mt-1 text-gray-900">{application.hasDevice}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Testimonial Willingness
                  </label>
                  <p className="mt-1 text-gray-900">{application.testimonialWillingness}</p>
                </div>
              </div>
            </section>

            {/* Video */}
            {application.introVideoUrl && (
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                  Introduction Video
                </h3>
                <a
                  href={application.introVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Introduction Video
                </a>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
