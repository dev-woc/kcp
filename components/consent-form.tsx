"use client";

import { useState } from "react";

interface ConsentFormProps {
  onAccept: () => void;
}

export default function ConsentForm({ onAccept }: ConsentFormProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    if (bottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (isAccepted) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Consent and Agreement Form
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Please read and accept the terms below to continue with your application
          </p>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
          onScroll={handleScroll}
        >
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold text-gray-900">
              1. Purpose of Information Collection
            </h3>
            <p className="text-gray-700">
              The Keep Pedaling Foundation collects personal information through this
              application to assess eligibility for our Cycle of Support program,
              which provides mental health therapy services to qualifying individuals.
              By submitting this application, you acknowledge that your information
              will be reviewed by our team and used to determine program fit.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              2. Privacy and Confidentiality
            </h3>
            <p className="text-gray-700">
              We are committed to protecting your privacy. All information provided in
              this application will be kept confidential and secure. Your personal
              information will only be shared with authorized staff members, approved
              therapists in our network, and as required by law. We will not sell or
              share your information with third parties for marketing purposes.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              3. Use of Information
            </h3>
            <p className="text-gray-700">
              Your application information will be used to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Evaluate your eligibility for the program</li>
              <li>Match you with an appropriate therapist</li>
              <li>Track your participation in therapy sessions</li>
              <li>Communicate with you about your application status</li>
              <li>Improve our program services</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              4. Accuracy of Information
            </h3>
            <p className="text-gray-700">
              You confirm that all information provided in this application is accurate
              and truthful to the best of your knowledge. Providing false or misleading
              information may result in disqualification from the program.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              5. Program Commitment
            </h3>
            <p className="text-gray-700">
              If accepted into the program, you agree to commit to regular therapy
              sessions as outlined in the program guidelines. This includes attending
              weekly sessions, checking in monthly, and communicating with your
              assigned therapist.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              6. Voluntary Participation
            </h3>
            <p className="text-gray-700">
              Participation in this program is completely voluntary. You may withdraw
              your application at any time before acceptance. If accepted, you may
              discontinue services with proper notice to your therapist and the
              foundation.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              7. Data Retention
            </h3>
            <p className="text-gray-700">
              Your application data will be retained in our secure database for record
              keeping purposes. You may request to review or delete your information by
              contacting us directly.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              8. Consent to Contact
            </h3>
            <p className="text-gray-700">
              By submitting this application, you consent to be contacted by the Keep
              Pedaling Foundation via email, phone, or text message regarding your
              application status and program participation.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a draft consent form. The final wording
                will be updated with official legal language before program launch.
              </p>
            </div>
          </div>

          {!hasScrolledToBottom && (
            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-2 text-center">
              <p className="text-sm text-gray-500 italic">
                Please scroll to the bottom to continue
              </p>
            </div>
          )}
        </div>

        {/* Footer with Checkbox and Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="mb-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={(e) => setIsAccepted(e.target.checked)}
                disabled={!hasScrolledToBottom}
                className="form-checkbox mt-1 h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"
              />
              <span className="ml-3 text-sm text-gray-700">
                I have read and agree to the terms outlined above. I understand that by
                submitting this application, I consent to the collection, use, and
                storage of my personal information as described.
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAccept}
              disabled={!isAccepted}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Accept and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
