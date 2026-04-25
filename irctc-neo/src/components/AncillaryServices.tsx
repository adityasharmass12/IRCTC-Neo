import { useRef, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Utensils, Bed, Map, Wallet, Shield, Package,
  ArrowUpRight, type LucideIcon
} from "lucide-react";
import { features } from "@/data/mockData";
import { useLang } from "@/i18n/LanguageProvider";
const iconMap: Record<string, LucideIcon> = {
  Utensils, Bed, Map, Wallet, Shield, Package
};
const serviceGradients = [
  "linear-gradient(135deg, #1a3a5c, #2a5a8c)",   
  "linear-gradient(135deg, #1e4d3a, #2a7a5a)",   
  "linear-gradient(135deg, #3a3a6a, #5a5a9a)",   
  "linear-gradient(135deg, #5a3a1a, #8a5a2a)",   
  "linear-gradient(135deg, #5a1a1a, #8a2a2a)",   
  "linear-gradient(135deg, #1a3a3a, #2a5a5a)",   
];
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
};
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-5px)`;
    el.style.setProperty("--spotlight-x", `${x}px`);
    el.style.setProperty("--spotlight-y", `${y}px`);
  }, []);
  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1) translateY(0)";
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out",
        willChange: "transform",
      }}
    >
      {children}
      {}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: "radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(74,130,184,0.10), transparent 40%)",
          pointerEvents: "none",
          opacity: 0.8,
        }}
      />
    </div>
  );
}
export default function AncillaryServices() {
  const { t } = useLang();
  return (
    <section id="services" className="relative z-10 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] mb-5"
            style={{
              fontFamily: "var(--font-ui)",
              background: "var(--clr-primary-dim)",
              color: "var(--clr-primary)",
              border: "1px solid var(--clr-border)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--clr-primary)" }} />
            Additional Services
          </motion.span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold hero-text-shadow"
            style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
          >
            {t.servicesBeyond}
          </h2>
          <p
            className="mt-4 text-sm sm:text-base max-w-xl mx-auto hero-sub-shadow"
            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
          >
            {t.servicesDesc}
          </p>
        </motion.div>
        {}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Package;
            const grad = serviceGradients[index % serviceGradients.length];
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
              >
                <TiltCard className="service-card p-6 flex flex-col gap-4 relative overflow-hidden">
                  {}
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: grad }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  {}
                  <div>
                    <h3
                      className="text-base font-semibold mb-2 flex items-center gap-2"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                    >
                      {feature.title}
                      <ArrowUpRight
                        className="w-3.5 h-3.5 opacity-40 transition-opacity"
                        style={{ color: "var(--clr-muted)" }}
                      />
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                  {}
                  <div>
                    <motion.button
                      className="text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-primary)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--clr-accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--clr-primary)";
                      }}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      Learn more
                      <ArrowUpRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}