import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Keep Pedaling Foundation</h1>
            <div className="space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-6">
            Cycle of Support Program
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The Keep Pedaling Foundation offers free therapy for one month to three selected
            individuals. We believe everyone deserves access to mental health support.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto mb-8">
            <p className="text-sm text-yellow-700">
              <strong>Application Deadline:</strong> November 16th, 2025 at 11:59 PM
            </p>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-2xl font-semibold text-gray-800">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                <h4 className="font-semibold mb-2">Create Account</h4>
                <p className="text-gray-600">Sign up for a free account to get started</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
                <h4 className="font-semibold mb-2">Submit Application</h4>
                <p className="text-gray-600">Fill out the application form with your information</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
                <h4 className="font-semibold mb-2">Get Matched</h4>
                <p className="text-gray-600">Our team reviews and selects three recipients</p>
              </div>
            </div>
          </div>

          <Link
            href="/signup"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </main>

      <footer className="bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2025 Keep Pedaling Foundation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
