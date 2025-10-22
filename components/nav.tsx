"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Nav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdminPath = pathname?.startsWith("/admin");
  const isDashboardPath = pathname?.startsWith("/dashboard");
  const isHomePath = pathname?.startsWith("/home");

  return (
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

          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <span className="font-medium">Welcome, {session.user.name}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/home"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                      isHomePath ? "bg-green-50 text-green-600 font-semibold" : "text-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                      isDashboardPath ? "bg-green-50 text-green-600 font-semibold" : "text-gray-700"
                    }`}
                  >
                    My Application
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                        isAdminPath ? "bg-green-50 text-green-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      Admin Portal
                    </Link>
                  )}
                  <hr className="my-1" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
