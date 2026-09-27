import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/api.functions";
import { ArrowUp, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/apni-baat-logo.png.asset.json";

const HINDI_DAYS = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const HINDI_MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];

function formatHindiDate(date: Date): string {
  const day = HINDI_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const month = HINDI_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day}, ${dayNum} ${month} ${year}`;
}

const navItems = [
  ["टेक", "technology"],
  ["विश्व", "world"],
  ["राजनीति", "politics"],
  ["व्यापार", "business"],
  ["विज्ञान", "science"],
  ["स्वास्थ्य", "health"],
  ["विचार", "opinion"],
] as const;

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = window.localStorage.getItem("apnibaat-theme");
    const nextDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  useEffect(() => {
    setCurrentDate(formatHindiDate(new Date()));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("apnibaat-theme", next ? "dark" : "light");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_20px_-8px_oklch(0.2_0.02_260_/_0.15)]" : ""
      }`}
    >
      <div className="border-b border-border bg-muted/50">
        <div className="content-shell flex h-9 items-center justify-between font-sans text-[0.68rem] text-muted-foreground">
          <span className="truncate">{currentDate || "\u00A0"}</span>
          <span className="hidden items-center gap-3 sm:flex">
            <span className="hidden md:inline">हिंदी समाचार और विश्लेषण</span>
            <span className="hidden md:inline text-border">·</span>
            <Link to="/news" className="transition-colors hover:text-primary">सभी खबरें</Link>
          </span>
        </div>
      </div>

      <div className="content-shell flex h-16 items-center gap-2 sm:h-[4.5rem] sm:gap-3 xl:gap-6">
        <Link to="/" className="mr-auto flex min-w-0 items-center" aria-label="अपनीबात मुखपृष्ठ">
          <img
            src={logoAsset.url}
            alt="अपनीबात — हिंदी समाचार"
            className="h-auto w-36 object-contain sm:w-44 dark:brightness-0 dark:invert"
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="मुख्य नेविगेशन">
          <Link to="/" className="nav-link" activeProps={{ className: "nav-link text-foreground" }}>
            होम
          </Link>
          {navItems.map(([label, slug]) => (
            <Link
              key={slug}
              to="/category/$slug"
              params={{ slug }}
              className="nav-link"
              activeProps={{ className: "nav-link text-foreground" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-full"
            aria-label="खोजें"
            onClick={() => navigate({ to: "/news" })}
          >
            <Search className="size-[1.05rem]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-full"
            onClick={toggleTheme}
            aria-label={dark ? "लाइट मोड पर जाएँ" : "डार्क मोड पर जाएँ"}
          >
            {dark ? <Sun className="size-[1.05rem]" /> : <Moon className="size-[1.05rem]" />}
          </Button>
          <Button variant="breaking" size="sm" className="ml-1 hidden shrink-0 rounded-full px-5 font-bold sm:inline-flex">
            सब्सक्राइब
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-full lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="मेन्यू"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="content-shell grid max-h-[calc(100dvh-7rem)] grid-cols-2 gap-1 overflow-y-auto border-t border-border py-3 sm:grid-cols-3 lg:hidden"
          aria-label="मोबाइल नेविगेशन"
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-4 py-3 font-sans text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            होम
          </Link>
          {navItems.map(([label, slug]) => (
            <Link
              key={slug}
              to="/category/$slug"
              params={{ slug }}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-4 py-3 font-sans text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

const emailSchema = z.string().trim().email().max(255);

export function Newsletter() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const subscribe = useServerFn(subscribeNewsletter);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const result = emailSchema.safeParse(new FormData(formEl).get("email"));
    if (!result.success) return setStatus("कृपया सही ईमेल पता दर्ज करें।");
    setBusy(true);
    try {
      const r = await subscribe({ data: { email: result.data } });
      if (r.ok) {
        setStatus("धन्यवाद! आपने सफलतापूर्वक सब्सक्राइब कर लिया है।");
        formEl.reset();
      } else {
        setStatus(/already|exist/i.test(r.message) ? "यह ईमेल पहले से सब्सक्राइब है।" : "सब्सक्रिप्शन पूरा नहीं हो सका। कृपया पुनः प्रयास करें।");
      }
    } catch {
      setStatus("सब्सक्रिप्शन पूरा नहीं हो सका। कृपया पुनः प्रयास करें।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="content-shell py-12 sm:py-16">
      <div className="newsletter-band relative grid items-center gap-6 overflow-hidden rounded-2xl px-6 py-10 shadow-xl sm:px-10 sm:py-12 md:grid-cols-[1fr_1.2fr] md:gap-10 md:px-14">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/70">
            न्यूज़लेटर
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            खबरों से जुड़े रहें।
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/80">
            चुनिंदा खबरें और विश्लेषण सीधे आपके इनबॉक्स में — हर सुबह।
          </p>
        </div>
        <form onSubmit={submit} noValidate className="relative">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">ईमेल पता</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              maxLength={255}
              placeholder="आपका ईमेल पता"
              className="h-12 min-w-0 flex-1 rounded-full border border-white/20 bg-white/95 px-5 text-sm text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-white/60"
            />
            <Button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-ink px-6 font-bold text-paper hover:bg-ink/90"
              disabled={busy}
            >
              {busy ? "भेजा जा रहा है…" : "सब्सक्राइब करें"}
            </Button>
          </div>
          {status ? (
            <p className="mt-3 text-xs font-medium text-white/90" role="status">{status}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

/** Floating scroll-to-top button — sits above the sticky anchor ad. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="शीर्ष पर जाएँ"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-24 right-4 z-40 grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 sm:bottom-28 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}

/* ---------------- Footer ---------------- */

type FooterLink =
  | { label: string; to: LinkProps["to"]; params?: Record<string, string>; search?: Record<string, unknown> }
  | { label: string; href: string; external?: true };

const FOOTER_SECTIONS: FooterLink[] = [
  { label: "टेक्नोलॉजी", to: "/category/$slug", params: { slug: "technology" } },
  { label: "विश्व", to: "/category/$slug", params: { slug: "world" } },
  { label: "व्यापार", to: "/category/$slug", params: { slug: "business" } },
  { label: "विज्ञान", to: "/category/$slug", params: { slug: "science" } },
];

const FOOTER_COMPANY: FooterLink[] = [
  { label: "हमारे बारे में", to: "/about" },
  { label: "संपर्क", to: "/contact" },
  { label: "करियर", to: "/careers" },
  { label: "विज्ञापन", to: "/advertise" },
];

const FOOTER_INFO: FooterLink[] = [
  { label: "न्यूज़लेटर", to: "/newsletter" },
  { label: "गोपनीयता", to: "/privacy" },
  { label: "नियम", to: "/terms" },
  { label: "RSS", to: "/rss" },
];

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border bg-card">
      <div className="content-shell grid grid-cols-2 gap-8 py-10 sm:gap-10 sm:py-12 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="inline-flex items-center" aria-label="अपनीबात मुखपृष्ठ">
            <img
              src="/AB-1.png"
              alt="अपनीबात"
              width={44}
              height={44}
              className="h-10 w-10 object-contain"
            />
            <span className="ml-2 font-display text-lg font-extrabold text-foreground">
              अपनीबात
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            स्वतंत्र हिंदी पत्रकारिता, समाचार और गहन विश्लेषण।
          </p>
        </div>

        <FooterCol title="सेक्शन" links={FOOTER_SECTIONS} />
        <FooterCol title="कंपनी" links={FOOTER_COMPANY} />
        <FooterCol title="जानकारी" links={FOOTER_INFO} />
      </div>

      <div className="border-t border-border">
        <div className="content-shell flex flex-col items-center justify-between gap-2 py-4 font-sans text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} अपनीबात. सर्वाधिकार सुरक्षित।</span>
          <span className="hidden sm:inline">भारत में हिंदी में तैयार।</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="font-sans text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.label}>
            {"href" in link ? (
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.to}
                params={link.params as never}
                search={link.search as never}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}