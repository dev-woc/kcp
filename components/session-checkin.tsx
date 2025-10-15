"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Session {
  id: string;
  checkInTime: string;
  sessionNumber: number;
  notes?: string;
  therapistName?: string;
  verified: boolean;
}

interface SessionCheckInProps {
  applicationStatus: string;
}

export default function SessionCheckIn({ applicationStatus }: SessionCheckInProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [formData, setFormData] = useState({
    sessionNumber: 1,
    notes: "",
    therapistName: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCheckingIn(true);

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Refresh sessions
      await fetchSessions();
      setShowCheckInForm(false);
      setFormData({ sessionNumber: 1, notes: "", therapistName: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCheckingIn(false);
    }
  };

  // Determine next session number
  const getNextSessionNumber = () => {
    if (sessions.length === 0) return 1;
    const sessionNumbers = sessions.map((s) => s.sessionNumber);
    const maxSession = Math.max(...sessionNumbers);
    return maxSession < 4 ? maxSession + 1 : null;
  };

  const nextSession = getNextSessionNumber();

  if (applicationStatus !== "approved") {
    return null; // Don't show check-in for non-approved users
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Therapy Sessions</h2>
        {nextSession && !showCheckInForm && (
          <button
            onClick={() => setShowCheckInForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            Check In - Session {nextSession}
          </button>
        )}
      </div>

      {/* Check-in Form */}
      {showCheckInForm && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Check In for Session {nextSession}
          </h3>
          <form onSubmit={handleCheckIn} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Number
              </label>
              <select
                value={formData.sessionNumber}
                onChange={(e) =>
                  setFormData({ ...formData, sessionNumber: Number(e.target.value) })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option
                    key={num}
                    value={num}
                    disabled={sessions.some((s) => s.sessionNumber === num)}
                  >
                    Session {num} {sessions.some((s) => s.sessionNumber === num) && "(Completed)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Therapist Name (Optional)
              </label>
              <input
                type="text"
                value={formData.therapistName}
                onChange={(e) =>
                  setFormData({ ...formData, therapistName: e.target.value })
                }
                placeholder="Dr. Jane Smith"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="How did this session go? Any notes you'd like to share..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={checkingIn}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {checkingIn ? "Checking In..." : "Check In"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCheckInForm(false);
                  setError("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Session History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session History</h3>
        {loading ? (
          <p className="text-gray-600">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-600">
            No sessions yet. Check in when you attend your first therapy session!
          </p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    Session {session.sessionNumber}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {session.verified && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        ✓ Verified
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      {new Date(session.checkInTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                {session.therapistName && (
                  <p className="text-sm text-gray-600">
                    <strong>Therapist:</strong> {session.therapistName}
                  </p>
                )}
                {session.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Notes:</strong> {session.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {sessions.length === 4 && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            🎉 Congratulations! You've completed all 4 sessions for this month!
          </div>
        )}
      </div>
    </div>
  );
}
