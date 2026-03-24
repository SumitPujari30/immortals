'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useRecentComplaints,
  useProfileList,
} from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts'
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  TrendingUp,
  Activity,
  Layers,
  ArrowUpRight,
  Zap,
  Globe,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-xl p-4 border border-white/20 shadow-2xl rounded-2xl">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-bold text-slate-900">{payload[0].value} <span className="text-xs font-medium text-slate-500">Reports</span></p>
      </div>
    )
  }
  return null
}

export default function AdminDashboardOverview() {
  const { data: complaints } = useRecentComplaints(100)
  const { data: volunteers } = useProfileList({ role: 'volunteer' })

  // Chart Data Preparation
  const categoryData = React.useMemo(() => {
    if (!complaints) return []
    const counts: Record<string, number> = {}
    complaints.forEach((c: any) => {
      const cat = c.category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [complaints])

  const statusCounts = React.useMemo(() => {
    if (!complaints) return { pending: 0, in_progress: 0, resolved: 0, rejected: 0 }
    return complaints.reduce((acc: any, c: any) => {
      acc[c.status] = (acc[c.status] || 0) + 1
      return acc
    }, { pending: 0, in_progress: 0, resolved: 0, rejected: 0 })
  }, [complaints])

  const statusData = [
    { name: 'Pending', value: statusCounts.pending, color: '#FCD34D' }, // Amber 300
    { name: 'In Progress', value: statusCounts.in_progress, color: '#60A5FA' }, // Blue 400
    { name: 'Resolved', value: statusCounts.resolved, color: '#34D399' }, // Emerald 400
    { name: 'Rejected', value: statusCounts.rejected, color: '#F87171' }, // Red 400
  ].filter(d => d.value > 0)

  const trendData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 12 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 15 },
    { name: 'Sun', value: 8 },
  ]

  const stats = [
    { label: 'Total Requests', value: complaints?.length || 0, icon: Layers, color: 'text-indigo-500', bg: 'bg-indigo-500/10', glow: 'group-hover:shadow-indigo-500/20', trend: '+12%' },
    { label: 'Pending Action', value: statusCounts.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', glow: 'group-hover:shadow-amber-500/20', trend: '-5%' },
    { label: 'Successful Resolutions', value: statusCounts.resolved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', glow: 'group-hover:shadow-emerald-500/20', trend: '+8%' },
    { label: 'Active Volunteers', value: volunteers?.length || 0, icon: Users, color: 'text-sky-500', bg: 'bg-sky-500/10', glow: 'group-hover:shadow-sky-500/20', trend: 'STABLE' },
  ]

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 lg:p-8 space-y-8 lg:space-y-10"
    >
      <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10">
        <header className="flex flex-col gap-4 sm:gap-6">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Live</span>
              </div>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dashboard v2.0</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <img src="/logo.png" alt="Nagar Seva" className="h-12 sm:h-16 lg:h-20 w-auto" />
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight">System <span className="text-indigo-600">Overview</span></h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base lg:text-lg mt-2">Nagar Seva infrastructure and performance metrics.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
             <div className="flex flex-col items-start sm:items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                <p className="text-sm font-bold text-slate-900">All Nodes Operational</p>
             </div>
             <div className="hidden sm:block h-10 w-[2px] bg-slate-100 mx-2" />
             <div className="flex items-center gap-1 sm:gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto">
               <div className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-indigo-600 rounded-xl text-xs font-black text-white uppercase tracking-widest cursor-pointer hover:bg-indigo-700 transition-colors text-center">7 Days</div>
               <div className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest cursor-pointer transition-colors text-center">30 Days</div>
             </div>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className={cn(
                "border-none shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500 relative bg-white/60 backdrop-blur-xl",
                stat.glow
              )}>
                <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4 group-hover:opacity-10 transition-opacity">
                  <stat.icon size={80} />
                </div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn('p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6', stat.bg, stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-black border-slate-100 bg-slate-50/50 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1">
                      {stat.trend} <ArrowUpRight className="w-2.5 h-2.5" />
                    </Badge>
                  </div>
                  <div>
                    <motion.p 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-black text-slate-900 tracking-tighter"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mt-1.5">{stat.label}</p>
                  </div>
                  <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '70%' }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full opacity-30", stat.bg.replace('/10', ''))}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Registration Trend */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-none shadow-xl lg:shadow-2xl rounded-[20px] lg:rounded-[32px] overflow-hidden bg-white group hover:shadow-indigo-500/5 transition-all duration-700">
              <CardHeader className="bg-white border-b border-slate-50 px-6 lg:px-10 py-6 lg:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                    </div>
                    <CardTitle className="text-xl lg:text-2xl font-black text-slate-900 font-display">Registration Volume</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 font-bold ml-8">Daily community participation trend</CardDescription>
                </div>
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-indigo-500" />
                   <div className="w-3 h-3 rounded-full bg-slate-100" />
                </div>
              </CardHeader>
              <CardContent className="p-6 lg:p-10 pt-4 lg:pt-6">
                <div className="h-[300px] sm:h-[350px] lg:h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} 
                        dx={-10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#4F46E5" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorIndigo)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden h-full bg-white relative">
              <CardHeader className="bg-white border-b border-slate-50 px-10 py-8">
                <div className="flex items-center gap-2 mb-1">
                   <div className="p-1.5 bg-amber-50 rounded-lg">
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                  <CardTitle className="text-2xl font-black text-slate-900 font-display">Live Status</CardTitle>
                </div>
                <CardDescription className="text-slate-400 font-bold ml-8">Operational lifecycle phase</CardDescription>
              </CardHeader>
              <CardContent className="p-10 relative">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={115}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                        animationBegin={200}
                        animationDuration={1500}
                      >
                        {statusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            style={{ filter: `drop-shadow(0 10px 15px ${entry.color}44)` }}
                            className="hover:scale-105 transition-transform origin-center cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)'}}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <p className="text-4xl font-black text-slate-900">{statusCounts.resolved}</p>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Complete</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                   {statusData.map((s, i) => (
                     <div key={i} className="flex items-center gap-2 p-3 rounded-2xl border border-slate-50 bg-slate-50/50">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{s.name}</p>
                           <p className="text-sm font-bold text-slate-900">{s.value}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Performance */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-indigo-600 text-white group relative">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <Globe size={180} />
              </div>
              <CardHeader className="border-b border-white/10 px-10 py-8">
                <CardTitle className="text-2xl font-black font-display tracking-tight text-white">Department Velocity</CardTitle>
                <CardDescription className="text-indigo-100/70 font-bold">Performance metrics by category</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700}} 
                        hide
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700}} 
                      />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        content={({ active, payload }: any) => {
                          if (active && payload && payload.length) {
                             return (
                               <div className="bg-white p-3 rounded-2xl shadow-2xl border-none">
                                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{payload[0].payload.name}</p>
                                  <p className="text-lg font-bold text-slate-900">{payload[0].value}</p>
                               </div>
                             )
                          }
                          return null
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#FFFFFF" 
                        radius={[6, 6, 6, 6]} 
                        barSize={32}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                   {categoryData.slice(0, 4).map((c, i) => (
                     <Badge key={i} className="bg-indigo-400/30 text-white border-white/10 px-3 py-1 font-bold text-[10px]">
                        {c.name}
                     </Badge>
                   ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Notices */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden h-full bg-white">
              <CardHeader className="bg-white border-b border-slate-50 px-10 py-8 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                     <div className="p-1.5 bg-rose-50 rounded-lg">
                        <Bell className="w-4 h-4 text-rose-500" />
                      </div>
                    <CardTitle className="text-2xl font-black text-slate-900 font-display">System Intel</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 font-bold ml-8">Automated insights and alerts</CardDescription>
                </div>
                <Activity className="w-5 h-5 text-slate-200 animate-pulse" />
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                <AnimatePresence mode="popLayout">
                  {[
                    { title: 'Peak Hours Detected', desc: 'Sunday between 10 AM and 2 PM shows 40% higher registration volume.', type: 'alert', color: 'indigo' },
                    { title: 'Volunteer Force High', desc: '80% of registered volunteers are currently active on the platform.', type: 'info', color: 'emerald' },
                    { title: 'Response Time Improved', desc: 'Average ticket resolution time has decreased by 12% this week.', type: 'success', color: 'sky' }
                  ].map((notice, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-5 p-6 rounded-[24px] bg-slate-50 border-2 border-slate-50/50 hover:border-indigo-100 hover:bg-white transition-all cursor-pointer group"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:rotate-12",
                        notice.color === 'indigo' ? 'bg-indigo-600 text-white shadow-indigo-200' :
                        notice.color === 'emerald' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                        'bg-sky-500 text-white shadow-sky-200'
                      )}>
                        <Zap size={20} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900 text-base">{notice.title}</p>
                          <Badge className="bg-slate-900 border-none text-[8px] px-1.5 py-0 rounded-md">NEW</Badge>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{notice.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <button className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors border-t border-slate-50 mt-4">
                   View Operational Log
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
