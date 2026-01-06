"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import Link from "next/link";

export default function BikeSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "general-waiver" | "rental-waiver" | "complete">("form");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagramHandle: "",
    rideGroup: "",
    needsBikeRental: "",
  });

  const [driversLicenseFile, setDriversLicenseFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("driversLicenseUploader", {
    onClientUploadComplete: () => {
      setUploadProgress(100);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.rideGroup || !formData.needsBikeRental) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setStep("general-waiver");
  };

  const handleGeneralWaiverAccept = () => {
    if (formData.needsBikeRental === "yes") {
      setStep("rental-waiver");
    } else {
      submitSignup();
    }
  };

  const handleRentalWaiverAccept = () => {
    submitSignup();
  };

  const submitSignup = async () => {
    setLoading(true);
    setError("");

    try {
      let driversLicenseUrl = "";

      // Upload driver's license if needed
      if (formData.needsBikeRental === "yes" && driversLicenseFile) {
        const uploadResult = await startUpload([driversLicenseFile]);
        if (uploadResult && uploadResult[0]) {
          driversLicenseUrl = uploadResult[0].url;
        }
      }

      const response = await fetch("/api/bike-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          instagramHandle: formData.instagramHandle || null,
          rideGroup: formData.rideGroup,
          needsBikeRental: formData.needsBikeRental === "yes",
          driversLicenseUrl: driversLicenseUrl || null,
          generalConsentAccepted: true,
          generalConsentAcceptedAt: new Date().toISOString(),
          rentalConsentAccepted: formData.needsBikeRental === "yes",
          rentalConsentAcceptedAt: formData.needsBikeRental === "yes" ? new Date().toISOString() : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setStep("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for signing up for our Wednesday bike ride! We'll be in touch with more details.
          </p>
          {formData.instagramHandle && (
            <p className="text-gray-600 mb-6">
              Look out for an Instagram group chat invite at @{formData.instagramHandle}
            </p>
          )}
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (step === "general-waiver") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Accident Waiver and Release of Liability</h1>

          <div className="prose max-w-none mb-8 text-sm text-gray-700 space-y-4 max-h-96 overflow-y-auto border border-gray-200 p-6 rounded">
            <p><strong>Name of the Entity(s):</strong><br />
            Keep Pedaling Foundation, DBA Keep Pedaling Cycling Club, and its administrators, along with all other persons, firms, employees, guest teachers, corporations, associations, or partnerships.</p>

            <p>I HEREBY ASSUME ALL OF THE RISKS OF PARTICIPATING AND/OR VOLUNTEERING IN THIS ACTIVITY OR EVENT, including, but not limited to, any risks that may arise from negligence or carelessness on the part of the persons or entities being released from dangerous or defective equipment or property owned, maintained, or controlled by them, or because of their possible liability without fault.</p>

            <p>I certify that I am physically fit, have sufficiently prepared or trained for participation in the activity or event, and have not been ADVISED against participating by a qualified medical professional. I certify that there are no health-related reasons or problems that preclude my participation in this activity or event.</p>

            <p>I acknowledge that this Accident Waiver and Release of Liability will be used by the holders, sponsors, and organizers of the activity or event in which I may participate, and it will govern my actions and responsibilities at said activity or event.</p>

            <p>I WAIVE, RELEASE, AND DISCHARGE the Keep Pedaling Foundation, DBA Keep Pedaling Cycling Club, and all entities or persons involved from any and all liability, including but not limited to liability arising from negligence or fault, for my death, disability, personal injury, property damage, property theft, or actions of any kind that may occur to me, including my travel to and from this event.</p>

            <p>I INDEMNIFY, HOLD HARMLESS, AND PROMISE NOT TO SUE the entities or persons mentioned in this paragraph from any and all liabilities or claims made as a result of my participation in this activity or event, whether caused by negligence or otherwise.</p>

            <p>I acknowledge that the Keep Pedaling Foundation and its DBA Keep Pedaling Cycling Club are NOT responsible for errors, omissions, acts, or failures to act of any party or entity conducting a specific event or activity. I also acknowledge that this event may involve testing my physical and mental limits and may carry the potential for death, serious injury, and property loss. The risks include but are not limited to those caused by terrain, facilities, weather, condition of participants, equipment, vehicular traffic, and actions of others.</p>

            <p><strong>Helmet Recommendation and Liability Disclaimer</strong><br />
            I understand that the Keep Pedaling Foundation and Keep Pedaling Cycling Club highly recommend that all participants wear helmets while cycling for their safety. I acknowledge that if I choose not to wear a helmet, I do so at my own risk, and I release the Keep Pedaling Foundation and Keep Pedaling Cycling Club from any responsibility for injuries or damages resulting from not wearing a helmet. I agree that I alone assume all liability for any injury that may occur because of not wearing a helmet.</p>

            <p>I consent to receive medical treatment deemed advisable in the event of injury, accident, and/or illness during this activity or event.</p>

            <p>I understand that at this event or related activities, I may be photographed or recorded on video. I agree to allow my photo, video, or film likeness to be used for any legitimate purpose by the Keep Pedaling Foundation, DBA Keep Pedaling Cycling Club, its event holders, producers, sponsors, organizers, and assigns.</p>

            <p><strong>COVID-19 Acknowledgment:</strong><br />
            Considering the ongoing COVID-19 pandemic, I agree to the following:</p>

            <ul className="list-disc pl-6">
              <li>I affirm that I, as well as all household members, do not currently, nor have experienced COVID-19 symptoms (fever, fatigue, dry cough, difficulty breathing) within the last 14 days.</li>
              <li>I affirm that I, as well as all household members, have not been diagnosed with COVID-19 within the past 30 days.</li>
              <li>I affirm that I, as well as all household members, have not knowingly been exposed to anyone diagnosed with COVID-19 within the past 30 days.</li>
              <li>I affirm that I, as well as all household members, have not traveled outside of the country or to any city considered a "hot spot" for COVID-19 infections within the past 30 days.</li>
              <li>I understand that the Keep Pedaling Foundation and Keep Pedaling Cycling Club cannot be held liable for any exposure to the COVID-19 virus caused by misinformation on this form or by any health history provided by participants.</li>
            </ul>

            <p>I CERTIFY THAT I HAVE READ AND FULLY UNDERSTAND THE CONTENTS OF THIS DOCUMENT. I AM AWARE THAT THIS IS A RELEASE OF LIABILITY AND A BINDING CONTRACT, AND I AM SIGNING IT OF MY OWN FREE WILL.</p>
          </div>

          <div className="border-t pt-6">
            <label className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                id="general-consent"
                className="mt-1 h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                required
              />
              <span className="text-sm text-gray-700">
                <strong>I Agree</strong> - This will serve as your digital signature
              </span>
            </label>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  const checkbox = document.getElementById("general-consent") as HTMLInputElement;
                  if (!checkbox.checked) {
                    setError("You must agree to the waiver to continue");
                    return;
                  }
                  setError("");
                  handleGeneralWaiverAccept();
                }}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Accept and Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "rental-waiver") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Bike Rental Agreement</h1>

          <div className="prose max-w-none mb-8 text-sm text-gray-700 space-y-4 max-h-96 overflow-y-auto border border-gray-200 p-6 rounded">
            <p><strong>1. Condition of the Bike</strong><br />
            Before riding, I will inspect the bicycle for any visible damages or issues and found none. If I do see damage I will let the provider know.</p>

            <p><strong>2. Liability for Damages</strong><br />
            I agree to be fully responsible for any damage, loss, or theft of the rented bicycle during the rental period. I will be held liable for any repairs or replacements needed due to damage caused while the bicycle is in my possession, as assessed by the Provider or an approved repair facility.</p>

            <p><strong>Payment for Damages:</strong> In the event of damage to the rented bicycle, I agree to pay for any necessary repairs or the full replacement cost of the bicycle if the damage is deemed irreparable.</p>

            <p><strong>Payment Due:</strong> I understand that payment for any damage must be made within two (2) weeks of the incident.</p>

            <p><strong>3. Safe Use of the Bicycle</strong><br />
            I agree to operate the bicycle in a safe and responsible manner at all times and to adhere to all traffic laws and safety guidelines. I understand that improper use of the bicycle may result in damage for which I will be held liable.</p>

            <p><strong>4. Assumption of Risk</strong><br />
            I acknowledge that cycling involves inherent risks, including but not limited to injury or accidents caused by terrain, weather, other cyclists, vehicles, or mechanical failure. I voluntarily assume all risks associated with the use of the rented bicycle.</p>

            <p><strong>5. Indemnification</strong><br />
            I agree to indemnify and hold harmless the Keep Pedaling Foundation and any associated parties from any claims, demands, or legal actions arising from my use of the rented bicycle, including injuries or damages to myself or others.</p>

            <p><strong>6. Legal Fees</strong><br />
            In the event of legal action arising from damages, I agree to be responsible for any legal fees, court costs, and other related expenses incurred by the Provider to enforce this agreement or seek compensation for damages.</p>

            <p><strong>7. Acknowledgment and Agreement</strong><br />
            By clicking "I agree" servers as your signature to this waiver, I acknowledge that I have read, understood, and agree to the terms outlined above. I further agree to return the rented bicycle by the agreed-upon date in good condition, or to be responsible for any damages, and to settle any costs for repairs or replacements within two (2) weeks of the incident.</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please upload your driver's license *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setDriversLicenseFile(file);
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <label className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                id="rental-consent"
                className="mt-1 h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                required
              />
              <span className="text-sm text-gray-700">
                <strong>I Agree</strong> - This will serve as your digital signature
              </span>
            </label>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep("general-waiver")}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  const checkbox = document.getElementById("rental-consent") as HTMLInputElement;
                  if (!checkbox.checked) {
                    setError("You must agree to the rental agreement to continue");
                    return;
                  }
                  if (!driversLicenseFile) {
                    setError("You must upload your driver's license to continue");
                    return;
                  }
                  setError("");
                  handleRentalWaiverAccept();
                }}
                disabled={loading || isUploading}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading || isUploading ? "Submitting..." : "Accept and Complete Signup"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wednesday Bike Ride Signup
          </h1>
          <p className="text-gray-600">
            Join us for our weekly community bike ride!
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Handle (Optional)
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Would you like to be added to our Instagram group chat to stay up to date on everything we have going on?
            </p>
            <input
              type="text"
              value={formData.instagramHandle}
              onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
              placeholder="@yourusername"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please select a ride group *
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="rideGroup"
                  value="cruising"
                  checked={formData.rideGroup === "cruising"}
                  onChange={(e) => setFormData({ ...formData, rideGroup: e.target.value })}
                  className="mt-1 h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  required
                />
                <div>
                  <div className="font-semibold text-gray-900">Cruising</div>
                  <div className="text-sm text-gray-600">
                    Slower pace for a shorter distance, very light exercise
                  </div>
                </div>
              </label>
              <label className="flex items-start space-x-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="rideGroup"
                  value="exercise"
                  checked={formData.rideGroup === "exercise"}
                  onChange={(e) => setFormData({ ...formData, rideGroup: e.target.value })}
                  className="mt-1 h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  required
                />
                <div>
                  <div className="font-semibold text-gray-900">Exercise</div>
                  <div className="text-sm text-gray-600">
                    Higher speeds at a longer distance, more of a pump
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Will you be needing a free bike rental? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="needsBikeRental"
                  value="yes"
                  checked={formData.needsBikeRental === "yes"}
                  onChange={(e) => setFormData({ ...formData, needsBikeRental: e.target.value })}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  required
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="needsBikeRental"
                  value="no"
                  checked={formData.needsBikeRental === "no"}
                  onChange={(e) => setFormData({ ...formData, needsBikeRental: e.target.value })}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  required
                />
                <span>No, I have my own</span>
              </label>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue to Waiver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
