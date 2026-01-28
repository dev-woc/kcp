"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";

interface Ride {
  id: string;
  rideNumber: number;
  date: string;
  location: string;
  checkInTime: string;
  rideTime: string;
  description?: string;
  isSpecialEvent: boolean;
  isCompleted: boolean;
}

export default function AdminRidesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRide, setEditingRide] = useState<Ride | null>(null);
  const [formData, setFormData] = useState({
    rideNumber: "",
    date: "",
    location: "",
    checkInTime: "8:00 AM",
    rideTime: "8:30 AM",
    description: "",
    isSpecialEvent: false,
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await fetch("/api/rides");
      const data = await response.json();
      setRides(data || []);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = "/api/rides";
      const method = editingRide ? "PATCH" : "POST";
      const body = editingRide
        ? { id: editingRide.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchRides();
        closeModal();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save ride");
      }
    } catch (error) {
      console.error("Error saving ride:", error);
      alert("Failed to save ride");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ride?")) return;

    try {
      const response = await fetch(`/api/rides?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchRides();
      }
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };

  const toggleCompleted = async (ride: Ride) => {
    try {
      const response = await fetch("/api/rides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ride.id, isCompleted: !ride.isCompleted }),
      });

      if (response.ok) {
        fetchRides();
      }
    } catch (error) {
      console.error("Error updating ride:", error);
    }
  };

  const openModal = (ride?: Ride) => {
    if (ride) {
      setEditingRide(ride);
      setFormData({
        rideNumber: ride.rideNumber.toString(),
        date: new Date(ride.date).toISOString().split("T")[0],
        location: ride.location,
        checkInTime: ride.checkInTime,
        rideTime: ride.rideTime,
        description: ride.description || "",
        isSpecialEvent: ride.isSpecialEvent,
      });
    } else {
      setEditingRide(null);
      setFormData({
        rideNumber: "",
        date: "",
        location: "",
        checkInTime: "8:00 AM",
        rideTime: "8:30 AM",
        description: "",
        isSpecialEvent: false,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRide(null);
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  const upcomingRides = rides.filter((r) => !r.isCompleted);
  const completedRides = rides.filter((r) => r.isCompleted);

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
            <Link href="/admin/bike-signups" className="text-gray-600 hover:text-gray-900">
              Bike Signups
            </Link>
            <Link href="/admin/rides" className="text-green-600 font-semibold border-b-2 border-green-600 pb-1">
              Ride Schedule
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ride Schedule</h2>
              <p className="text-gray-600">Manage upcoming and past bike rides</p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Ride
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{rides.length}</div>
            <div className="text-sm text-gray-600">Total Rides</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{upcomingRides.length}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-500">{completedRides.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {rides.filter((r) => r.isSpecialEvent).length}
            </div>
            <div className="text-sm text-gray-600">Special Events</div>
          </div>
        </div>

        {/* Upcoming Rides */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Upcoming Rides
          </h3>

          {upcomingRides.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No upcoming rides scheduled. Add one to get started!
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        #{ride.rideNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {new Date(ride.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ride.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ride.checkInTime} / {ride.rideTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ride.isSpecialEvent ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Special Event
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => toggleCompleted(ride)}
                          className="text-green-600 hover:text-green-800"
                          title="Mark as completed"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => openModal(ride)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ride.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Completed Rides */}
        {completedRides.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              Completed Rides
            </h3>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {completedRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50 opacity-75">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-600">
                        #{ride.rideNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {new Date(ride.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{ride.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ride.isSpecialEvent ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-50 text-yellow-600">
                            Special Event
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-500">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => toggleCompleted(ride)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Mark as not completed"
                        >
                          Reopen
                        </button>
                        <button
                          onClick={() => handleDelete(ride.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingRide ? "Edit Ride" : "Add New Ride"}
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ride Number *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.rideNumber}
                        onChange={(e) => setFormData({ ...formData, rideNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., 91"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Seminole Wekiva Trail"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Check-in Time *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.checkInTime}
                          onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="8:00 AM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ride Time *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.rideTime}
                          onChange={(e) => setFormData({ ...formData, rideTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="8:30 AM"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        rows={2}
                        placeholder="Additional details about the ride..."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isSpecialEvent"
                        checked={formData.isSpecialEvent}
                        onChange={(e) => setFormData({ ...formData, isSpecialEvent: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isSpecialEvent" className="ml-2 text-sm text-gray-700">
                        Special Event
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    {editingRide ? "Save Changes" : "Add Ride"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
