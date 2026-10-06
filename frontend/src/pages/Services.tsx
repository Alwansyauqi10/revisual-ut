import { Link } from "react-router";

function Services() {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-revisual-primary text-revisual-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/background-hero.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-revisual-primary/70" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">
          <div className="w-full max-w-3xl pt-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-secondary/50">
              Services
            </p>
            <h1 className="font-display mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              OUR
              <br />
              SERVICES.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-revisual-secondary/65 sm:text-lg">
              We create visual experiences through photography, film, event
              documentation, and creative production.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-revisual-primary">
        <div className="mx-auto max-w-7xl px-6 lg:py-16">
          <article className="grid grid-cols-1 gap-8 border-b border-revisual-primary/10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-1">
              <span className="font-display text-sm font-medium text-revisual-primary/35">
                01
              </span>
            </div>

            <div className="lg:col-span-6">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                PHOTOGRAPHY
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-revisual-primary/60 sm:text-lg">
                We create photographs that preserve the atmosphere, people, and
                details behind every meaningful moment.
              </p>
              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Pricing
                </p>
                <p className="mt-2 text-sm font-medium text-revisual-primary">
                  Custom Quote
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Scope
                </p>
                <ul className="mt-5 space-y-3">
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Event Photography
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Graduation Photography
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Portrait Photography
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Commercial Photography
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Deliverables
                </p>
                <ul className="mt-5 space-y-3">
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    High-resolution photographs
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Professionally edited images
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Online photo delivery
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="grid grid-cols-1 gap-8 border-b border-revisual-primary/10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-1">
              <span className="font-display text-sm font-medium text-revisual-primary/35">
                02
              </span>
            </div>

            <div className="lg:col-span-6">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                VIDEOGRAPHY
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-revisual-primary/60 sm:text-lg">
                From important moments to the atmosphere surrounding them, we
                turn events and ideas into moving visual stories.
              </p>

              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Pricing
                </p>
                <p className="mt-2 text-sm font-medium text-revisual-primary">
                  Custom Quote
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Scope
                </p>
                <ul className="mt-5 space-y-3">
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Event Videography
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Highlight Videos
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Social Media Content
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Short-form Video
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Deliverables
                </p>
                <ul className="mt-5 space-y-3">
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Edited video production
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Highlight film
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Social media-ready content
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="grid grid-cols-1 gap-8 border-b border-revisual-primary/10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-1">
              <span className="font-display text-sm font-medium text-revisual-primary/35">
                03
              </span>
            </div>

            <div className="lg:col-span-6">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                EVENT DOCUMENTATION
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-revisual-primary/60 sm:text-lg">
                We document events from beginning to end, making sure the
                important moments and details are captured naturally.
              </p>

              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Pricing
                </p>
                <p className="mt-2 text-sm font-medium text-revisual-primary">
                  Custom Quote
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Scope
                </p>
                <ul className="mt-5 space-y-3">
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Graduation Events
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Corporate Events
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Community Events
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Private Events
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Deliverables
                </p>
                <ul className="mt-5 space-y-3">
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Event photo documentation
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Candid moments
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Portrait documentation
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="grid grid-cols-1 gap-8 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-1">
              <span className="font-display text-sm font-medium text-revisual-primary/35">
                04
              </span>
            </div>
            <div className="lg:col-span-6">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                CREATIVE PRODUCTION
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-revisual-primary/60 sm:text-lg">
                We bring ideas, people, and visual direction together to create
                productions with a clear story and purpose.
              </p>
              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Pricing
                </p>
                <p className="mt-2 text-sm font-medium text-revisual-primary">
                  Custom Quote
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Scope
                </p>
                <ul className="mt-5 space-y-3">
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Creative Concept
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Visual Direction
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Production Planning
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Content Production
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  Deliverables
                </p>

                <ul className="mt-5 space-y-3">
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Creative direction
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Production execution
                  </li>
                  <li className="text-sm leading-6 text-revisual-primary/70">
                    Final visual assets
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#F5F7FA] text-[#071A33]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
              Client Stories
            </p>
            <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              MADE TO BE
              <br />
              REMEMBERED.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-revisual-primary/55">
              A few words from the people and teams we've worked with.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="flex min-h-[280px] flex-col justify-between rounded-[1.5rem] border border-revisual-primary/10 bg-white p-7">
              <div>
                <span className="font-display text-4xl text-revisual-primary/20">
                  “
                </span>
                <blockquote className="mt-5 text-base leading-7 text-revisual-primary/70">
                  The team understood the atmosphere we wanted and translated it
                  into visuals that felt natural and memorable.
                </blockquote>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                Event Client
              </p>
            </article>

            <article className="flex min-h-[280px] flex-col justify-between rounded-[1.5rem] border border-revisual-primary/10 bg-white p-7">
              <div>
                <span className="font-display text-4xl text-revisual-primary/20">
                  “
                </span>
                <blockquote className="mt-5 text-base leading-7 text-revisual-primary/70">
                  From the production process to the final visuals, everything
                  felt thoughtful, organized, and easy to work with.
                </blockquote>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                Production Client
              </p>
            </article>

            <article className="flex min-h-[280px] flex-col justify-between rounded-[1.5rem] border border-revisual-primary/10 bg-white p-7">
              <div>
                <span className="font-display text-4xl text-revisual-primary/20">
                  “
                </span>
                <blockquote className="mt-5 text-base leading-7 text-revisual-primary/70">
                  The final documentation captured more than just the event. It
                  captured the moments and details we wanted to remember.
                </blockquote>
              </div>

              <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                Graduation Client
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-revisual-primary text-revisual-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/background-hero.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-revisual-primary/65" />
        <div className="relative z-10 flex min-h-[500px] items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-secondary/50">
              Start A Project
            </p>
            <h2 className="font-display my-5 text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              HAVE SOMETHING
              <br />
              IN MIND?
            </h2>
            <p className="mx-auto text-sm leading-6 text-revisual-secondary/60 sm:text-base">
              Tell us about your event, idea, or project and let's create
              something meaningful together.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex h-11 items-center gap-3 rounded-full bg-white px-5 text-sm font-medium text-[#071A33] transition hover:bg-white/90"
            >
              Get In Touch
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
