"use client";

import { useState } from "react";
import { JournalPrompt } from "@/lib/journal-prompts";

interface DailyPromptProps {
  prompt: JournalPrompt;
}

export default function DailyPrompt({ prompt }: DailyPromptProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Your thoughts... (This is private and not saved)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white text-black"
            rows={6}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs opacity-75">
              💡 Tip: Try writing for at least 3-5 minutes without stopping
            </p>
            <div className="flex gap-2 flex-wrap">
              {journalEntry.trim() && !saved && (
                <button
                  onClick={async () => {
                    setSaving(true);
                    try {
                      const response = await fetch('/api/journal', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          prompt: prompt.prompt,
                          category: prompt.category,
                          entry: journalEntry,
                        }),
                      });

                      if (response.ok) {
                        setSaved(true);
                      } else {
                        alert('Failed to save journal entry');
                      }
                    } catch (error) {
                      console.error('Error saving journal:', error);
                      alert('Failed to save journal entry');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2 disabled:bg-gray-400"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Entry
                    </>
                  )}
                </button>
              )}
              {saved && (
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </div>
              )}
              {journalEntry.trim() && (
                <button
                  onClick={() => {
                    const date = new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                    const content = `Daily Reflection - ${date}\n\nPrompt: ${prompt.prompt}\n\nCategory: ${prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}\n\n---\n\n${journalEntry}`;

                    // Create a blob and download
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `journal-${new Date().toISOString().split('T')[0]}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              )}
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setSaved(false);
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Done
              </button>
            </div>
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
