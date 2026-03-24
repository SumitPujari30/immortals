"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Download,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AdminPanel = () => {
  const [filter, setFilter] = useState("all");

  const stats = [
    { label: "Total Complaints", value: "2,840", icon: Activity, color: "text-blue-500", change: "+12%" },
    { label: "Resolved Today", value: "48", icon: CheckCircle2, color: "text-brand-green", change: "+5%" },
    { label: "Pending Review", value: "112", icon: Clock, color: "text-brand-orange", change: "-2%" },
    { label: "Active Volunteers", value: "420", icon: Users, color: "text-brand-green", change: "+8%" },
  ];

  const recentComplaints = [
    { 
      id: "NS-7012", 
      citizen: "Aniket S.", 
      issue: "Street Flood", 
      location: "Airoli", 
      status: "High", 
      time: "10 mins ago" 
    },
    { 
      id: "NS-7008", 
      citizen: "Priya K.", 
      issue: "Waste Pile", 
      location: "Vashi", 
      status: "Medium", 
      time: "25 mins ago" 
    },
    { 
      id: "NS-7001", 
      citizen: "Rahul M.", 
      issue: "Power Outage", 
      location: "Sanpada", 
      status: "Critical", 
      time: "1 hour ago" 
    },
    { 
      id: "NS-6995", 
      citizen: "Sneha L.", 
      issue: "Tree Fall", 
      location: "Nerul", 
      status: "High", 
      time: "2 hours ago" 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-brand-orange" />
            <h1 className="text-4xl font-black text-white tracking-tight underline decoration-brand-orange/40">
              Admin <span className="text-brand-orange">Console</span>
            </h1>
          </div>
          <p className="text-slate-400">System orchestration & civic health monitoring.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
          <Button className="h-12">Manage Volunteers</Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:border-slate-700 transition-all group overflow-hidden">
              <CardContent className="pt-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 blur-3xl rounded-full" />
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-slate-900 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[10px] text-brand-green border-brand-green/20">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-4xl font-black text-white mb-1 tracking-tighter">{stat.value}</div>
                <div className="text-xs uppercase font-bold text-slate-500 tracking-widest">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Table Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-8">
              <div>
                <CardTitle className="text-2xl font-black">Incoming Tickets</CardTitle>
                <CardDescription>Real-time civic complaint feed.</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input placeholder="Search reports..." className="pl-10 w-64 h-12 bg-slate-900/50" />
                </div>
                <Button variant="outline" className="h-12 w-12 p-0">
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-t border-slate-900">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-[10px] uppercase font-black text-slate-500 tracking-widest border-b border-slate-900">
                  <tr>
                    <th className="px-8 py-5">Complaint ID</th>
                    <th className="px-8 py-5">Reporter / Issue</th>
                    <th className="px-8 py-5">Location</th>
                    <th className="px-8 py-5">Priority</th>
                    <th className="px-8 py-5">Time</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {recentComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/30 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-brand-orange">{item.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">{item.issue}</span>
                          <span className="text-xs text-slate-500 italic">{item.citizen}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <MapPin className="w-3 h-3 text-brand-green" /> {item.location}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant={item.status === 'Critical' ? 'destructive' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-slate-500">{item.time}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-800">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
            <CardFooter className="p-4 bg-slate-900/50 flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Showing 1-4 of 112 results</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Prev</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-orange" /> Category Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {[
                { label: "Electricity", value: 42, color: "bg-brand-orange" },
                { label: "Water Supply", value: 30, color: "bg-blue-500" },
                { label: "Road Damage", value: 18, color: "bg-brand-green" },
                { label: "Sanitation", value: 10, color: "bg-slate-700" },
              ].map((data) => (
                <div key={data.label} className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">{data.label}</span>
                    <span className="text-white">{data.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${data.color}`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-brand-green/30 bg-brand-green/5">
            <CardHeader className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-green/20 rounded-xl">
                  <Activity className="w-5 h-5 text-brand-green" />
                </div>
                <CardTitle className="text-lg">System Health</CardTitle>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Response Time</span>
                  <span className="text-brand-green font-bold">Excellent</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Database Link</span>
                  <span className="text-brand-green font-bold">Stable</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Auth Services</span>
                  <span className="text-brand-green font-bold">Operational</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
