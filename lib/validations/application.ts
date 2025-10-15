import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  cityState: z.string().min(1, "City/State is required"),
  therapyExperience: z.enum(["Yes", "No"]),
  hasInsurance: z.enum(["Yes", "No"]),
  currentChallenges: z.array(z.string()).min(1, "Select at least one challenge"),
  testimonialWillingness: z.enum(["Yes", "No"]),
  mentalHealthDescription: z.string().min(10, "Please provide a detailed description"),
  therapyReason: z.string().min(10, "Please explain your reason"),
  therapyGoals: z.string().min(10, "Please describe your goals"),
  weeklyAvailability: z.enum(["Yes", "No"]),
  hasDevice: z.enum(["Yes", "No"]),
  therapyBarriers: z.string().min(10, "Please describe any barriers"),
  introVideoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")).or(z.undefined()),
  therapistPreference: z.enum(["choose_own", "foundation_help"]),
  preferredTherapistName: z.string().optional().or(z.literal("")),
  preferredTherapistContact: z.string().optional().or(z.literal("")),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const challengeOptions = [
  "Anxiety or Stress",
  "Depression or Sadness",
  "Relationship Challenges",
  "Grief or Loss",
  "Career or Educational Concerns",
  "Other",
];
