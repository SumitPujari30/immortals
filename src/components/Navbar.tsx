"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Landmark, House, ShieldCheck, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: House },
    { name: "Report Issue", href: "/complaints/new", icon: Landmark },
    { name: "Dashboard", href: "/dashboard", icon: UserCircle },
    { name: "Admin", href: "/admin", icon: ShieldCheck },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass-dark py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-brand-orange/20">
            <Landmark className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Nagar<span className="text-brand-orange">Seva</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-1.5"
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="px-5 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-orange/20"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 glass-dark border-t border-slate-800 p-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-slate-300 flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <link.icon className="w-5 h-5 text-brand-orange" />
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="w-full py-3 bg-brand-orange text-center rounded-xl font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
