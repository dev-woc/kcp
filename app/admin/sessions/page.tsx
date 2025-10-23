"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";

interface Session {
  id: string;
  checkInTime: string;
  sessionNumber: number;
  notes?: string;
  therapistName?: string;
  adminNotes?: string;
  verified: boolean;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminSessionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    verified: false,
    adminNotes: "",
    therapistName: "",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/admin/sessions");
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session.id);
    setEditForm({
      verified: session.verified,
      adminNotes: session.adminNotes || "",
      therapistName: session.therapistName || "",
    });
  };

  const handleSave = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchSessions();
        setEditingSession(null);
      }
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session check-in?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSessions();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  const stats = {
    total: sessions.length,
    verified: sessions.filter((s) => s.verified).length,
    unverified: sessions.filter((s) => !s.verified).length,
    uniqueUsers: new Set(sessions.map((s) => s.user.email)).size,
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
            <Link href="/admin/sessions" className="text-green-600 font-semibold border-b-2 border-green-600 pb-1">
              Sessions
            </Link>
            <Link href="/admin/therapists" className="text-gray-600 hover:text-gray-900">
              Therapists
            </Link>
            <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
              Users
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Session Check-Ins</h2>
          <p className="text-gray-600">Track and verify therapy session attendance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Check-Ins</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.unverified}</div>
            <div className="text-sm text-gray-600">Unverified</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.uniqueUsers}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No session check-ins yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sessions.map((sess) => (
                <div key={sess.id} className="p-6">
                  {editingSession === sess.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          {sess.user.name} - Session {sess.sessionNumber}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(sess.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSession(null)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Therapist Name
                          </label>
                          <input
                            type="text"
                            value={editForm.therapistName}
                            onChange={(e) =>
                              setEditForm({ ...editForm, therapistName: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.verified}
                              onChange={(e) =>
                                setEditForm({ ...editForm, verified: e.target.checked })
                              }
                              className="form-checkbox"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Mark as Verified
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Admin Notes
                        </label>
                        <textarea
                          value={editForm.adminNotes}
                          onChange={(e) =>
                            setEditForm({ ...editForm, adminNotes: e.target.value })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {sess.user.name} ({sess.user.email})
                          </h3>
                          <p className="text-sm text-gray-600">
                            Session {sess.sessionNumber} •{" "}
                            {new Date(sess.checkInTime).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {sess.verified && (
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
                              ✓ Verified
                            </span>
                          )}
                          <button
                            onClick={() => handleEdit(sess)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sess.id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {sess.therapistName && (
                          <div>
                            <span className="font-medium text-gray-700">Therapist:</span>{" "}
                            {sess.therapistName}
                          </div>
                        )}
                        {sess.notes && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">User Notes:</span>{" "}
                            {sess.notes}
                          </div>
                        )}
                        {sess.adminNotes && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">Admin Notes:</span>{" "}
                            {sess.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
