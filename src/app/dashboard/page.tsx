"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const stats = [
    { label: "Total Reports", value: "8", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending", value: "3", icon: Clock, color: "text-brand-orange", bg: "bg-brand-orange/10" },
    { label: "In Progress", value: "2", icon: TrendingUp, color: "text-brand-green", bg: "bg-brand-green/10" },
    { label: "Resolved", value: "3", icon: CheckCircle2, color: "text-brand-green", bg: "bg-brand-green/10" },
  ];

  const complaints = [
    { 
      id: "NS-4502", 
      title: "Broken Streetlight", 
      category: "Electricity", 
      status: "In Progress", 
      date: "24 Mar 2026",
      location: "Sector 15, Vashi"
    },
    { 
      id: "NS-4498", 
      title: "Pothole on Main Road", 
      category: "Roads", 
      status: "Pending", 
      date: "23 Mar 2026",
      location: "Palm Beach Rd"
    },
    { 
      id: "NS-4485", 
      title: "Illegal Garbage Dumping", 
      category: "Waste", 
      status: "Resolved", 
      date: "21 Mar 2026",
      location: "Kopar Khairane"
    },
    { 
      id: "NS-4472", 
      title: "Overflowing Sewage", 
      category: "Sewage", 
      status: "Resolved", 
      date: "19 Mar 2026",
      location: "Nerul East"
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Resolved": return "success";
      case "In Progress": return "warning";
      case "Pending": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Citizen <span className="text-brand-orange">Dashboard</span>
          </h1>
          <p className="text-slate-400">Welcome back, Sumit. Track and manage your civic reports.</p>
        </div>
        <Button className="w-full md:w-auto h-12">
          New Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm font-bold text-slate-500">Live</span>
                </div>
                <div className="text-4xl font-black text-white">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Your Reports</CardTitle>
                <CardDescription>Recent complaints filed by you.</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input placeholder="Search ID..." className="pl-9 w-48 h-10 text-xs" />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-t border-slate-900">
              <div className="divide-y divide-slate-900">
                {complaints.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-6 flex items-center justify-between hover:bg-slate-900/30 transition-colors group cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-orange">{item.id}</span>
                        <h4 className="font-bold text-white transition-colors group-hover:text-brand-orange">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                        </span>
                        <span>{item.date}</span>
                        <span className="font-bold text-slate-400">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={getStatusVariant(item.status) as any}>
                        {item.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 bg-slate-900/50 border-t border-slate-900 text-center">
              <Button variant="link" className="text-xs">View All Reports</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-brand-orange/20 to-transparent border-brand-orange/30">
            <CardHeader>
              <CardTitle className="text-lg">Need Assistance?</CardTitle>
              <CardDescription className="text-slate-300">
                Contact our civic support team for urgent issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 mb-4">
                Call Helpline
              </Button>
              <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                Available 24/7 • 1800-CIVIC-CARE
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resolution Status</CardTitle>
              <CardDescription>Average time per category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Electricity", progress: 85, color: "bg-brand-orange" },
                { name: "Water", progress: 70, color: "bg-brand-green" },
                { name: "Roads", progress: 45, color: "bg-blue-500" },
              ].map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="text-slate-500">{cat.progress}% Efficiency</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.progress}%` }}
                      className={`h-full ${cat.color}`} 
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
