"use client";

import React from "react";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 selection:bg-brand-orange selection:text-white">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow pt-20 md:pt-24">{children}</main>
      
      {!isAdminRoute && (
        <footer className="py-12 px-6 border-t border-slate-900 glass-dark mt-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">NagarSeva</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering communities one report at a time. A smart civic platform for a better tomorrow.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-brand-orange">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/complaints/new" className="hover:text-white transition-colors">Report Issue</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Citizen Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-brand-green">Contact</h4>
              <p className="text-slate-400 text-sm italic">
                Support: help@nagarseva.gov.in<br />
                Helpline: 1800-CIVIC-CARE
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-slate-500 text-xs">
            © 2024 NagarSeva. All rights reserved. Government of Communities India.
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
