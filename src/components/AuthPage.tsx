"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Landmark, 
  Mail, 
  Lock, 
  Github, 
  Globe, 
  ArrowRight,
  User,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AuthPage = ({ mode = "login" }: { mode: "login" | "signup" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xl shadow-brand-orange/20">
              <Landmark className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              Nagar<span className="text-brand-orange">Seva</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="text-slate-400">
            {isLogin ? "Login to track your reports." : "Join the civic engagement revolution."}
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-4 p-8 pb-0">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Google
              </Button>
              <Button variant="outline" className="h-12 flex items-center gap-2">
                <Github className="w-4 h-4" /> Github
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-950 px-2 text-slate-500 font-bold">Or continue with</span></div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input placeholder="John Doe" className="pl-12" />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input placeholder="name@example.com" className="pl-12" type="email" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                {isLogin && <Link href="/forgot" className="text-[10px] text-brand-orange hover:underline font-bold">Forgot Password?</Link>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  placeholder="••••••••" 
                  className="pl-12 pr-12" 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full h-14 mt-4 text-lg group">
              {isLogin ? "Sign In" : "Create Account"} 
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>

          <CardFooter className="p-8 pt-0 justify-center">
            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link 
                href={isLogin ? "/signup" : "/login"} 
                className="text-brand-orange font-bold hover:underline"
              >
                {isLogin ? "Create one" : "Sign in"}
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center mt-8 text-[10px] text-slate-500 px-6 uppercase tracking-widest leading-loose">
          By clicking continue, you agree to our <span className="text-slate-300 font-bold">Terms of Service</span> and <span className="text-slate-300 font-bold">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
