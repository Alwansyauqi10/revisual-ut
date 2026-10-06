function Contact() {
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
              Contact
            </p>
            <h1 className="font-display mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              LET'S
              <br />
              TALK.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-revisual-secondary/65 sm:text-lg">
              Have an event, idea, or project in mind? Tell us about it and
              let's create something meaningful together.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-revisual-secondary text-revisual-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
                Get In Touch
              </p>
              <h2 className="font-display mt-4 max-w-lg text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                LET'S CREATE
                <br />
                SOMETHING
                <br />
                TOGETHER.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-revisual-primary/60 sm:text-base">
                Whether you need event documentation, photography, videography,
                or creative production, we'd love to hear about your project.
              </p>

              <div className="mt-10 space-y-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                    Email
                  </p>
                  <a
                    href="mailto:hello@revisualproduction.com"
                    className="mt-2 inline-block text-base font-medium transition hover:text-[#164E7A]"
                  >
                    hello@revisualproduction.com
                  </a>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                    Instagram
                  </p>
                  <a
                    href="#"
                    className="mt-2 inline-block text-base font-medium transition hover:text-[#164E7A]"
                  >
                    @revisualproduction
                  </a>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/40">
                    WhatsApp
                  </p>
                  <a
                    href="#"
                    className="mt-2 inline-block text-base font-medium transition hover:text-[#164E7A]"
                  >
                    Chat with us →
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-revisual-secondary p-6 sm:p-8 lg:p-10">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-revisual-primary/45">
                  Project Inquiry
                </p>
                <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  TELL US ABOUT
                  <br />
                  YOUR PROJECT.
                </h3>
              </div>

              <form className="mt-8 space-y-6">
                {/* NAME */}
                <div>
                  <label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/45"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="mt-2 w-full border-b border-[#071A33]/15 bg-transparent px-0 py-3 text-sm text-revisual-primary outline-none placeholder:text-revisual-primary/30 focus:border-[#071A33]/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/45"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full border-b border-[#071A33]/15 bg-transparent px-0 py-3 text-sm text-revisual-primary outline-none placeholder:text-revisual-primary/30 focus:border-[#071A33]/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project"
                    className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/45"
                  >
                    Project Type
                  </label>
                  <select
                    id="project"
                    defaultValue=""
                    className="mt-2 w-full border-b border-[#071A33]/15 bg-transparent px-0 py-3 text-sm text-revisual-primary outline-none focus:border-[#071A33]/50"
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    <option value="photography">Photography</option>
                    <option value="videography">Videography</option>
                    <option value="event-documentation">
                      Event Documentation
                    </option>
                    <option value="creative-production">
                      Creative Production
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-xs font-medium uppercase tracking-[0.15em] text-revisual-primary/45"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us a little about your project..."
                    className="mt-2 w-full resize-none border-b border-[#071A33]/15 bg-transparent px-0 py-3 text-sm text-revisual-primary outline-none placeholder:text-revisual-primary/30 focus:border-[#071A33]/50"
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-3 rounded-full bg-revisual-primary px-5 text-sm font-medium text-revisual-secondary transition hover:bg-[#0B2545]"
                >
                  Send Inquiry
                  <span aria-hidden="true">→</span>
                </button>
              </form>
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
              Revisual Production
            </p>
            <h2 className="font-display my-5 text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              LET'S MAKE
              <br />
              SOMETHING MEMORABLE.
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-6 text-revisual-secondary/60 sm:text-base">
              Every project starts with a conversation.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
