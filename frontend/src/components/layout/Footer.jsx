/**
 * BREW HAVEN - Footer Component
 */

import { Link } from "react-router-dom";
import { Coffee, Heart, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#3d1f0a", color: "#e8c88a" }} className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ── Brand ───────────────────────────── */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div style={{ backgroundColor: "#a0522d" }} className="p-2 rounded-lg">
                <Coffee size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white"
                    style={{ fontFamily: "Playfair Display, serif" }}>
                Brew Haven
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs"
               style={{ color: "#d4a96a" }}>
              Your favorite online coffee destination.
              Premium beans, handcrafted drinks, and
              freshly baked pastries — delivered to your door.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a href="#"
                 style={{ backgroundColor: "#5c2e12" }}
                 className="p-2 rounded-lg hover:opacity-80 transition-opacity">
                <Instagram size={16} style={{ color: "#d4a96a" }} />
              </a>
              <a href="#"
                 style={{ backgroundColor: "#5c2e12" }}
                 className="p-2 rounded-lg hover:opacity-80 transition-opacity">
                <Facebook size={16} style={{ color: "#d4a96a" }} />
              </a>
              <a href="#"
                 style={{ backgroundColor: "#5c2e12" }}
                 className="p-2 rounded-lg hover:opacity-80 transition-opacity">
                <Twitter size={16} style={{ color: "#d4a96a" }} />
              </a>
            </div>
          </div>

          {/* ── Quick Links ─────────────────────── */}
          <div>
            <h4 className="font-bold text-white mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home",      to: "/"          },
                { label: "Menu",      to: "/menu"      },
                { label: "Cart",      to: "/cart"      },
                { label: "My Orders", to: "/dashboard" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: "#d4a96a" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ─────────────────────────── */}
          <div>
            <h4 className="font-bold text-white mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}>
              Contact
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "#d4a96a" }}>
              <li>📍 123 Coffee Street, Manila</li>
              <li>📞 +63 912 345 6789</li>
              <li>✉️ hello@brewhaven.com</li>
              <li>🕐 Mon–Sun: 7am – 10pm</li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ──────────────────────── */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center
                        justify-between gap-2"
             style={{ borderTop: "1px solid #5c2e12" }}>
          <p className="text-xs" style={{ color: "#c8874a" }}>
            © 2024 Brew Haven. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1"
             style={{ color: "#c8874a" }}>
            Made with <Heart size={12} className="text-red-400 mx-1" /> for coffee lovers
          </p>
        </div>
      </div>
    </footer>
  );
}