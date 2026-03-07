"use client";

export function Hero() {
  return (
    <section className="relative w-full bg-black">
      {/* Full-width autoplay video */}
      <video
        className="w-full block"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-bg.jpg"
      >
        {/* Replace this src with your actual video file e.g. /videos/hero.mp4 */}
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          type="video/mp4"
        />
      </video>
    </section>
  );
}
