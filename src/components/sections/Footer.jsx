import { Link } from "react-router-dom";

const socials = [
  { k: "Instagram", href: "#" },
  { k: "LinkedIn",  href: "#" },
  { k: "Behance",   href: "#" },
];

const navLinks = [
  { to: "/",         label: "Index",    num: "01" },
  { to: "/services", label: "Services", num: "02" },
  { to: "/work",     label: "Work",     num: "03" },
  { to: "/about",    label: "Studio",   num: "04" },
  { to: "/contact",  label: "Contact",  num: "05" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Top row — collab CTA on the left, site Navigate list on the right. */}
        <div className="f-top">
          <div className="f-top-left">
            <p className="f-eyebrow">[Start something]</p>

            <h2 className="f-cta-title">
              Let&apos;s <em>collaborate.</em>
            </h2>

            <a className="f-email" href="mailto:info@marketingbycircle.com">
              info@marketingbycircle.com
              <span className="f-email-arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="f-top-right">
            <p className="f-col-label">Navigate</p>
            <nav className="f-nav">
              {navLinks.map((n) => (
                <Link key={n.to} to={n.to} className="f-nav-link">
                  <span className="f-nav-num">{n.num}</span> {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Contact row — label on the left, details laid out horizontally. */}
        <div className="f-contact-row">
          <p className="f-col-label">Contact</p>
          <ul className="f-contact f-contact-horizontal">
            <li>
              <a href="mailto:info@marketingbycircle.com">
                info@marketingbycircle.com
              </a>
            </li>
            <li>
              <a href="tel:+919425958589">+91 94259 58589</a>
            </li>
            <li>
              <a
                href="https://marketingbycircle.com"
                target="_blank"
                rel="noreferrer"
              >
                marketingbycircle.com
              </a>
            </li>
            <li className="f-contact-addr">Bangalore · IN</li>
          </ul>
        </div>

        <div className="f-row">
          <nav className="f-socials">
            {socials.map((s) => (
              <a key={s.k} href={s.href} className="f-social">
                {s.k}
              </a>
            ))}
          </nav>

          <p className="f-credit">
            © 2026 Circle <span className="f-credit-dot" /> Bangalore
          </p>
        </div>
      </div>
    </footer>
  );
}
