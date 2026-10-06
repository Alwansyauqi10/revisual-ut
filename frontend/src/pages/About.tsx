import { Link } from "react-router";

function About() {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-revisual-primary text-revisual-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-revisual-primary/70" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">
          <div className="w-full max-w-3xl pt-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-secondary/50">
              About Us
            </p>
            <h1 className="font-display mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              MORE THAN
              <br />
              JUST A
              <br />
              PRODUCTION.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-revisual-secondary/65 sm:text-lg">
              We are a team of storytellers, visual creators, and dreamers who
              believe in the power of moments.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-revisual-stext-revisual-secondary text-revisual-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="max-w-md">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
                Our Story
              </p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                A JOURNEY
                <br />
                OF VISUAL
                <br />
                STORYTELLING.
              </h2>
              <p className="mt-6 text-sm leading-6 text-revisual-primary/60 sm:text-base sm:leading-7">
                Revisual Production was founded with a simple idea: to capture
                meaningful moments and turn them into stories that last. What
                started as a small creative team has grown into a trusted
                production partner for various events, especially graduations.
              </p>
            </div>
            <div>
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="/section-about.jpg"
                  alt="Revisual Production behind the scenes"
                  className="aspect-video w-full object-cover "
                />
              </div>
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute left-0 right-0 top-2 h-px bg-revisual-primary/20" />

                  <div className="relative grid grid-cols-3 gap-8 lg:gap-16">
                    <div>
                      <div className="h-4 w-4 rounded-full bg-revisual-primary" />
                      <p className="mt-4 text-lg font-semibold">2020</p>
                      <p className="mt-1 text-sm font-medium text-revisual-primary">
                        The Beginning
                      </p>
                      <p className="mt-2 text-xs leading-5 text-revisual-primary/55">
                        Started as a small team with a big dream.
                      </p>
                    </div>
                    <div>
                      <div className="h-4 w-4 rounded-full bg-revisual-primary" />
                      <p className="mt-4 text-lg font-semibold">2022</p>
                      <p className="mt-1 text-sm font-medium text-revisual-primary">
                        Growing Further
                      </p>
                      <p className="mt-2 text-xs leading-5 text-revisual-primary/55">
                        Expanded our services and team.
                      </p>
                    </div>
                    <div>
                      <div className="h-4 w-4 rounded-full bg-revisual-primary" />
                      <p className="mt-4 text-lg font-semibold">2024</p>
                      <p className="mt-1 text-sm font-medium text-revisual-primary">
                        More Impact
                      </p>
                      <p className="mt-2 text-xs leading-5 text-revisual-primary/55">
                        Trusted by thousands of graduates and clients.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-revisual-secondary text-revisual-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-10">
            {/* LEFT */}
            <div className="flex flex-col justify-center lg:col-span-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
                Our Culture
              </p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                WHAT
                <br />
                DRIVES US.
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-6 text-revisual-primary/55">
                The values that keep us moving forward, in every project and
                every story.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
              <div className="rounded-[1.5rem] border border-revisual-primary/10 bg-revisual-stext-revisual-secondary p-6">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  01
                </span>
                <h3 className="font-display mt-12 text-2xl font-semibold">
                  CREATIVE
                </h3>
                <p className="mt-3 text-sm leading-6 text-revisual-primary/55">
                  We explore fresh ideas and new perspectives to make every
                  project meaningful.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-revisual-primary/10 bg-revisual-stext-revisual-secondary p-6">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  02
                </span>
                <h3 className="font-display mt-12 text-2xl font-semibold">
                  COLLABORATIVE
                </h3>
                <p className="mt-3 text-sm leading-6 text-revisual-primary/55">
                  Great stories are built together. We work closely with our
                  clients and creative partners.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-revisual-primary/10 bg-revisual-stext-revisual-secondary p-6">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                  03
                </span>
                <h3 className="font-display mt-12 text-2xl font-semibold">
                  HUMAN-CENTERED
                </h3>
                <p className="mt-3 text-sm leading-6 text-revisual-primary/55">
                  We put people and their stories at the heart of everything we
                  create.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-revisual-stext-revisual-secondary text-revisual-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
                Our Team
              </p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                THE PEOPLE
                <br />
                BEHIND
                <br />
                REVISUAL.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-revisual-primary/60 sm:text-base sm:leading-7">
                A small team of photographers, filmmakers, and creative minds
                working together to turn meaningful moments into visual stories.
              </p>
              <Link to="/teams">
                <button
                  className="mt-7 inline-flex h-11 items-center gap-3 rounded-full bg-revisual-primary px-5 text-sm font-medium text-revisual-secondary transition hover:bg-[#0B2545]"
                >
                  Meet The Team
                  <span aria-hidden="true">→</span>
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="flex -space-x-4 sm:-space-x-5">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Revisual team member"
                  className="h-20 w-20 rounded-full border-4 border-revisual-stext-revisual-secondary object-cover sm:h-24 sm:w-24"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Revisual team member"
                  className="h-20 w-20 rounded-full border-4 border-revisual-stext-revisual-secondary object-cover sm:h-24 sm:w-24"
                />
                <img
                  src="https://randomuser.me/api/portraits/men/46.jpg"
                  alt="Revisual team member"
                  className="h-20 w-20 rounded-full border-4 border-revisual-stext-revisual-secondary object-cover sm:h-24 sm:w-24"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Revisual team member"
                  className="h-20 w-20 rounded-full border-4 border-revisual-stext-revisual-secondary object-cover sm:h-24 sm:w-24"
                />
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-revisual-stext-revisual-secondary bg-revisual-primary text-xs font-medium text-revisual-secondary sm:h-24 sm:w-24">
                  + MORE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-revisual-primary text-revisual-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-revisual-primary/65" />

        <div className="relative z-10 flex min-h-[500px] items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-secondary/50">
              Our Belief
            </p>
            <blockquote className="font-display text-4xl my-5 font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              “Every moment has a story, and every story deserves to be
              remembered.”
            </blockquote>
            <p className="font-display text-sm uppercase font-medium tracking-[0.15em] text-revisual-secondary/50">
              — Revisual Production
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
