'use client'

import React from 'react'
import {
  useProfileList,
  useRecentComplaints,
} from '@/hooks'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  MapPin,
  Search,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function AdminVolunteersPage() {
  const { data: volunteers, isLoading } = useProfileList({ role: 'volunteer' })
  const { data: allComplaints } = useRecentComplaints(200)

  const getActiveTasks = (volunteerId: string) => {
    return allComplaints?.filter(
      (c: any) => c.assigned_volunteer_id === volunteerId && c.status !== 'resolved'
    ) || []
  }

  const getResolvedTasks = (volunteerId: string) => {
    return allComplaints?.filter(
      (c: any) => c.assigned_volunteer_id === volunteerId && c.status === 'resolved'
    ) || []
  }

  const getTotalTasksCount = (volunteerId: string) => {
    return allComplaints?.filter(
      (c: any) => c.assigned_volunteer_id === volunteerId
    ).length || 0
  }

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display text-slate-900 tracking-tight">Volunteer Force</h1>
            <p className="text-slate-500 font-medium">Monitor active assignments and field personnel status.</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search volunteers..." 
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </header>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers?.map((volunteer) => {
              const activeTasks = getActiveTasks(volunteer.user_id)
              return (
                <Card key={volunteer.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className={cn(
                    "h-2 w-full",
                    volunteer.is_on_duty ? "bg-emerald-500" : "bg-slate-200"
                  )} />
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar size="xl" className="border-2 border-white shadow-md">
                      <AvatarFallback />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold truncate text-slate-900">{volunteer.full_name}</CardTitle>
                      <CardDescription className="truncate font-medium">{volunteer.city}</CardDescription>
                    </div>
                    <Badge className={cn(
                      "font-black text-[10px] uppercase tracking-widest",
                      volunteer.is_on_duty ? "bg-emerald-500" : "bg-slate-100 text-slate-500"
                    )}>
                      {volunteer.is_on_duty ? 'On Duty' : 'Off'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Performance Stats */}
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col items-center justify-center text-center">
                      <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">Issues Resolved</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <p className="text-2xl font-black text-emerald-700 leading-none">
                          {getResolvedTasks(volunteer.user_id).length}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active Assignments ({activeTasks.length})</p>
                      {activeTasks.length > 0 ? (
                        <div className="space-y-2">
                          {activeTasks.slice(0, 2).map((task: any) => (
                            <div key={task.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span className="text-xs font-bold text-slate-700 truncate">{task.category}</span>
                            </div>
                          ))}
                          {activeTasks.length > 2 && (
                            <p className="text-[10px] text-center font-bold text-slate-400">+{activeTasks.length - 2} more tasks</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-slate-400 italic">No current tasks assigned.</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-50">
                      <span className="text-slate-400 font-medium">Joined {new Date(volunteer.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
