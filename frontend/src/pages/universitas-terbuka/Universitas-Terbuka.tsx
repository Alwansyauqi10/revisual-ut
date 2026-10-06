import { useState } from "react";
import { useNavigate } from "react-router";

function UniversitasTerbuka() {
  const navigate = useNavigate();

  const [nim, setNim] = useState("");
  const [searchError, setSearchError] = useState("");

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanNim = nim.trim();

    if (!cleanNim) {
      setSearchError("Please enter your NIM.");
      return;
    }

    setSearchError("");

    navigate(
      `/universitas-terbuka/photos?nim=${encodeURIComponent(
        cleanNim,
      )}`,
    );
  };

  return (
    <>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-screen overflow-hidden bg-[#071A33] text-white">
        {/* Background */}

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/Universitas%20Terbuka%20Graduation%20Dreams.png')",
          }}
        />

        {/* Dark overlay */}

        <div className="absolute inset-0 bg-[#071A33]/55" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#071A33]/75 via-[#071A33]/35 to-[#071A33]/95" />

        {/* Hero content */}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl justify-center items-center px-5 py-28 sm:px-8 sm:py-32 lg:px-16">
          <div className="w-full max-w-4xl">

            {/* Eyebrow */}

            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/55 sm:text-sm">
              Universitas Terbuka Graduation
            </p>

            {/* Heading */}

            <h1 className="font-display mt-5 max-w-4xl text-[3.2rem] font-semibold leading-[0.92] tracking-[-0.045em] sm:mt-7 sm:text-5xl lg:text-7xl">
              YOUR GRADUATION,
              <br />
              YOUR STORY.
            </h1>

            {/* Description */}

            <p className="mt-7 max-w-xl text-sm leading-6 text-white/60 sm:mt-8 sm:text-lg sm:leading-7">
              Find your graduation photos and keep the
              moment forever.
            </p>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="mt-9 w-full max-w-4xl sm:mt-10">
              <form
                onSubmit={handleSearch}
                className="flex w-full flex-col gap-3 sm:flex-row"
              >
                {/* NIM INPUT */}

                <input
                  type="text"
                  value={nim}
                  onChange={(event) =>
                    setNim(event.target.value)
                  }
                  placeholder="Enter your NIM"
                  inputMode="numeric"
                  autoComplete="off"
                  style={{
                    height: "56px",
                    minHeight: "56px",
                    width: "100%",
                  }}
                  className="!box-border !block !h-14 !min-h-14 !w-full !min-w-0 !flex-none appearance-none rounded-full border border-white/20 bg-white/10 px-6 text-sm leading-6 text-white outline-none backdrop-blur-md transition placeholder:text-white/40 focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/10 sm:!flex-1"
                />

                {/* SEARCH BUTTON */}

                <button
                  type="submit"
                  style={{
                    height: "56px",
                    minHeight: "56px",
                  }}
                  className="!h-14 !min-h-14 w-full shrink-0 rounded-full bg-white px-7 text-sm font-medium text-[#071A33] transition hover:bg-white/90 active:scale-[0.99] sm:w-auto"
                >
                  Search Photos
                </button>
              </form>

              {/* Error */}

              {searchError && (
                <p className="mt-3 px-2 text-xs text-red-300">
                  {searchError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom labels */}

        <div className="absolute bottom-8 left-5 right-5 z-10 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.18em] text-white/30 sm:left-8 sm:right-8 lg:left-16 lg:right-16">
          <span>Revisual Production</span>

          <span>Scroll to explore</span>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="relative min-h-screen overflow-hidden bg-[#071A33] text-white">
        {/* Background */}

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
          style={{
            backgroundImage:
              "url('/background-section3.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-[#071A33]/75" />

        {/* Content */}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40 sm:text-sm">
              How it works
            </p>

            <h2 className="font-display mt-5 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:mt-6 sm:text-5xl lg:text-7xl">
              YOUR MEMORIES,
              <br />
              DELIVERED.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-6 text-white/45 sm:text-lg sm:leading-7">
              A simple way to find, relive, and keep your
              graduation photos.
            </p>
          </div>

          {/* Steps */}

          <div className="mt-14 grid grid-cols-1 gap-10 sm:mt-20 sm:grid-cols-3 sm:gap-8 lg:mt-24">
            {/* STEP 01 */}

            <div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.2em] text-white/40 sm:text-xs">
                  01
                </span>

                <div className="h-px w-12 bg-white/20 sm:w-16" />
              </div>

              <h3 className="mt-5 text-lg font-medium tracking-tight sm:text-xl">
                SEARCH
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Enter your NIM to find your graduation
                photos.
              </p>
            </div>

            {/* STEP 02 */}

            <div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.2em] text-white/40 sm:text-xs">
                  02
                </span>

                <div className="h-px w-12 bg-white/20 sm:w-16" />
              </div>

              <h3 className="mt-5 text-lg font-medium tracking-tight sm:text-xl">
                FIND
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Find your graduation moments from your
                event.
              </p>
            </div>

            {/* STEP 03 */}

            <div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.2em] text-white/40 sm:text-xs">
                  03
                </span>

                <div className="h-px w-12 bg-white/20 sm:w-16" />
              </div>

              <h3 className="mt-5 text-lg font-medium tracking-tight sm:text-xl">
                KEEP
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Download and keep your memories forever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UniversitasTerbuka;