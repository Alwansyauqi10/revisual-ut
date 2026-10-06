import { useState } from "react";
import { useNavigate } from "react-router";

import { loginService } from "@/services/authService";
import { saveAuth } from "@/services/authStorage";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError(
        "Email and password are required.",
      );
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response =
        await loginService(
          email.trim(),
          password,
        );

      saveAuth(
        response.data.token,
        response.data.user,
      );

      navigate("/admin/events", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "LOGIN FAILED:",
        error,
      );

      setError(
        "Invalid email or password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071A33] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <p className="font-display text-2xl font-semibold tracking-tight">
              REVISUAL
            </p>

            <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Admin Dashboard
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Welcome back
            </p>

            <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              SIGN IN.
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/50">
              Sign in to manage graduation
              events and student photos.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-white/80"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@revisualproduction.com"
                autoComplete="email"
                disabled={isLoading}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/80"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
                <p className="text-sm text-red-300">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-white px-5 text-sm font-medium text-[#071A33] transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <p className="mt-10 text-xs leading-5 text-white/25">
            Revisual Production · Admin
            Portal
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;