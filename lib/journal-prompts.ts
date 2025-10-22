/**
 * Collection of positive thoughts and journaling prompts for mental health reflection
 * These prompts are designed to encourage self-reflection, gratitude, and personal growth
 */

export interface JournalPrompt {
  id: number;
  prompt: string;
  category: "gratitude" | "reflection" | "growth" | "mindfulness" | "affirmation";
}

export const journalPrompts: JournalPrompt[] = [
  // Gratitude prompts
  {
    id: 1,
    prompt: "What are three things you're grateful for today, and why do they matter to you?",
    category: "gratitude",
  },
  {
    id: 2,
    prompt: "Who in your life are you thankful for? Write about how they've positively impacted you.",
    category: "gratitude",
  },
  {
    id: 3,
    prompt: "What small moment brought you joy today? Describe it in detail.",
    category: "gratitude",
  },
  {
    id: 4,
    prompt: "What's something about your body or health you're grateful for today?",
    category: "gratitude",
  },
  {
    id: 5,
    prompt: "What challenge from your past are you now grateful you experienced?",
    category: "gratitude",
  },

  // Reflection prompts
  {
    id: 6,
    prompt: "What emotion did you feel most strongly today? What do you think triggered it?",
    category: "reflection",
  },
  {
    id: 7,
    prompt: "Describe a moment today when you felt truly present and engaged.",
    category: "reflection",
  },
  {
    id: 8,
    prompt: "What did you learn about yourself this week?",
    category: "reflection",
  },
  {
    id: 9,
    prompt: "How did you show kindness to yourself or others today?",
    category: "reflection",
  },
  {
    id: 10,
    prompt: "What would you do differently if you could replay today? What would you keep the same?",
    category: "reflection",
  },

  // Growth prompts
  {
    id: 11,
    prompt: "What's one small step you can take tomorrow toward a goal that matters to you?",
    category: "growth",
  },
  {
    id: 12,
    prompt: "What fear or limiting belief is holding you back? How can you challenge it?",
    category: "growth",
  },
  {
    id: 13,
    prompt: "Describe a recent challenge you faced. What strengths did you discover in yourself?",
    category: "growth",
  },
  {
    id: 14,
    prompt: "What skill or quality would you like to develop? Why is it important to you?",
    category: "growth",
  },
  {
    id: 15,
    prompt: "How have you grown since starting your therapy journey?",
    category: "growth",
  },

  // Mindfulness prompts
  {
    id: 16,
    prompt: "Pause and notice: What do you see, hear, smell, and feel right now?",
    category: "mindfulness",
  },
  {
    id: 17,
    prompt: "What does your body need right now? How can you honor that need?",
    category: "mindfulness",
  },
  {
    id: 18,
    prompt: "Describe your current emotional state without judgment. Just observe and name it.",
    category: "mindfulness",
  },
  {
    id: 19,
    prompt: "What thoughts keep recurring in your mind? Write them down and examine them gently.",
    category: "mindfulness",
  },
  {
    id: 20,
    prompt: "Take three deep breaths. How do you feel before and after?",
    category: "mindfulness",
  },

  // Affirmation prompts
  {
    id: 21,
    prompt: "Write yourself a letter of encouragement. What would you say to support yourself?",
    category: "affirmation",
  },
  {
    id: 22,
    prompt: "What's one thing you're proud of yourself for this week?",
    category: "affirmation",
  },
  {
    id: 23,
    prompt: "List five qualities you admire about yourself.",
    category: "affirmation",
  },
  {
    id: 24,
    prompt: "What compliment would you like to give yourself today?",
    category: "affirmation",
  },
  {
    id: 25,
    prompt: "Finish this sentence: I am capable of...",
    category: "affirmation",
  },

  // Additional gratitude prompts
  {
    id: 26,
    prompt: "What aspect of nature are you grateful for? How does it make you feel?",
    category: "gratitude",
  },
  {
    id: 27,
    prompt: "What comfort or luxury do you sometimes take for granted?",
    category: "gratitude",
  },

  // Additional reflection prompts
  {
    id: 28,
    prompt: "What boundary did you set or wish you had set today?",
    category: "reflection",
  },
  {
    id: 29,
    prompt: "How did you practice self-care today, even in small ways?",
    category: "reflection",
  },
  {
    id: 30,
    prompt: "What made you smile or laugh today?",
    category: "reflection",
  },

  // Additional growth prompts
  {
    id: 31,
    prompt: "What's one thing you'd like to forgive yourself for?",
    category: "growth",
  },
  {
    id: 32,
    prompt: "How can you show yourself more compassion this week?",
    category: "growth",
  },
  {
    id: 33,
    prompt: "What does success look like for you right now? How has that changed?",
    category: "growth",
  },

  // Additional mindfulness prompts
  {
    id: 34,
    prompt: "Without judgment, what are you avoiding or resisting right now?",
    category: "mindfulness",
  },
  {
    id: 35,
    prompt: "What sensations do you notice in your body when you think about your goals?",
    category: "mindfulness",
  },

  // Additional affirmation prompts
  {
    id: 36,
    prompt: "What would you tell a friend who is going through what you're experiencing?",
    category: "affirmation",
  },
  {
    id: 37,
    prompt: "Write three 'I am' statements that feel true and empowering.",
    category: "affirmation",
  },
  {
    id: 38,
    prompt: "What about your journey makes you resilient?",
    category: "affirmation",
  },

  // Cycling/exercise related
  {
    id: 39,
    prompt: "How did moving your body make you feel today? What did you notice?",
    category: "reflection",
  },
  {
    id: 40,
    prompt: "What metaphor from cycling resonates with your life journey?",
    category: "growth",
  },
];

/**
 * Get a daily journal prompt based on the current date
 * Uses the day of the year to ensure the same prompt appears each day
 */
export function getDailyPrompt(): JournalPrompt {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Use modulo to cycle through prompts
  const promptIndex = dayOfYear % journalPrompts.length;

  return journalPrompts[promptIndex];
}

/**
 * Get a random journal prompt
 */
export function getRandomPrompt(): JournalPrompt {
  const randomIndex = Math.floor(Math.random() * journalPrompts.length);
  return journalPrompts[randomIndex];
}

/**
 * Get prompts by category
 */
export function getPromptsByCategory(
  category: JournalPrompt["category"]
): JournalPrompt[] {
  return journalPrompts.filter((prompt) => prompt.category === category);
}
