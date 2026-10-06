import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-[#071A33]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 border-b border-white/50 pb-8  sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="shrink-0">
            <img
              src="/Logotype Revisual White.png"
              alt="Revisual Production"
              className="h-6 w-auto"/>
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white/60">
            <Link to="/about" className="transition hover:text-white">
              About
            </Link>
            <Link to="/services" className="transition hover:text-white">
              Services
            </Link>
            {/* <Link to="/portfolio" className="transition hover:text-white">
              Portfolio
            </Link>
            <Link to="/blogs" className="transition hover:text-white">
              Blogs
            </Link> */}
            <Link to="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © 2026 Revisual Production. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/50">
            <Link
              to="/instagram"
              aria-label="Instagram"
              className="transition hover:text-white">
              Instagram
            </Link>
            <Link
              to="/youtube"
              aria-label="YouTube"
              className="transition hover:text-white">
              YouTube
            </Link>
            <Link
              to="/spotify"
              aria-label="Spotify"
              className="transition hover:text-white">
              Spotify
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
