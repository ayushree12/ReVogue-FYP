import React from 'react';

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
  { label: 'Products', to: '/products' },
  { label: 'Cart', to: '/cart' }
];

const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Vendor Terms', to: '/seller/verification' },
  { label: 'Careers', to: '/jobs' },
  { label: 'Contact', to: 'mailto:hello@revogue.com' }
];

const supportLinks = [
  { label: 'Help Center', to: '/help' },
  { label: 'Safety', to: '/safety' },
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' }
];

const Footer = () => (
  <footer className="bg-slate-900 text-slate-100">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:py-12 md:flex-row md:items-start md:justify-between">
      <div className="space-y-3 max-w-sm">
        <p className="uppercase tracking-[0.2em] text-xs text-indigo-300">Revogue</p>
        <h3 className="text-2xl font-semibold">Connect the marketplace.</h3>
        <p className="text-sm text-slate-300">
          Admin-approved vendors, shoppers, and partners collaborate on a shared platform.
          Stay ahead with curated drops, transparent commerce, and support that knows your role.
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-indigo-100">
          <span className="badge-pill bg-white/10 text-indigo-100">Trusted</span>
          <span className="badge-pill bg-white/10 text-indigo-100">Certified Vendors</span>
          <span className="badge-pill bg-white/10 text-indigo-100">Role-based</span>
        </div>
      </div>

      <div className="grid w-full flex-1 grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a href={link.to} className="hover:text-white transition">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <a href={link.to} className="hover:text-white transition">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Support</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <a href={link.to} className="hover:text-white transition">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-slate-800 px-4 py-6 text-xs text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
        <p>© {new Date().getFullYear()} Revogue. All rights reserved.</p>
        <p>Handcrafted dashboards for admin, vendors, and shoppers.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
