"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, challengeOptions, type ApplicationFormData } from "@/lib/validations/application";
import { useUploadThing } from "@/lib/uploadthing";

export default function ApplyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("videoUploader", {
    onClientUploadComplete: () => {
      setUploadProgress(100);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      currentChallenges: [],
    },
  });

  const currentChallenges = watch("currentChallenges") || [];

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setError("");
    setLoading(true);

    try {
      let videoUrl = "";

      // Upload video if provided
      if (videoFile) {
        const uploadResult = await startUpload([videoFile]);
        if (uploadResult && uploadResult[0]) {
          videoUrl = uploadResult[0].url;
        }
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          introVideoUrl: videoUrl || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      router.push("/dashboard?submitted=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeToggle = (challenge: string) => {
    const updated = currentChallenges.includes(challenge)
      ? currentChallenges.filter((c) => c !== challenge)
      : [...currentChallenges, challenge];
    setValue("currentChallenges", updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Application Form</h1>
          <p className="mt-2 text-gray-600">
            Complete this form to apply for the Cycle of Support program
          </p>
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-700">
              <strong>Deadline:</strong> January 25th, 2025 at 11:59 PM
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                {...register("fullName")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input
                type="tel"
                {...register("phone")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City/State *</label>
              <input
                type="text"
                {...register("cityState")}
                placeholder="e.g., Los Angeles, CA"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.cityState && (
                <p className="mt-1 text-sm text-red-600">{errors.cityState.message}</p>
              )}
            </div>
          </div>

          {/* Therapy Background */}
          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-xl font-semibold text-gray-900">Therapy Background</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Have you had therapy/counseling experience before? *
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("therapyExperience")}
                    value="Yes"
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("therapyExperience")}
                    value="No"
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
              {errors.therapyExperience && (
                <p className="mt-1 text-sm text-red-600">{errors.therapyExperience.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have active health insurance? *
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("hasInsurance")}
                    value="Yes"
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("hasInsurance")}
                    value="No"
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
              {errors.hasInsurance && (
                <p className="mt-1 text-sm text-red-600">{errors.hasInsurance.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What challenges are you currently facing? * (Select all that apply)
              </label>
              <div className="space-y-2">
                {challengeOptions.map((challenge) => (
                  <label key={challenge} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentChallenges.includes(challenge)}
                      onChange={() => handleChallengeToggle(challenge)}
                      className="form-checkbox"
                    />
                    <span className="ml-2">{challenge}</span>
                  </label>
                ))}
              </div>
              {errors.currentChallenges && (
                <p className="mt-1 text-sm text-red-600">{errors.currentChallenges.message}</p>
              )}
            </div>
          </div>

          {/* Mental Health & Goals */}
          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-xl font-semibold text-gray-900">Mental Health & Goals</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Describe your current mental/emotional health *
              </label>
              <textarea
                {...register("mentalHealthDescription")}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.mentalHealthDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.mentalHealthDescription.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Why do you want to start therapy? *
              </label>
              <textarea
                {...register("therapyReason")}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.therapyReason && (
                <p className="mt-1 text-sm text-red-600">{errors.therapyReason.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                What are your therapy goals? *
              </label>
              <textarea
                {...register("therapyGoals")}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.therapyGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.therapyGoals.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                What barriers have prevented you from starting therapy? *
              </label>
              <textarea
                {...register("therapyBarriers")}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.therapyBarriers && (
                <p className="mt-1 text-sm text-red-600">{errors.therapyBarriers.message}</p>
              )}
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-xl font-semibold text-gray-900">Logistics</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Can you commit to weekly sessions? *
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("weeklyAvailability")}
                    value="Yes"
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("weeklyAvailability")}
                    value="No"
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
              {errors.weeklyAvailability && (
                <p className="mt-1 text-sm text-red-600">{errors.weeklyAvailability.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have access to a device for virtual sessions? *
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("hasDevice")}
                    value="Yes"
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("hasDevice")}
                    value="No"
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
              {errors.hasDevice && (
                <p className="mt-1 text-sm text-red-600">{errors.hasDevice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Would you be willing to record a testimonial video? *
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("testimonialWillingness")}
                    value="Yes"
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("testimonialWillingness")}
                    value="No"
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
              {errors.testimonialWillingness && (
                <p className="mt-1 text-sm text-red-600">{errors.testimonialWillingness.message}</p>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-xl font-semibold text-gray-900">Introduction Video</h2>
            <p className="text-sm text-gray-600">
              Please upload a brief video introducing yourself and explaining what you hope to get out of therapy sessions.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Video (Optional, Max 32MB)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setVideoFile(file);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading || isUploading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading || isUploading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
