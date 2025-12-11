/**
 * FooterSection Component
 *
 * Site-wide footer with links and branding.
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '/features' },
    { label: 'Themes Gallery', href: '/themes' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '#', disabled: true },
  ],
  solutions: [
    { label: 'For Startups', href: '/solutions/startups' },
    { label: 'For Educators', href: '/solutions/educators' },
    { label: 'For Designers', href: '/solutions/designers' },
    { label: 'For Teams', href: '/solutions/teams' },
  ],
  resources: [
    { label: 'Blog', href: '#', disabled: true },
    { label: 'Help Center', href: '#', disabled: true },
    { label: 'API Docs', href: '#', disabled: true },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '#', disabled: true },
    { label: 'Privacy Policy', href: '#', disabled: true },
    { label: 'Terms of Service', href: '#', disabled: true },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">D</span>
              </div>
              <span className="font-medium text-white">
                DeckSnap
              </span>
            </Link>
            <p className="text-sm text-white/60 mb-6 max-w-xs">
              Presentations with character. AI-powered slide design for modern creators.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors duration-150"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  {link.disabled ? (
                    <span className="text-sm text-white/30">
                      {link.label}
                      <span className="ml-1 text-xs">(soon)</span>
                    </span>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
              Solutions
            </h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  {link.disabled ? (
                    <span className="text-sm text-white/30">
                      {link.label}
                      <span className="ml-1 text-xs">(soon)</span>
                    </span>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.disabled ? (
                    <span className="text-sm text-white/30">
                      {link.label}
                      <span className="ml-1 text-xs">(soon)</span>
                    </span>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} DeckSnap. All rights reserved.
          </p>
          <p className="text-sm text-white/40 italic">
            "Presentations with character."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
