import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Kind = "restaurant" | "fashion" | "corporate" | "clinic" | "portfolio" | "shop";

const META: Record<Kind, { name: string; url: string; tone: string }> = {
  restaurant: { name: "Brasa & Co.", url: "brasaco.com", tone: "Restaurante" },
  fashion: { name: "NOIR/ATELIER", url: "noiratelier.store", tone: "Moda" },
  corporate: { name: "Vertex Group", url: "vertexgroup.io", tone: "Empresa" },
  clinic: { name: "Clínica Alba", url: "clinicaalba.med", tone: "Clínica" },
  portfolio: { name: "Lia Moreno", url: "liamoreno.design", tone: "Portfólio" },
  shop: { name: "Kōfi Market", url: "kofimarket.shop", tone: "E-commerce" },
};

function Screen({ kind }: { kind: Kind }) {
  switch (kind) {
    case "restaurant":
      return (
        <div className="h-full bg-ink p-4 text-ink-foreground">
          <div className="flex justify-between font-mono text-[9px] text-ink-muted"><span>MENU</span><span>RESERVAR</span></div>
          <div className="mt-6 font-display text-2xl leading-none">Fogo,<br />tempo<br />& sabor.</div>
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => <div key={i} className="aspect-square rounded-full bg-gradient-to-br from-ink-muted/60 to-ink-line" />)}
          </div>
          <div className="mt-3 h-5 w-20 rounded-full bg-primary" />
        </div>
      );
    case "fashion":
      return (
        <div className="grid h-full grid-cols-2 bg-card">
          <div className="bg-gradient-to-b from-secondary to-border" />
          <div className="flex flex-col justify-between p-3">
            <div className="font-mono text-[8px] tracking-widest">SS/27</div>
            <div className="font-display text-lg leading-none">NEW<br />NOIR</div>
            <div className="text-[8px] underline">Shop now →</div>
          </div>
        </div>
      );
    case "corporate":
      return (
        <div className="h-full bg-card p-4">
          <div className="h-2 w-12 rounded bg-foreground" />
          <div className="mt-5 h-3 w-4/5 rounded bg-foreground/80" />
          <div className="mt-1.5 h-3 w-3/5 rounded bg-foreground/80" />
          <div className="mt-4 flex items-end gap-1.5">
            {[40, 65, 50, 85, 70, 95].map((h, i) => <div key={i} style={{ height: h * 0.5 }} className="w-4 rounded-t bg-primary/80" />)}
          </div>
        </div>
      );
    case "clinic":
      return (
        <div className="h-full bg-accent p-4">
          <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-primary" /><div className="h-2 w-14 rounded bg-accent-foreground/60" /></div>
          <div className="mt-5 font-display text-lg leading-tight text-accent-foreground">Cuidado que<br />acolhe.</div>
          <div className="mt-3 rounded-lg bg-card p-2 shadow-sm">
            <div className="h-1.5 w-16 rounded bg-muted-foreground/40" />
            <div className="mt-1.5 h-4 rounded bg-primary text-center text-[8px] leading-4 text-primary-foreground">Agendar</div>
          </div>
        </div>
      );
    case "portfolio":
      return (
        <div className="h-full bg-background p-3">
          <div className="font-display text-xl">Lia —</div>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`rounded ${i % 2 ? "bg-foreground" : "bg-gradient-blue"} ${i === 0 ? "col-span-2 row-span-2" : ""} aspect-square`} />
            ))}
          </div>
        </div>
      );
    case "shop":
      return (
        <div className="h-full bg-secondary p-3">
          <div className="flex justify-between"><div className="h-2 w-10 rounded bg-foreground" /><div className="size-3 rounded-full bg-primary" /></div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-md bg-card p-1.5">
                <div className="aspect-square rounded bg-gradient-to-br from-border to-muted-foreground/30" />
                <div className="mt-1 h-1 w-8 rounded bg-foreground/60" />
              </div>
            ))}
          </div>
        </div>
      );
  }
}

export function Browser({ kind, className = "" }: { kind: Kind; className?: string }) {
  const m = META[kind];
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-card shadow-float ${className}`}>
      <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2">
        <div className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="size-2 rounded-full bg-border" />)}</div>
        <div className="flex-1 truncate rounded-md bg-card px-2 py-0.5 text-center font-mono text-[10px] text-muted-foreground">{m.url}</div>
      </div>
      <div className="aspect-[4/3]"><Screen kind={kind} /></div>
    </div>
  );
}

const LAYOUT: { kind: Kind; cls: string; speed: number }[] = [
  { kind: "restaurant", cls: "left-[2%] top-[4%] w-[44%] md:w-[30%]", speed: -120 },
  { kind: "fashion", cls: "right-[4%] top-[0%] w-[42%] md:w-[26%]", speed: 80 },
  { kind: "corporate", cls: "left-[30%] top-[30%] w-[48%] md:w-[34%] z-10", speed: -40 },
  { kind: "clinic", cls: "left-[0%] top-[56%] w-[40%] md:w-[24%]", speed: 140 },
  { kind: "portfolio", cls: "right-[0%] top-[46%] w-[44%] md:w-[28%]", speed: -160 },
  { kind: "shop", cls: "left-[34%] top-[72%] w-[40%] md:w-[26%]", speed: 60 },
];

export function Exhibition({ note }: { note: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <div ref={ref} className="relative mx-auto h-[780px] max-w-6xl md:h-[900px]">
      {LAYOUT.map((l, i) => (
        <Item key={l.kind} {...l} i={i} progress={scrollYProgress} note={note} />
      ))}
    </div>
  );
}

function Item({ kind, cls, speed, i, progress, note }: (typeof LAYOUT)[number] & { i: number; progress: ReturnType<typeof useScroll>["scrollYProgress"]; note: string }) {
  const y = useTransform(progress, [0, 1], [speed, -speed]);
  const rotate = useTransform(progress, [0, 1], [i % 2 ? 4 : -4, i % 2 ? -3 : 3]);
  return (
    <motion.div style={{ y, rotate }} className={`absolute ${cls}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
        className="group relative"
      >
        <Browser kind={kind} />
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>{META[kind].name}</span><span>{META[kind].tone} · {note}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
