import Link from "next/link";

const highlights = [
  {
    title: "Instant Solo Battles",
    description:
      "Pick two champions, spark the arena, and let the outcome unfold in seconds.",
  },
  {
    title: "Curated Match Rooms",
    description:
      "Craft private rooms for friends with refined rules and clear win records.",
  },
  {
    title: "Legend Tracking",
    description:
      "Every win and loss is preserved, building a personal archive of prestige.",
  },
];

const steps = [
  {
    title: "Create Your Server",
    description:
      "Name a private arena and set the tone for the duel. Share only with those you trust.",
  },
  {
    title: "Invite a Friend",
    description:
      "Send a refined request to a friend who is logged in and ready to battle.",
  },
  {
    title: "Choose Your Champions",
    description:
      "Each trainer selects one Pokemon in secret. Reveal only when both are ready.",
  },
  {
    title: "Start the Fight",
    description:
      "Launch a cinematic battle and record the result in your personal history.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f1e7] text-[#1f2a24]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#d8c6a6]/70 blur-[120px] animate-[float_10s_ease-in-out_infinite]" />
        <div className="absolute right-[-120px] top-[-40px] h-96 w-96 rounded-full bg-[#b36b4c]/40 blur-[140px] animate-[float_12s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-140px] left-1/3 h-96 w-96 rounded-full bg-[#7aa089]/40 blur-[160px] animate-[float_14s_ease-in-out_infinite]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 rounded-full border border-[#1f2a24]/20 bg-[#fef8ee] shadow-[0_0_0_6px_rgba(31,42,36,0.05)]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8a6f45]">
              PokeWar
            </p>
            <p className="text-lg font-semibold tracking-tight">Prestige Arena</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          <Link href="#try-free" className="hover:text-[#8a6f45]">
            Try for Free
          </Link>
          <Link href="#multiplayer" className="hover:text-[#8a6f45]">
            Multiplayer
          </Link>
          <Link href="#access" className="hover:text-[#8a6f45]">
            Login
          </Link>
        </nav>
        <Link
          href="/play"
          className="rounded-full border border-[#1f2a24]/20 bg-[#1f2a24] px-5 py-2 text-sm font-semibold text-[#f6f1e7] shadow-[0_10px_30px_rgba(31,42,36,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(31,42,36,0.35)]"
        >
          Enter the Arena
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-20 pt-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a6f45]">
              A Luxurious Pokemon Duel Experience
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[#1f2a24] md:text-5xl lg:text-6xl">
              Where elite trainers craft rivalries, and every battle feels
              ceremonial.
            </h1>
            <p className="mt-5 text-lg text-[#4a3f31]">
              PokeWar elevates quick battles into an experience worthy of a
              champion. Enjoy curated rooms, private invites, and a record of
              every triumph.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/play"
                className="rounded-full bg-[#1f2a24] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6f1e7] shadow-[0_15px_35px_rgba(31,42,36,0.3)] transition hover:-translate-y-0.5"
              >
                Try for Free
              </Link>
              <Link
                href="#multiplayer"
                className="rounded-full border border-[#1f2a24]/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
              >
                Multiplayer Preview
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-[#4a3f31]">
              <div>
                <p className="text-2xl font-semibold text-[#1f2a24]">1,000+</p>
                <p className="uppercase tracking-[0.2em]">Pokemon Roster</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1f2a24]">Private</p>
                <p className="uppercase tracking-[0.2em]">Invite Only Rooms</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1f2a24]">Instant</p>
                <p className="uppercase tracking-[0.2em]">Match Results</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-[#1f2a24]/10 bg-white/70 p-8 shadow-[0_30px_80px_rgba(31,42,36,0.25)] backdrop-blur">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#8a6f45]">
                <span>Match Room</span>
                <span>Velvet Vault</span>
              </div>
              <div className="mt-8 grid gap-4">
                <div className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#8a6f45]">
                    Trainer One
                  </p>
                  <p className="mt-2 text-lg font-semibold">Aurelia</p>
                  <p className="text-sm text-[#4a3f31]">Champion: Lucario</p>
                </div>
                <div className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#8a6f45]">
                    Trainer Two
                  </p>
                  <p className="mt-2 text-lg font-semibold">Soren</p>
                  <p className="text-sm text-[#4a3f31]">Champion: Milotic</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-full border border-[#1f2a24]/15 bg-white px-5 py-3 text-sm font-semibold text-[#1f2a24]">
                <span>Battle begins in</span>
                <span className="rounded-full bg-[#1f2a24] px-3 py-1 text-[#f6f1e7]">
                  00:12
                </span>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 rounded-full border border-[#1f2a24]/20 bg-[#fdf7ed] px-6 py-4 text-xs uppercase tracking-[0.35em] text-[#8a6f45] shadow-[0_15px_40px_rgba(31,42,36,0.2)]">
              Cinematic Results
            </div>
          </div>
        </section>

        <section id="try-free" className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a6f45]">
              Try for Free
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[#1f2a24] md:text-4xl">
              Enter the arena with no commitment.
            </h2>
            <p className="mt-4 text-base text-[#4a3f31]">
              Choose your champions, spark a duel, and enjoy the full spectacle
              without creating an account. It&apos;s the fastest way to feel the
              thrill of PokeWar.
            </p>
            <Link
              href="/play"
              className="mt-6 inline-flex rounded-full border border-[#1f2a24]/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
            >
              Launch Solo Duel
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#1f2a24]/10 bg-white/70 p-5 shadow-[0_15px_40px_rgba(31,42,36,0.12)] backdrop-blur"
              >
                <h3 className="text-lg font-semibold text-[#1f2a24]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[#4a3f31]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="multiplayer"
          className="rounded-[40px] border border-[#1f2a24]/10 bg-[#fefaf1] p-10 shadow-[0_30px_70px_rgba(31,42,36,0.12)]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a6f45]">
                Multiplayer
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[#1f2a24] md:text-4xl">
                Private servers built for duels among friends.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-[#4a3f31]">
                Host a refined arena, invite your circle, and watch every match
                unfold with transparency and style. This is where rivals become
                legends.
              </p>
            </div>
            <Link
              href="#access"
              className="inline-flex rounded-full bg-[#1f2a24] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f6f1e7] shadow-[0_15px_35px_rgba(31,42,36,0.3)] transition hover:-translate-y-0.5"
            >
              Get Multiplayer Access
            </Link>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[#1f2a24]/10 bg-white/70 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8a6f45]">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-[#1f2a24]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-[#4a3f31]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="access"
          className="grid gap-10 rounded-[36px] border border-[#1f2a24]/10 bg-white/70 p-10 shadow-[0_20px_60px_rgba(31,42,36,0.12)] lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a6f45]">
              Login or Sign Up
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[#1f2a24] md:text-4xl">
              Create your trainer vault and preserve every victory.
            </h2>
            <p className="mt-4 text-base text-[#4a3f31]">
              Access your profile, track match results, and receive friend
              invites instantly. Only email and Google are needed.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/auth/signup"
              className="rounded-2xl bg-[#1f2a24] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-[#f6f1e7] shadow-[0_15px_35px_rgba(31,42,36,0.3)] transition hover:-translate-y-0.5"
            >
              Sign Up with Email
            </Link>
            <Link
              href="/auth/login"
              className="rounded-2xl border border-[#1f2a24]/20 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
            >
              Login to Your Vault
            </Link>
            <div className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-5 text-sm text-[#4a3f31]">
              <p className="font-semibold text-[#1f2a24]">
                Google access, curated.
              </p>
              <p className="mt-2">
                Continue with Google for instant access to multiplayer servers.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#1f2a24]/10 px-6 py-8 text-sm text-[#4a3f31]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p className="uppercase tracking-[0.3em] text-[#8a6f45]">
            PokeWar Prestige Arena
          </p>
          <p>Crafted for trainers who value ritual and rivalry.</p>
        </div>
      </footer>
    </div>
  );
}
