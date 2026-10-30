import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, Globe2, Code2, ShoppingBag, LayoutTemplate, RefreshCw, Gauge } from "lucide-react";

import { dict, waLink, type Lang } from "@/lib/i18n";
import { Exhibition } from "@/components/Mockups";

const Globe = lazy(() => import("@/components/Globe"));
const photo = "/657361730_18037755977786273_8537682300140195437_n.jpg";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Erick Melo Studio — Desenvolvimento web internacional" },
      { name: "description", content: "Sites modernos, rápidos e interativos para negócios no Brasil e no mundo. PT · EN · ES." },
      { property: "og:title", content: "Erick Melo Studio — Web development" },
      { property: "og:description", content: "Sites modernos, rápidos e interativos para negócios no Brasil e no mundo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ICONS = [Globe2, LayoutTemplate, ShoppingBag, Code2, RefreshCw, Gauge];
const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Index() {
  const [lang, setLang] = useState<Lang>("pt");
  const t = dict[lang];
  const ids = ["about", "services", "work", "contact"];
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <div className="overflow-x-clip">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-ink-line bg-ink/80 py-2 pl-5 pr-2 text-ink-foreground backdrop-blur-md">
          <a href="#top" className="font-display text-sm font-bold tracking-tight">ERICK MELO<span className="text-glow">.</span>STUDIO</a>
          <div className="hidden gap-6 text-sm text-ink-muted md:flex">
            {t.nav.map((n, i) => <a key={n} href={`#${ids[i]}`} className="transition-colors hover:text-ink-foreground">{n}</a>)}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-ink-line p-0.5 font-mono text-[11px]">
              {(["pt", "en", "es"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`rounded-full px-2.5 py-1 uppercase transition-colors ${lang === l ? "bg-ink-foreground text-ink" : "text-ink-muted hover:text-ink-foreground"}`}>{l}</button>
              ))}
            </div>
            <a href={waLink(t.msg)} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 sm:flex">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" ref={heroRef} className="relative min-h-[100svh] overflow-hidden bg-ink text-ink-foreground">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-6 px-5 pt-28 pb-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full border border-ink-line px-3 py-1 font-mono text-xs text-ink-muted">
              <span className="size-1.5 animate-pulse rounded-full bg-glow" /> {t.badge}
            </motion.div>
            <h1 key={lang} className="mt-6 text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
              {[t.heroA, t.heroB].map((line, i) => (
                <span key={i} className="block overflow-hidden pb-1">
                  <motion.span className={`block ${i === 1 ? "text-gradient" : ""}`} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-6 max-w-md text-lg text-ink-muted">{t.heroSub}</motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7 }} className="mt-8 flex flex-wrap gap-3">
              <a href={waLink(t.msg)} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-all hover:shadow-[0_0_40px_-5px_var(--glow)]">
                {t.cta} <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
              </a>
              <a href="#work" className="inline-flex items-center rounded-full border border-ink-line px-6 py-3.5 font-medium transition-colors hover:bg-ink-line">{t.explore}</a>
            </motion.div>
          </div>
          <motion.div style={{ y: globeY, scale: globeScale }} className="relative aspect-square w-full max-w-[620px] justify-self-center">
            <div className="absolute inset-[12%] rounded-full bg-primary/25 blur-3xl" />
            <ClientOnly fallback={<div className="absolute inset-[10%] rounded-full border border-ink-line" />}>
              <Suspense fallback={null}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease }} className="absolute inset-0 touch-pan-y">
                  <Globe />
                </motion.div>
              </Suspense>
            </ClientOnly>
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[11px] text-ink-muted">{t.globeHint}</p>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-border bg-background py-5">
        <div className="animate-marquee flex w-max gap-10 font-display text-2xl font-semibold text-muted-foreground/60">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Design", "Next-gen web", "Performance", "E-commerce", "SEO", "Brasil → World", "Landing pages", "UX/UI"].map((w) => (
              <span key={w + k} className="flex items-center gap-10">{w}<span className="text-primary">✦</span></span>
            )),
          )}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="relative overflow-hidden py-28">
        <div className="grid-bg-light absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 lg:grid-cols-2">
          <Reveal className="relative mx-auto w-full max-w-md">
            <div className="animate-spin-slow absolute -right-8 -top-8 size-40 rounded-full border border-dashed border-primary/40" />
            <motion.div initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease }} className="absolute -bottom-6 -left-6 h-3/4 w-3/4 rounded-[2rem] bg-gradient-blue" />
            <div className="absolute -left-3 top-10 h-24 w-px bg-foreground" />
            <div className="relative overflow-hidden rounded-[2rem_6rem_2rem_2rem] border-8 border-card bg-card shadow-float">
            
            <motion.img src={photo} alt="Erick Melo" initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease }} className="aspect-[4/5] w-full object-cover object-top" />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} animate={{ y: [0, -8, 0] }} className="absolute -right-4 bottom-16 rounded-2xl border border-border bg-card/90 px-4 py-3 shadow-float backdrop-blur">
              <div className="font-mono text-[10px] text-muted-foreground">STATUS</div>
              <div className="flex items-center gap-2 text-sm font-semibold"><span className="size-2 animate-pulse rounded-full bg-primary" /> Disponível · Available</div>
            </motion.div>
            <div className="absolute -top-4 left-6 rounded-full bg-ink px-3 py-1 font-mono text-[10px] text-ink-foreground">&lt;founder /&gt;</div>
          </Reveal>
          <div>
            <Reveal><span className="font-mono text-xs uppercase tracking-widest text-primary">— {t.aboutTag}</span></Reveal>
            <Reveal delay={0.1}><h2 className="mt-4 text-4xl font-bold sm:text-5xl">{t.aboutTitle}</h2></Reveal>
            <Reveal delay={0.2}><p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t.aboutText}</p></Reveal>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {t.stats.map(([n, l], i) => (
                <Reveal key={l} delay={0.3 + i * 0.1} className="border-t border-foreground pt-4">
                  <div className="font-display text-3xl font-bold">{n}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{l}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-ink py-28 text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal><span className="font-mono text-xs uppercase tracking-widest text-glow">— {t.servicesTag}</span></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 max-w-2xl text-4xl font-bold sm:text-5xl">{t.servicesTitle}</h2></Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-3">
            {t.services.map(([title, desc], i) => {
              const Icon = ICONS[i] ?? Globe2;
              return (
                <Reveal key={title} delay={i * 0.06} className="group relative bg-ink p-8 transition-colors hover:bg-ink/60">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_30%_0%,color-mix(in_oklab,var(--primary)_25%,transparent),transparent_70%)]" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <Icon className="size-6 text-glow" />
                      <span className="font-mono text-xs text-ink-muted">0{i + 1}</span>
                    </div>
                    <h3 className="mt-10 text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-ink-muted">{desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="relative py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal><span className="font-mono text-xs uppercase tracking-widest text-primary">— {t.workTag}</span></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 max-w-2xl text-4xl font-bold sm:text-5xl">{t.workTitle}</h2></Reveal>
        </div>
        <div className="mt-10 px-5"><Exhibition note={t.workNote} /></div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden bg-ink px-5 py-32 text-center text-ink-foreground">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(circle,black,transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <Reveal><h2 className="text-5xl font-bold sm:text-6xl">{t.contactTitle}</h2></Reveal>
          <Reveal delay={0.1}><p className="mt-5 text-lg text-ink-muted">{t.contactSub}</p></Reveal>
          <Reveal delay={0.2}>
            <a href={waLink(t.msg)} target="_blank" rel="noreferrer" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_60px_-5px_var(--glow)]">
              <MessageCircle className="size-5" /> {t.cta} <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
            </a>
          </Reveal>
        </div>
      </section>
      <footer className="bg-ink px-5 pb-8 text-ink-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-ink-line pt-6 font-mono text-xs">
          <span>© {new Date().getFullYear()} Erick Melo Studio. {t.footer}</span>
          <span>PT · EN · ES</span>
        </div>
      </footer>
    </div>
  );
}
