"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Users, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  Smartphone
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Image with Zoom Effect */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1517733925043-473d4fef39f6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950 z-1" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 z-1" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-brand-orange border border-brand-orange/30 rounded-full bg-brand-orange/10 backdrop-blur-md">
              Civic Engagement Platform
            </span>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
              Empowering <span className="text-gradient">Communities</span>.<br />
              Building Futures.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Report local civic issues, track resolutions in real-time, and collaborate with 
              authorities to build a better, smarter neighborhood.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/complaints/new"
                className="group relative px-8 py-4 bg-brand-orange text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-brand-orange/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transition-transform group-hover:translate-x-full duration-500" />
                <span className="flex items-center gap-2">
                  Report a Complaint <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-slate-900/50 backdrop-blur-md border border-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-800/80 transition-all"
              >
                Track Progress
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Issues Resolved", value: "12,450+" },
              { label: "Active Volunteers", value: "3,200+" },
              { label: "Average Response", value: "< 24 Hours" },
              { label: "Success Rate", value: "98.5%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Matrix */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Why NagarSeva Wins</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our unified civic ecosystem connects citizens directly with authorities and 
              volunteers for unprecedented transparency and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-3xl glass-dark border border-slate-800/50 hover:border-brand-orange/30 transition-all duration-500"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-8 text-white">Seamless Resolution Workflow</h2>
              <div className="space-y-12">
                {[
                  { 
                    step: "01", 
                    title: "Identify & Report", 
                    desc: "Citizens log local issues with precise GPS location and multimedia evidence.",
                    icon: Smartphone 
                  },
                  { 
                    step: "02", 
                    title: "Admin Verification", 
                    desc: "Authorities review the report, assess severity, and assign the Expert Force.",
                    icon: ShieldCheck 
                  },
                  { 
                    step: "03", 
                    title: "Physical Resolution", 
                    desc: "Dedicated volunteers resolve the issue on-ground and submit closure proof.",
                    icon: Zap 
                  },
                ].map((item, i) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-800/50 border border-slate-700 rounded-full flex items-center justify-center font-black text-brand-orange">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                        {item.title} <item.icon className="w-5 h-5 opacity-50" />
                      </h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-brand-orange/20 blur-[120px] rounded-full" />
              <div className="relative glass-dark p-4 rounded-[40px] border border-slate-800/50">
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" 
                  alt="Resolution Team" 
                  className="rounded-[32px] w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto glass shadow-2xl shadow-brand-orange/10 rounded-[40px] p-12 text-center border-brand-orange/20 overflow-hidden relative">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl" />
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white relative z-10">
            Ready to make an <span className="text-gradient">Impact</span>?
          </h2>
          <p className="text-lg text-slate-300 mb-10 relative z-10 max-w-xl mx-auto">
            Join thousands of citizens who are actively participating in making our city 
            smarter and more livable.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link href="/register" className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all">
              Register Now
            </Link>
            <Link href="/complaints/new" className="px-10 py-4 border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              File a Complaint
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Location Precision",
    description: "Our smart GPS integration ensures every report is mapped with pinpoint accuracy for rapid response.",
    icon: MapPin,
    color: "bg-blue-600 shadow-blue-600/20",
    perks: ["Auto-coordinates", "Nearby issue alerts", "Regional mapping"]
  },
  {
    title: "Live Tracking",
    description: "Stay informed with a real-time timeline from verification to on-ground resolution.",
    icon: Clock,
    color: "bg-brand-orange shadow-brand-orange/20",
    perks: ["Status updates", "SMS/Push alerts", "Volunteer details"]
  },
  {
    title: "Unified Force",
    description: "A centralized platform connecting citizens, government bodies, and verified expert volunteers.",
    icon: Users,
    color: "bg-brand-green shadow-brand-green/20",
    perks: ["Verified authorities", "Expert Force workers", "Citizen upvotes"]
  }
];
