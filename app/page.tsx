import {
  Hero,
  MissionStatement,
  UpcomingEvents,
  JoinCyclingClub,
  MentalHealthResources,
  NewsletterSignup,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionStatement />
      <UpcomingEvents />
      <JoinCyclingClub />
      <MentalHealthResources />
      <NewsletterSignup />
    </>
  );
}
