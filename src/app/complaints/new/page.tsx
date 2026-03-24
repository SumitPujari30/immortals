"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Camera, 
  MapPin, 
  Send, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ReportIssue = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    // Mock location detection
    setTimeout(() => {
      setLocation("Sector 15, Vashi, Navi Mumbai, 400703");
      setIsDetecting(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand-green" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Report Submitted!</h2>
          <p className="text-slate-400 mb-8">
            Your complaint has been successfully filed. Our administrators will review it shortly. 
            You can track the progress in your dashboard.
          </p>
          <div className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              File Another Issue
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
          Report a <span className="text-brand-orange">Civic Issue</span>
        </h1>
        <p className="text-slate-400 mb-10 text-lg">
          Provide accurate details to help our Expert Force resolve the issue as quickly as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Common Details</CardTitle>
              <CardDescription>Basic information about the problem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Issue Title</label>
                <Input placeholder="e.g. Broken streetlight, Pothole near market" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Category</label>
                <select className="flex h-12 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-white focus:ring-2 focus:ring-brand-orange transition-all appearance-none outline-none">
                  <option>Roads & Transport</option>
                  <option>Electricity & Lighting</option>
                  <option>Water & Sewage</option>
                  <option>Waste Management</option>
                  <option>Public Safety</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Description</label>
                <Textarea placeholder="Describe the issue in detail..." required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Evidence & Location</CardTitle>
              <CardDescription>Help us find and verify the problem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-12 hover:border-brand-orange/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-brand-orange" />
                </div>
                <p className="text-slate-300 font-bold mb-1">Click to upload images</p>
                <p className="text-slate-500 text-sm italic">Max 5MB per file (JPG, PNG)</p>
                <input type="file" className="hidden" accept="image/*" multiple />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-300">Address / Landmarks</label>
                  <button 
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetecting}
                    className="text-xs font-bold text-brand-green flex items-center gap-1.5 hover:opacity-80 disabled:opacity-50"
                  >
                    {isDetecting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <MapPin className="w-3 h-3" />
                    )}
                    {isDetecting ? "Detecting..." : "Auto-detect Location"}
                  </button>
                </div>
                <Input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street name, landmark, etc." 
                  required 
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-brand-orange shrink-0" />
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>Note:</strong> False reporting may lead to account suspension. Please ensure 
              the information provided is accurate and relevant to public civic issues.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 text-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                File Official Complaint <Send className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportIssue;
