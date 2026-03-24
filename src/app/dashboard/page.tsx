'use client'

import React from 'react'
import Link from 'next/link'
import {
  useAuth,
  useUserProfile,
  useUserComplaints,
  useComplaintCount,
} from '@/hooks'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  Search,
  MessageSquare,
  Camera,
  User,
  HelpCircle,
  Map,
  Phone,
  Activity,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
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
} from 'recharts'
import { cn } from '@/lib/utils'

export default function CitizenDashboard() {
  const { user } = useAuth()
  const { data: profile } = useUserProfile(user?.id)
  const { data: complaints, isLoading } = useUserComplaints(user?.id)

  const { data: totalCount } = useComplaintCount(user?.id)
  const { data: pendingCount } = useComplaintCount(user?.id, 'pending')
  const { data: inProgressCount } = useComplaintCount(user?.id, 'in_progress')
  const { data: resolvedCount } = useComplaintCount(user?.id, 'resolved')

  const stats = [
    {
      label: 'Total',
      value: totalCount || 0,
      icon: Layers,
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Under Review',
      value: pendingCount || 0,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'In Progress',
      value: inProgressCount || 0,
      icon: AlertCircle,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Resolved',
      value: resolvedCount || 0,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
  ]
 
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
 
  const statusData = [
    { name: 'Under Review', value: pendingCount || 0, color: '#EAB308' },
    { name: 'In Progress', value: inProgressCount || 0, color: '#3B82F6' },
    { name: 'Resolved', value: resolvedCount || 0, color: '#22C55E' },
  ].filter(d => d.value > 0)
 
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#0088fe', '#00c49f', '#ffbb28', '#ff8042']

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Under Review
          </Badge>
        )
      case 'in_progress':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            In Progress
          </Badge>
        )
      case 'resolved':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Resolved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            High Priority
          </Badge>
        )
      case 'medium':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Medium
          </Badge>
        )
      case 'low':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Low
          </Badge>
        )
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl animate-page-enter">
      <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary mb-2">
            Citizen Dashboard
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Welcome back,{' '}
            <span className="font-semibold text-foreground">
              {profile?.full_name || 'Citizen'}
            </span>
            . Track and manage your reported issues.
          </p>
        </div>
        <Link 
          href="/complaints/new"
          className={buttonVariants({ className: "btn-primary-civic h-11 sm:h-12 px-4 sm:px-6 shadow-md w-full sm:w-auto justify-center" })}
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          New Complaint
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="civic-card border-none shadow-sm"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={cn('p-2 sm:p-3 rounded-lg sm:rounded-xl', stat.color)}>
                  <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Submissions Section */}
      <div className="grid grid-cols-1 gap-8 mb-10">
        <Card className="civic-card border-none">
          <CardHeader className="border-b pb-4 sm:pb-6 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-display">My Submissions</CardTitle>
              <CardDescription>Track the live progress of your reported issues</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-slate-50 px-4 py-2 rounded-full border border-slate-100 w-fit">
              <Activity className="w-3 h-3 text-primary" /> Active Tracking
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 sm:p-20 text-center"><Clock className="w-10 h-10 animate-spin mx-auto text-primary/30" /></div>
            ) : !complaints || complaints.length === 0 ? (
              <div className="p-12 sm:p-20 text-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                  <Layers className="w-8 h-8 sm:w-12 sm:h-12 text-slate-200" />
                </div>
                <p className="text-slate-500 font-medium">No complaints registered yet.</p>
                <Link 
                  href="/complaints/new"
                  className={buttonVariants({ className: "btn-primary-civic mt-2" })}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  File Your First Complaint
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop Table — hidden on mobile */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Incident</th>
                        <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Current Status</th>
                        <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Incident Location</th>
                        <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Progress Stage</th>
                        <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {complaints.map((complaint: any) => (
                        <tr key={complaint.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                {complaint.image_url ? (
                                  <img src={complaint.image_url} alt="Evidence" className="w-full h-full object-cover" />
                                ) : (
                                  <Camera className="w-full h-full p-4 text-slate-300" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-slate-900 leading-tight tracking-tight uppercase text-sm">
                                  {complaint.category.replace('_', ' ')}
                                </p>
                                <p className="text-xs text-slate-500 line-clamp-1 max-w-[300px] font-medium">{complaint.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <MapPin className="w-3 h-3 text-primary/40" />
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[200px]">
                                    {complaint.location_address || 'Unmapped Area'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <div className="flex justify-center">
                              {getStatusBadge(complaint.status)}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                              <div className="flex justify-center">
                                  <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group bg-slate-100 shrink-0">
                                  {complaint.latitude && complaint.longitude ? (
                                      <>
                                      <img 
                                          src={`https://static-maps.yandex.ru/1.x/?ll=${complaint.longitude},${complaint.latitude}&size=200,150&z=15&l=map&pt=${complaint.longitude},${complaint.latitude},pm2rdm`}
                                          alt="Map"
                                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                      />
                                      <a 
                                          href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-black text-white uppercase tracking-widest gap-1"
                                      >
                                          <MapPin className="w-3 h-3 text-white" />
                                          <span>Navigate</span>
                                      </a>
                                      </>
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                                      <MapPin className="w-4 h-4 opacity-30" />
                                      </div>
                                  )}
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="max-w-[180px] mx-auto space-y-2">
                              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                <span>Stage</span>
                                <span>
                                  {complaint.status === 'pending' ? 'Review Phase' : 
                                   complaint.status === 'in_progress' ? 'Implementation Phase' : 
                                   complaint.status === 'resolved' ? 'Resolution Reached' : 'Terminated'}
                                </span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-1000",
                                    complaint.status === 'pending' ? "w-1/3 bg-amber-400" :
                                    complaint.status === 'in_progress' ? "w-2/3 bg-blue-500" :
                                    complaint.status === 'resolved' ? "w-full bg-green-500" : "w-0"
                                  )}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <p className="text-sm font-bold text-slate-900">{new Date(complaint.created_at).toLocaleDateString()}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified Entry</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards — shown only on mobile */}
                <div className="md:hidden divide-y divide-slate-100">
                  {complaints.map((complaint: any) => (
                    <div key={complaint.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex gap-3 mb-3">
                        {/* Image thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {complaint.image_url ? (
                            <img src={complaint.image_url} alt="Evidence" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-full h-full p-3 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 leading-tight uppercase text-sm truncate">
                            {complaint.category.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">{complaint.description}</p>
                        </div>
                      </div>

                      {/* Status + Date row */}
                      <div className="flex items-center justify-between mb-3">
                        {getStatusBadge(complaint.status)}
                        <span className="text-xs font-semibold text-slate-500">{new Date(complaint.created_at).toLocaleDateString()}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <span>Progress</span>
                          <span>
                            {complaint.status === 'pending' ? 'Review Phase' : 
                             complaint.status === 'in_progress' ? 'In Progress' : 
                             complaint.status === 'resolved' ? 'Resolved' : 'Closed'}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              complaint.status === 'pending' ? "w-1/3 bg-amber-400" :
                              complaint.status === 'in_progress' ? "w-2/3 bg-blue-500" :
                              complaint.status === 'resolved' ? "w-full bg-green-500" : "w-0"
                            )}
                          />
                        </div>
                      </div>

                      {/* Location row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-primary/40" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[180px]">
                            {complaint.location_address || 'Unmapped Area'}
                          </span>
                        </div>
                        {complaint.latitude && complaint.longitude && (
                          <a 
                            href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3" />
                            Navigate
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Insights Section */}
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <Card className="civic-card border-none">
            <CardHeader className="border-b pb-4 sm:pb-6 px-4 sm:px-8 items-center flex flex-row justify-between">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-display">
                  Complaint Analytics
                </CardTitle>
                <CardDescription>
                  Visual overview of your reporting activity
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              {isLoading ? (
                <div className="h-[300px] sm:h-[400px] flex items-center justify-center text-muted-foreground">
                  Analyzing data...
                </div>
              ) : !complaints || complaints.length === 0 ? (
                <div className="p-10 sm:p-16 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-primary/30" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">No data to visualize</h3>
                  <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Register your first complaint to see analytical insights here.</p>
                  <Link 
                    href="/complaints/new"
                    className={buttonVariants({ className: "btn-primary-civic" })}
                  >
                    Start Reporting
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                  <div className="h-[280px] sm:h-[400px] space-y-4">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">Issues by Category</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748B', fontSize: 10 }}
                          interval={0}
                          angle={-30}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#4F6F52" 
                          radius={[6, 6, 0, 0]} 
                          barSize={32}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
 
                  <div className="h-[280px] sm:h-[400px] space-y-4">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">Resolution Status</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
