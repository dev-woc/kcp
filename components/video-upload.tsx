"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";

interface VideoUploadProps {
  applicationId: string;
  currentVideoUrl?: string | null;
}

export default function VideoUpload({ applicationId, currentVideoUrl }: VideoUploadProps) {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { startUpload, isUploading } = useUploadThing("videoUploader", {
    onClientUploadComplete: () => {
      setUploadProgress(100);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const handleUpload = async () => {
    if (!videoFile) return;

    setError("");
    setUploading(true);

    try {
      // Upload video
      const uploadResult = await startUpload([videoFile]);
      if (!uploadResult || !uploadResult[0]) {
        throw new Error("Failed to upload video");
      }

      const videoUrl = uploadResult[0].url;

      // Update application with video URL
      const response = await fetch(`/api/applications/${applicationId}/video`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      setVideoFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-t pt-6">
      <h4 className="font-medium text-gray-700 mb-2">Introduction Video</h4>

      {currentVideoUrl ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Current Video:</p>
            <a
              href={currentVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Video
            </a>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Upload a new video to replace the current one:</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-4">
          You haven't uploaded an introduction video yet. Upload one now to help us get to know you better.
        </p>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setVideoFile(file);
                setError("");
              }
            }}
            disabled={uploading || isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-500">Maximum file size: 32MB</p>
        </div>

        {(isUploading || uploading) && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
          </div>
        )}

        {videoFile && !uploading && !isUploading && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              {currentVideoUrl ? "Replace Video" : "Upload Video"}
            </button>
            <button
              onClick={() => {
                setVideoFile(null);
                setError("");
              }}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
