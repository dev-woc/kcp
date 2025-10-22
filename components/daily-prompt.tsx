"use client";

import { useState } from "react";
import { JournalPrompt } from "@/lib/journal-prompts";

interface DailyPromptProps {
  prompt: JournalPrompt;
}

export default function DailyPrompt({ prompt }: DailyPromptProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryColor = (category: JournalPrompt["category"]) => {
    switch (category) {
      case "gratitude":
        return "bg-blue-100 text-blue-800 border-blue-400";
      case "reflection":
        return "bg-purple-100 text-purple-800 border-purple-400";
      case "growth":
        return "bg-green-100 text-green-800 border-green-400";
      case "mindfulness":
        return "bg-teal-100 text-teal-800 border-teal-400";
      case "affirmation":
        return "bg-pink-100 text-pink-800 border-pink-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-400";
    }
  };

  const getCategoryIcon = (category: JournalPrompt["category"]) => {
    switch (category) {
      case "gratitude":
        return "💙"; // Heart
      case "reflection":
        return "🤔"; // Thinking
      case "growth":
        return "🌱"; // Seedling
      case "mindfulness":
        return "🧘"; // Meditation
      case "affirmation":
        return "⭐"; // Star
      default:
        return "📝"; // Memo
    }
  };

  return (
    <div className={`rounded-lg shadow-md border-l-4 p-6 ${getCategoryColor(prompt.category)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getCategoryIcon(prompt.category)}</span>
          <div>
            <h3 className="text-lg font-bold">
              Daily Reflection
            </h3>
            <p className="text-xs opacity-75">
              {prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)} • Optional
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-all"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-base font-medium mb-3 italic">
        "{prompt.prompt}"
      </p>

      <p className="text-sm opacity-75 mb-4">
        Take a moment to reflect on this question. Journaling is optional but can be a helpful tool for self-discovery and growth.
      </p>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <textarea
            placeholder="Your thoughts... (This is private and not saved)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white text-black"
            rows={6}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs opacity-75">
              💡 Tip: Try writing for at least 3-5 minutes without stopping
            </p>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 bg-white bg-opacity-60 rounded p-3 text-xs">
        <p className="font-semibold mb-1">Why journaling helps:</p>
        <ul className="list-disc list-inside space-y-1 opacity-90">
          <li>Process emotions and experiences</li>
          <li>Track your mental health journey</li>
          <li>Identify patterns and triggers</li>
          <li>Celebrate progress and growth</li>
        </ul>
      </div>
    </div>
  );
}
