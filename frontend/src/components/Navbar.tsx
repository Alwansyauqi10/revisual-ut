import { useState } from "react";
import { Link } from "react-router";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-[#071A33]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* LOGO */}
        <Link to="/" onClick={closeMenu}>
          <img
            className="h-4 w-auto"
            src="/Logotype Revisual White.png"
            alt="Revisual Production"/>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/about"
            className="text-sm text-white/70 transition hover:text-white">
            About
          </Link>
          <Link
            to="/services"
            className="text-sm text-white/70 transition hover:text-white">
            Services
          </Link>
          {/* <Link
            to="/portfolio"
            className="text-sm text-white/70 transition hover:text-white">
            Portfolio
          </Link> */}
          {/* <Link
            to="/blog"
            className="text-sm text-white/70 transition hover:text-white">
            Blogs
          </Link> */}
          <Link 
            to="/contact"
            className="text-sm text-white/70 transition hover:text-white">
            Contact
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}>

          {isMenuOpen ? (
            <span className="text-3xl font-light leading-none">×</span>
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="block h-px w-5 bg-white" />
              <span className="block h-px w-5 bg-white" />
              <span className="block h-px w-5 bg-white" />
            </div>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#071A33]/95 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            <Link
              to="/about"
              onClick={closeMenu}
              className="text-sm text-white/70 transition hover:text-white">
              About
            </Link>
            <Link
              to="/services"
              onClick={closeMenu}
              className="text-sm text-white/70 transition hover:text-white">
              Services
            </Link>
            <Link
              to="/portfolio"
              onClick={closeMenu}
              className="text-sm text-white/70 transition hover:text-white">
              Portfolio
            </Link>
            <Link
              to="/blog"
              onClick={closeMenu}
              className="text-sm text-white/70 transition hover:text-white">
              Blogs
            </Link>
            <Link
              to="/teams"
              onClick={closeMenu}
              className="text-sm text-white/70 transition hover:text-white">
              Teams
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="text-sm text-white/70 transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
