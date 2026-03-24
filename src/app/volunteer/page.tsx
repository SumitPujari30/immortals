"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Camera,
  Play,
  Navigation,
  HardHat
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VolunteerPortal = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const assignments = [
    { 
      id: "TSK-8812", 
      title: "Broken Streetlight (Pillar 45)", 
      category: "Electricity", 
      priority: "High", 
      location: "Link Road, Andheri West",
      distance: "1.2 km away",
      reported: "2 hours ago"
    },
    { 
      id: "TSK-8805", 
      title: "Hazardous Pothole", 
      category: "Roads", 
      priority: "Critical", 
      location: "SV Road, Bandra",
      distance: "3.5 km away",
      reported: "4 hours ago"
    },
    { 
      id: "TSK-8792", 
      title: "Garbage Pile Cleanup", 
      category: "Sanitation", 
      priority: "Medium", 
      location: "Juhu Tara Rd",
      distance: "0.8 km away",
      reported: "6 hours ago"
    },
  ];

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "warning";
      case "Medium": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-orange/20 rounded-2xl flex items-center justify-center border border-brand-orange/30">
            <HardHat className="w-8 h-8 text-brand-orange" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Expert <span className="text-brand-orange">Force</span>
            </h1>
            <p className="text-slate-400 font-medium italic">Welcome, Field Agent #042</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-2xl font-black text-brand-green">94%</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Efficiency</div>
          </div>
          <div className="text-right border-l border-slate-800 pl-4">
            <div className="text-2xl font-black text-white">12</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Tasks Done</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Active Assignments <Badge variant="secondary">{assignments.length}</Badge>
          </h2>
          {assignments.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:border-brand-orange/50 ${selectedTask?.id === task.id ? 'border-brand-orange' : ''}`}
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityVariant(task.priority) as any}>
                          {task.priority}
                        </Badge>
                        <span className="text-xs font-bold text-slate-500">{task.id}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{task.title}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-green" /> {task.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-blue-400" /> {task.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {task.reported}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="group">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedTask ? (
              <motion.div
                key="action-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className="bg-slate-900 shadow-2xl border-brand-orange/20">
                  <CardHeader>
                    <CardTitle className="text-white">Task Actions</CardTitle>
                    <CardDescription className="text-slate-400">
                      Processing {selectedTask.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full flex items-center gap-2 h-14 bg-blue-600 hover:bg-blue-500">
                      <Navigation className="w-5 h-5" /> Start Navigation
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="flex flex-col gap-1 h-20">
                        <Camera className="w-5 h-5 text-brand-orange" />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Capture Proof</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col gap-1 h-20">
                        <Play className="w-5 h-5 text-brand-green" />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Start Work</span>
                      </Button>
                    </div>
                    <Button className="w-full h-14 bg-brand-green hover:bg-brand-green/90 mt-4 font-black">
                      MARK AS RESOLVED
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-[40px]"
              >
                <Wrench className="w-12 h-12 text-slate-800 mb-4" />
                <p className="text-slate-600 font-bold text-sm">
                  Select an assignment to view actions and navigation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <CardTitle className="text-sm text-red-500 uppercase tracking-widest font-black">Safety First</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                Always wear your high-visibility vest and helmet on site. Verify location safety before starting any repairs.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPortal;
