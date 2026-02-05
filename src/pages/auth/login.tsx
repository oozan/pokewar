import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import { useAuth } from "@/lib/auth-context";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const { user, ready, loginWithEmail } = useAuth();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) {
      router.replace("/multiplayer");
    }
  }, [ready, user, router]);

  const emailError = useMemo(
    () => (touched.email ? validateEmail(formState.email) : ""),
    [touched.email, formState.email]
  );

  const passwordIssues = useMemo(
    () => (touched.password ? validatePassword(formState.password) : []),
    [touched.password, formState.password]
  );

  const handleChange = (field: "email" | "password", value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    setTouched({ email: true, password: true });

    const emailMessage = validateEmail(formState.email);
    const passwordMessages = validatePassword(formState.password);
    if (emailMessage || passwordMessages.length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await loginWithEmail({
        email: formState.email,
        password: formState.password,
      });
      router.push("/multiplayer");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not log you in with that email.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError("");
    try {
      setIsSubmitting(true);
      await signIn("google", { callbackUrl: "/multiplayer" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not continue with Google.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready || user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7] px-6 py-16 text-[#1f2a24]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a6f45]">
            Welcome Back
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Enter your trainer vault and resume the duel.
          </h1>
          <p className="mt-4 text-base text-[#4a3f31]">
            Access multiplayer servers, track your battle record, and accept
            friend requests instantly.
          </p>
          <div className="mt-8 text-sm text-[#4a3f31]">
            <p className="font-semibold text-[#1f2a24]">
              No account yet?
            </p>
            <Link
              href="/auth/signup"
              className="mt-2 inline-flex rounded-full border border-[#1f2a24]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
            >
              Create an account
            </Link>
          </div>
        </div>

        <div className="flex-1 rounded-[32px] border border-[#1f2a24]/10 bg-white/80 p-8 shadow-[0_30px_70px_rgba(31,42,36,0.15)] backdrop-blur">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                Email
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(event) =>
                  handleChange("email", event.target.value)
                }
                onBlur={() => handleBlur("email")}
                className="mt-2 w-full rounded-2xl border border-[#1f2a24]/20 bg-white px-4 py-3 text-sm focus:border-[#8a6f45] focus:outline-none focus:ring-2 focus:ring-[#8a6f45]/40"
                placeholder="trainer@pokewar.com"
                aria-invalid={Boolean(emailError)}
              />
              {emailError && (
                <p className="mt-2 text-xs font-semibold text-[#b3502c]">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                Password
              </label>
              <input
                type="password"
                value={formState.password}
                onChange={(event) =>
                  handleChange("password", event.target.value)
                }
                onBlur={() => handleBlur("password")}
                className="mt-2 w-full rounded-2xl border border-[#1f2a24]/20 bg-white px-4 py-3 text-sm focus:border-[#8a6f45] focus:outline-none focus:ring-2 focus:ring-[#8a6f45]/40"
                placeholder="At least 8 characters"
                aria-invalid={passwordIssues.length > 0}
              />
              {passwordIssues.length > 0 && (
                <p className="mt-2 text-xs font-semibold text-[#b3502c]">
                  {passwordIssues[0]}
                </p>
              )}
            </div>

            {formError && (
              <div className="rounded-2xl border border-[#b3502c]/30 bg-[#fbe8df] px-4 py-3 text-xs font-semibold text-[#b3502c]">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-[#1f2a24] px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#f6f1e7] shadow-[0_15px_35px_rgba(31,42,36,0.3)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Login with Email
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="rounded-2xl border border-[#1f2a24]/20 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
