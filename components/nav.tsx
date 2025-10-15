"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Keep Pedaling Foundation
          </Link>
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                {session.user.role === "admin" && (
                  <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Admin Portal
                  </Link>
                )}
                <span className="text-gray-700">Welcome, {session.user.name}</span>
                <Link
                  href="/api/auth/signout"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
