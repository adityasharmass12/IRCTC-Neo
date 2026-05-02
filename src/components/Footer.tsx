import { Mail, Phone, MapPin, ExternalLink, Train } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
const quickLinks = [
  { label: "Book Train Ticket",  href: "#booking" },
  { label: "PNR Status Check",   href: "#booking" },
  { label: "Train Schedule",    href: "#" },
  { label: "Seat Availability", href: "#" },
  { label: "Fare Enquiry",      href: "#" },
];
const services = [
  { label: "eCatering",         href: "#services" },
  { label: "Retiring Rooms",    href: "#services" },
  { label: "Tourism Packages",   href: "#services" },
  { label: "Travel Insurance",   href: "#services" },
  { label: "IRCTC iMudra",       href: "#services" },
];
const policies = [
  { label: "Cancellation Policy", href: "#" },
  { label: "Refund Rules",        href: "#" },
  { label: "Privacy Policy",      href: "#" },
  { label: "Terms of Use",        href: "#" },
  { label: "Accessibility",       href: "#" },
];
export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 mt-6">
      <div
        style={{
          background: "var(--clr-surface)",
          borderTop: "1px solid var(--clr-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--clr-primary)" }}
                >
                  <Train className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span
                    className="text-base font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                  >
                    IRCTC
                  </span>
                  <p
                    className="text-[9px] tracking-[0.12em] uppercase font-medium mt-0.5"
                    style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                  >
                    Indian Railway Catering & Tourism Corp.
                  </p>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
              >
                {t.footerDesc}
              </p>
              <div className="space-y-2.5">
                <a
                  href="tel:14646"
                  className="flex items-center gap-2.5 text-sm transition-colors"
                  style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.helpline}</span>
                </a>
                <a
                  href="mailto:care@irctc.co.in"
                  className="flex items-center gap-2.5 text-sm transition-colors"
                  style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>care@irctc.co.in</span>
                </a>
                <div
                  className="flex items-center gap-2.5 text-sm"
                  style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                >
                  <MapPin className="w-3.5 h-3.5" style={{ color: "var(--clr-success)" }} />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
            {}
            {[
              { title: t.quickLinks, items: quickLinks },
              { title: t.services,   items: services },
              { title: t.policies,   items: policies },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  className="text-xs font-bold text-uppercase tracking-[0.12em] mb-5 uppercase"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.items.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm flex items-center gap-1.5 group transition-colors"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {}
          <div
            className="mt-12 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid var(--clr-border)" }}
          >
            <p
              className="text-xs text-center sm:text-left"
              style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
            >
              © {new Date().getFullYear()} IRCTC, Indian Railway Catering and Tourism Corporation Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
                {t.govtEnterprise}
              </span>
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--clr-primary)" }} />
              <span className="text-xs" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
                {t.ministryRailways}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}