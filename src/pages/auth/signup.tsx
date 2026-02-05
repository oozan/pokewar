import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import { useAuth } from "@/lib/auth-context";
import {
  passwordRules,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/validation";

export default function SignupPage() {
  const router = useRouter();
  const { user, ready, signupWithEmail } = useAuth();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) {
      router.replace("/multiplayer");
    }
  }, [ready, user, router]);

  const nameError = useMemo(
    () => (touched.name ? validateDisplayName(formState.name) : ""),
    [touched.name, formState.name]
  );
  const emailError = useMemo(
    () => (touched.email ? validateEmail(formState.email) : ""),
    [touched.email, formState.email]
  );
  const passwordIssues = useMemo(
    () => (touched.password ? validatePassword(formState.password) : []),
    [touched.password, formState.password]
  );
  const confirmError = useMemo(
    () =>
      touched.confirmPassword
        ? validatePasswordMatch(formState.password, formState.confirmPassword)
        : "",
    [touched.confirmPassword, formState.password, formState.confirmPassword]
  );

  const handleChange = (
    field: "name" | "email" | "password" | "confirmPassword",
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (
    field: "name" | "email" | "password" | "confirmPassword"
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const errors = [
      validateDisplayName(formState.name),
      validateEmail(formState.email),
      ...validatePassword(formState.password),
      validatePasswordMatch(formState.password, formState.confirmPassword),
    ].filter(Boolean);

    if (errors.length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signupWithEmail({
        name: formState.name,
        email: formState.email,
        password: formState.password,
      });
      router.push("/multiplayer");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not create your account.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
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
            New Trainer
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Create your vault and join the prestige arena.
          </h1>
          <p className="mt-4 text-base text-[#4a3f31]">
            Your profile will track every victory, every rivalry, and every
            moment of glory.
          </p>
          <div className="mt-8 text-sm text-[#4a3f31]">
            <p className="font-semibold text-[#1f2a24]">
              Already a member?
            </p>
            <Link
              href="/auth/login"
              className="mt-2 inline-flex rounded-full border border-[#1f2a24]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
            >
              Login instead
            </Link>
          </div>
        </div>

        <div className="flex-1 rounded-[32px] border border-[#1f2a24]/10 bg-white/80 p-8 shadow-[0_30px_70px_rgba(31,42,36,0.15)] backdrop-blur">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                Display Name
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => handleChange("name", event.target.value)}
                onBlur={() => handleBlur("name")}
                className="mt-2 w-full rounded-2xl border border-[#1f2a24]/20 bg-white px-4 py-3 text-sm focus:border-[#8a6f45] focus:outline-none focus:ring-2 focus:ring-[#8a6f45]/40"
                placeholder="Aurelia"
                aria-invalid={Boolean(nameError)}
              />
              {nameError && (
                <p className="mt-2 text-xs font-semibold text-[#b3502c]">
                  {nameError}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                Email
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(event) => handleChange("email", event.target.value)}
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
                placeholder="Choose a strong password"
                aria-invalid={passwordIssues.length > 0}
              />
              {passwordIssues.length > 0 && (
                <div className="mt-3 rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] px-4 py-3 text-xs text-[#4a3f31]">
                  <p className="font-semibold text-[#1f2a24]">
                    Password must include:
                  </p>
                  <ul className="mt-2 list-disc pl-4">
                    {passwordRules.map((rule) => (
                      <li
                        key={rule.label}
                        className={
                          rule.test(formState.password)
                            ? "text-[#6f8457]"
                            : ""
                        }
                      >
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                Confirm Password
              </label>
              <input
                type="password"
                value={formState.confirmPassword}
                onChange={(event) =>
                  handleChange("confirmPassword", event.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                className="mt-2 w-full rounded-2xl border border-[#1f2a24]/20 bg-white px-4 py-3 text-sm focus:border-[#8a6f45] focus:outline-none focus:ring-2 focus:ring-[#8a6f45]/40"
                placeholder="Repeat your password"
                aria-invalid={Boolean(confirmError)}
              />
              {confirmError && (
                <p className="mt-2 text-xs font-semibold text-[#b3502c]">
                  {confirmError}
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
              Create Account
            </button>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isSubmitting}
              className="rounded-2xl border border-[#1f2a24]/20 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Sign Up with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
