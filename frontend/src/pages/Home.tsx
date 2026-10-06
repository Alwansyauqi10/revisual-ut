import { Link } from "react-router";

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden bg-revisual-primary text-revisual-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background-hero.jpg')" }}
        />

        <div className="absolute inset-0 bg-revisual-primary/70" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">
          <div className="w-full max-w-3xl pt-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-secondary/50">
              Creative Production
            </p>

            <h1 className="font-display mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              WE CREATE.
              <br />
              WE CAPTURE.
              <br />
              WE REMEMBER.
            </h1>

            <p className="mt-8 max-w-lg text-base leading-7 text-revisual-secondary/65 sm:text-lg">
              Visual stories for meaningful moments. From graduation to
              corporate events, we bring your story to life.
            </p>

            <div className="mt-10">
              <Link
                to="/portfolio"
                className="inline-flex h-12 items-center gap-3 rounded-full bg-revisual-secondary px-6 text-sm font-medium text-revisual-primary transition hover:bg-white/90"
              >
                Explore Our Work
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="relative overflow-hidden bg-revisual-secondary text-revisual-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Image */}
            <div className="relative">
              <div className="group relative overflow-hidden rounded-[2rem]">
                <img
                  src="/section-about.jpg"
                  alt="Revisual Production creative team"
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-revisual-primary/10 transition duration-500 group-hover:bg-revisual-primary/20" />

                {/* Play Button */}
                <button
                  type="button"
                  aria-label="Play Revisual behind the scenes"
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-revisual-secondary text-revisual-primary shadow-lg transition duration-300 group-hover:scale-110"
                >
                  <span className="ml-1 text-lg">▶</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative max-w-xl lg:pl-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
                Who We Are
              </p>

              <div className="mt-4 h-px w-12 bg-revisual-primary/25" />

              <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                WE TURN MOMENTS
                <br />
                INTO STORIES.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-revisual-primary/60">
                Revisual Production is a creative studio specializing in
                photography, videography, and event documentation. We believe
                every moment deserves to be remembered, beautifully.
              </p>

              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-revisual-primary"
              >
                Our Story
                <span aria-hidden="true">→</span>
              </Link>

              {/* Decorative Elements */}
              <div className="pointer-events-none absolute -bottom-10 -right-12 hidden lg:block">
                <div className="flex flex-col items-end gap-1">
                  <span className="h-6 w-6 bg-revisual-primary/10" />
                  <span className="mr-7 h-6 w-6 bg-revisual-primary/15" />
                  <span className="mr-14 h-6 w-6 bg-revisual-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-revisual-secondary text-revisual-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
            {/* Left Content */}
            <div className="flex flex-col justify-center lg:col-span-1">
              <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                WHAT
                <br />
                WE DO.
              </h2>

              <p className="mt-6 max-w-xs text-sm leading-6 text-revisual-primary/55">
                From graduations to corporate events, we provide complete
                visual solutions to bring your moments to life.
              </p>

              <Link
                to="/services"
                className="mt-8 inline-flex w-fit items-center gap-3 text-sm font-medium text-revisual-primary"
              >
                View All Services
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
              {/* Photography */}
              <div className="rounded-2xl border border-[#071A33]/10 bg-revisual-secondary/50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-revisual-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.168A2.25 2.25 0 018.595 5.25h6.81a2.25 2.25 0 011.768.918l1.518 1.982a2.25 2.25 0 001.784.85H20.25A2.25 2.25 0 0122.5 11.25v6.75a2.25 2.25 0 01-2.25 2.25H3.75a2.25 2.25 0 01-2.25-2.25v-6.75a2.25 2.25 0 012.25-2.25h1.775a2.25 2.25 0 001.302-.832l1.518-1.982z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Photography
                </h3>

                <p className="mt-3 text-sm leading-6 text-revisual-primary/55">
                  Capture the real moments with photographs that feel honest,
                  timeless, and alive.
                </p>

                <Link
                  to="/services"
                  className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-revisual-primary"
                >
                  Learn More
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Videography */}
              <div className="rounded-2xl border border-revisual-primary/10 bg-revisual-secondary/50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-revisual-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5l4.72-2.36a.75.75 0 011.08.67v6.38a.75.75 0 01-1.08.67l-4.72-2.36v-3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h10.5A2.25 2.25 0 0116.5 9v6a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 15V9a2.25 2.25 0 012.25-2.25z"
                    />
                  </svg>
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Videography
                </h3>

                <p className="mt-3 text-sm leading-6 text-revisual-primary/55">
                  Bring your story to life through cinematic motion, sound,
                  and emotion.
                </p>

                <Link
                  to="/services"
                  className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-revisual-primary"
                >
                  Learn More
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Event Documentation */}
              <div className="rounded-2xl border border-revisual-primary/10 bg-revisual-secondary/50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-revisual-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 9.75h18M4.5 5.25h15A1.5 1.5 0 0121 6.75v12A1.5 1.5 0 0119.5 20.25h-15A1.5 1.5 0 013 18.75v-12a1.5 1.5 0 011.5-1.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 14.25l1.5 1.5 3.75-3.75"
                    />
                  </svg>
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Event Documentation
                </h3>

                <p className="mt-3 text-sm leading-6 text-revisual-primary/55">
                  From small gatherings to large celebrations, we document
                  every moment that matters.
                </p>

                <Link
                  to="/services"
                  className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-revisual-primary"
                >
                  Learn More
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Creative Production */}
              <div className="rounded-2xl border border-revisual-primary/10 bg-revisual-secondary/50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-revisual-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l8.25 4.5L12 12 3.75 7.5 12 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12L12 16.5 20.25 12"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 16.5L12 21l8.25-4.5"
                    />
                  </svg>
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Creative Production
                </h3>

                <p className="mt-3 text-sm leading-6 text-revisual-primary/55">
                  Ideas, people, and visuals brought together into one
                  meaningful story.
                </p>

                <Link
                  to="/services"
                  className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-revisual-primary"
                >
                  Learn More
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work */}
      <section className="relative overflow-hidden bg-revisual-secondary text-revisual-primary">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-20">
          {/* Corner decorations */}
          <div className="pointer-events-none absolute left-6 top-8 hidden h-10 w-10 border-l border-t border-revisual-primary/50 lg:block" />

          <div className="pointer-events-none absolute right-6 top-8 hidden h-10 w-10 border-r border-t border-revisual-primary/50 lg:block" />

          <div className="pointer-events-none absolute bottom-8 left-6 hidden h-10 w-10 border-b border-l border-revisual-primary/50 lg:block" />

          <div className="pointer-events-none absolute bottom-8 right-6 hidden h-10 w-10 border-b border-r border-revisual-primary/50 lg:block" />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-4 lg:p-6">
            {/* Portfolio Images */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
              <div className="group overflow-hidden rounded-3xl bg-revisual-secondary/50">
                <img
                  src="/portfolio-1.jpg"
                  alt="Graduation photography"
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="group overflow-hidden rounded-3xl bg-revisual-secondary/50">
                <img
                  src="/portfolio-2.jpg"
                  alt="Event photography"
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="group overflow-hidden rounded-3xl bg-revisual-secondary/50">
                <img
                  src="/portfolio-3.jpg"
                  alt="Graduation portrait"
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center lg:col-span-1 lg:pl-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
                Our Work
              </p>

              <div className="mt-4 h-px w-12 bg-revisual-primary/30" />

              <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                MOMENTS
                <br />
                WE'VE
                <br />
                CAPTURED.
              </h2>

              <p className="mt-6 max-w-xs text-sm leading-6 text-revisual-primary/55">
                From graduations to corporate events, every project is a new
                story worth telling.
              </p>

              <Link
                to="/portfolio"
                className="mt-8 inline-flex w-fit items-center gap-3 text-sm font-medium text-revisual-primary"
              >
                View More
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-revisual-primary text-revisual-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background-cta.jpg')" }}
        />

        <div className="absolute inset-0 bg-revisual-primary/65" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-revisual-secondary/50">
                Let's Work Together
              </p>

              <h2 className="font-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                LET'S CREATE
                <br />
                YOUR NEXT STORY.
              </h2>
            </div>

            <div className="lg:justify-self-end">
              <p className="mb-6 max-w-xs text-sm leading-6 text-revisual-secondary/55">
                Have an event or project in mind?
                <br />
                We'd love to hear from you.
              </p>

              <Link
                to="/contact"
                className="inline-flex h-12 items-center gap-3 rounded-full bg-revisual-secondary px-6 text-sm font-medium text-revisual-primary transition hover:bg-revisual-secondary/90"
              >
                Get in Touch
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;