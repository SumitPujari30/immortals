'use client'

import React from 'react'
import Link from 'next/link'
import {
  useAuth,
  useUserProfile,
  useRecentComplaints,
  useUpdateComplaintStatus,
  useUpdateProfile,
} from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  MapPin,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Camera,
  Navigation,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Map as MapIcon,
  Activity,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function VolunteerDashboard() {
  const { user } = useAuth()
  const { data: profile } = useUserProfile(user?.id)
  const { data: allComplaints, isLoading: complaintsLoading } =
    useRecentComplaints(100)
  const { mutateAsync: updateStatus, isPending: statusUpdating } =
    useUpdateComplaintStatus()
  const { mutateAsync: updateProfile, isPending: profileUpdating } = useUpdateProfile()
  const queryClient = useQueryClient()

  const assignedComplaints = allComplaints?.filter(
    (c: any) => c.assigned_volunteer_id === user?.id
  )
  const openComplaints = assignedComplaints?.filter(
    (c: any) => c.status !== 'resolved' && c.status !== 'rejected'
  )
  const unassignedComplaints = allComplaints?.filter(
    (c: any) => !c.assigned_volunteer_id && c.status === 'pending'
  )
  const resolvedComplaints = assignedComplaints?.filter(
    (c: any) => c.status === 'resolved'
  )

  const handleResolve = async (id: string) => {
    try {
      await updateStatus({ id, status: 'resolved' })
      toast.success('Complaint marked as resolved!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status')
    }
  }

  const toggleDuty = async () => {
    if (!profile) return
    const newDutyStatus = !profile.is_on_duty
    try {
      await updateProfile({
        id: profile.id,
        data: { is_on_duty: newDutyStatus }
      })
      toast.success(`You are now ${newDutyStatus ? 'On Duty' : 'Off Duty'}`)
    } catch (error: any) {
      console.error('Duty update failed:', error)
      toast.error(error.message || 'Failed to update status')
    }
  }

  const handleSelfAssign = async (id: string) => {
    if (!user) return
    try {
      await updateStatus({
        id,
        status: 'pending',
        assignedVolunteerId: user.id
      })
      toast.success('Complaint booked! Now start your review.')
    } catch (error: any) {
      toast.error('Failed to assign complaint')
    }
  }

  const handleCancelSlot = async (id: string) => {
    try {
      await updateStatus({
        id,
        status: 'pending',
        assignedVolunteerId: null
      })
      toast.success('Slot cancelled and returned to open pool.')
    } catch (error: any) {
      toast.error('Failed to cancel slot')
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            High Priority
          </Badge>
        )
      case 'medium':
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Medium
          </Badge>
        )
      case 'low':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Low
          </Badge>
        )
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending Review
          </Badge>
        )
      case 'under_review':
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-in">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-primary">
              Volunteer Portal
            </h1>
            <p className="text-muted-foreground font-medium">
              Logged in as{' '}
              <span className="font-bold text-foreground">
                {profile?.full_name || 'Volunteer'}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Card className="p-3 bg-muted/30 border-none shadow-sm flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold leading-none">
                {resolvedComplaints?.length || 0}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                Issues Resolved
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Assigned Tasks
              <Badge variant="secondary" className="ml-2 px-2 py-0.5">
                {openComplaints?.length || 0}
              </Badge>
            </h2>
          </div>

          {complaintsLoading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="font-medium text-muted-foreground">
                Loading your assigned complaints...
              </p>
            </div>
          ) : !openComplaints || openComplaints.length === 0 ? (
            <Card className="civic-card border-none bg-muted/20 p-24 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary/30" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                No active assignments
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You&apos;re all caught up! New complaints will be assigned to
                you by the administration team.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {openComplaints.map((complaint: any, i: number) => (
                <Card
                  key={complaint.id}
                  className="civic-card border-none shadow-md hover:shadow-xl transition-all overflow-hidden animate-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-64 h-64 md:h-auto bg-muted relative overflow-hidden flex-shrink-0 group">
                      {complaint.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={complaint.image_url}
                          alt="Issue"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
                          <Camera className="w-12 h-12" />
                          <span className="text-xs uppercase font-bold tracking-widest">
                            No Photos Available
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {getPriorityBadge(complaint.priority_level)}
                        {getStatusBadge(complaint.status)}
                      </div>
                    </div>

                    <div className="flex-1 p-6 md:p-8 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          #{complaint.id.slice(0, 8).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(
                            complaint.created_at
                          ).toLocaleDateString()}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-foreground mb-3 font-display">
                        {complaint.category
                          .replace('_', ' ')
                          .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                        {complaint.description}
                      </p>

                      <div className="mt-auto space-y-4 pt-6 border-t">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-bold text-foreground">
                              Location
                            </p>
                            <p className="text-muted-foreground line-clamp-1">
                              {complaint.location_address ||
                                'Location provided via GPS'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t flex flex-col lg:flex-row gap-8 items-start justify-between">
                          <div className="flex-1 w-full space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.25em] mb-4">Field Agent Task Progress</p>
                            
                            <div className="space-y-4">
                              {/* View Only Option 1: Start Review */}
                              <div className={cn(
                                "w-full h-14 rounded-2xl flex items-center justify-start px-6 gap-5 border transition-all duration-500",
                                (complaint.status === 'under_review' || complaint.status === 'in_progress' || complaint.status === 'resolved')
                                  ? "bg-emerald-50/30 border-emerald-100/50" 
                                  : "bg-purple-50/50 border-purple-100/50 ring-2 ring-purple-600/10"
                              )}>
                                <div className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm",
                                  (complaint.status === 'under_review' || complaint.status === 'in_progress' || complaint.status === 'resolved')
                                    ? "bg-emerald-500 text-white" 
                                    : "bg-purple-600 text-white"
                                )}>01</div>
                                <div className="flex-1">
                                  <p className={cn(
                                    "font-black uppercase tracking-[.15em] text-[11px]",
                                    (complaint.status === 'under_review' || complaint.status === 'in_progress' || complaint.status === 'resolved')
                                      ? "text-emerald-700" 
                                      : "text-purple-700"
                                  )}>Start Initial Review</p>
                                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Physical Verification Stage</p>
                                </div>
                                {(complaint.status === 'under_review' || complaint.status === 'in_progress' || complaint.status === 'resolved') && (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-500" />
                                )}
                              </div>

                              {/* View Only Option 2: Mark In Progress */}
                              <div className={cn(
                                "w-full h-14 rounded-2xl flex items-center justify-start px-6 gap-5 border transition-all duration-500",
                                (complaint.status === 'in_progress' || complaint.status === 'resolved')
                                  ? "bg-emerald-50/30 border-emerald-100/50" 
                                  : complaint.status === 'under_review'
                                    ? "bg-blue-50/50 border-blue-100/50 ring-2 ring-blue-600/10"
                                    : "bg-slate-50 border-slate-100 grayscale opacity-40"
                              )}>
                                <div className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm",
                                  (complaint.status === 'in_progress' || complaint.status === 'resolved')
                                    ? "bg-emerald-500 text-white" 
                                    : complaint.status === 'under_review'
                                      ? "bg-blue-600 text-white"
                                      : "bg-slate-300 text-white"
                                )}>02</div>
                                <div className="flex-1">
                                  <p className={cn(
                                    "font-black uppercase tracking-[.15em] text-[11px]",
                                    (complaint.status === 'in_progress' || complaint.status === 'resolved')
                                      ? "text-emerald-700" 
                                      : complaint.status === 'under_review'
                                        ? "text-blue-700"
                                        : "text-slate-500"
                                  )}>Mark In Progress</p>
                                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Active Resolution Phase</p>
                                </div>
                                {(complaint.status === 'in_progress' || complaint.status === 'resolved') && (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-500" />
                                )}
                              </div>

                              {/* View Only Option 3: Resolve Issue */}
                              <div className={cn(
                                "w-full h-14 rounded-2xl flex items-center justify-start px-6 gap-5 border transition-all duration-500",
                                complaint.status === 'resolved'
                                  ? "bg-emerald-600 border-emerald-600 shadow-xl shadow-emerald-100 scale-[1.02]" 
                                  : complaint.status === 'in_progress'
                                    ? "bg-emerald-50/50 border-emerald-100/50 ring-2 ring-emerald-600/10"
                                    : "bg-slate-50 border-slate-100 grayscale opacity-40"
                              )}>
                                <div className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm",
                                  complaint.status === 'resolved'
                                    ? "bg-white text-emerald-600" 
                                    : "bg-slate-300 text-white"
                                )}>03</div>
                                <div className="flex-1">
                                  <p className={cn(
                                    "font-black uppercase tracking-[.15em] text-[11px]",
                                    complaint.status === 'resolved'
                                      ? "text-white" 
                                      : "text-slate-500"
                                  )}>Final Resolution</p>
                                  <p className={cn(
                                    "text-[9px] font-medium uppercase tracking-widest mt-0.5",
                                    complaint.status === 'resolved' ? "text-emerald-100" : "text-slate-400"
                                  )}>Official Task Closure</p>
                                </div>
                                {complaint.status === 'resolved' && (
                                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full border border-white/20">
                                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">Completed</span>
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Location & Navigation */}
                          {complaint.latitude && complaint.longitude && (
                            <div className="w-full lg:w-48 space-y-3">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.25em]">Navigation Intelligence</p>
                              <Link 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.latitude},${complaint.longitude}`}
                                target="_blank"
                                className="block w-full"
                              >
                                <div className="w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 relative group cursor-pointer shadow-sm hover:shadow-xl transition-all active:scale-[0.98]">
                                  <img 
                                    src={`https://static-maps.yandex.ru/1.x/?ll=${complaint.longitude},${complaint.latitude}&size=300,300&z=15&l=map&pt=${complaint.longitude},${complaint.latitude},pm2rdm`}
                                    alt="Navigate"
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors flex flex-col items-center justify-center p-4">
                                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                      <Navigation className="w-3 h-3 text-primary animate-pulse" />
                                      <span className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">Navigate Now</span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {/* New: Available Unassigned Complaints */}
          <div className="pt-10 pb-10">
            <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-emerald-500" />
              Available Opportunities
              <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-100 italic">
                Self-Assignment Open
              </Badge>
            </h2>

            {!unassignedComplaints || unassignedComplaints.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <p className="text-slate-400 font-medium italic">No unassigned complaints in your area at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {unassignedComplaints.map((complaint: any, i: number) => (
                  <Card key={complaint.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white border border-slate-100">
                    <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                      {complaint.latitude && complaint.longitude ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={`https://static-maps.yandex.ru/1.x/?ll=${complaint.longitude},${complaint.latitude}&size=450,200&z=15&l=map&pt=${complaint.longitude},${complaint.latitude},pm2rdm`}
                          alt="Location Map"
                          className="w-full h-full object-cover opacity-60 contrast-125 transition-transform hover:scale-110 duration-500"
                        />
                      ) : (
                         <MapIcon className="w-10 h-10 text-slate-300" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-white/90 text-slate-900 border-none backdrop-blur-sm shadow-sm">
                        {complaint.category.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium capitalize">
                        {complaint.description}
                      </p>
                      <div className="flex items-center justify-between gap-3 border-t pt-4">
                        <Link 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.latitude},${complaint.longitude}`}
                          target="_blank"
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Navigate
                        </Link>
                        <Button 
                          size="sm" 
                          className="rounded-full bg-slate-900 hover:bg-emerald-600 text-[10px] font-black uppercase tracking-widest px-4 h-8 transition-all active:scale-95"
                          onClick={() => handleSelfAssign(complaint.id)}
                        >
                          Book This Slot
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="civic-card border-none shadow-sm overflow-hidden">
            <div className="bg-accent h-1.5" />
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Duty Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button 
                onClick={toggleDuty}
                disabled={profileUpdating}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg font-bold border transition-all active:scale-[0.98]",
                  profile?.is_on_duty 
                    ? "bg-green-50 text-green-700 border-green-100" 
                    : "bg-slate-50 text-slate-500 border-slate-100",
                  profileUpdating && "opacity-70 cursor-wait"
                )}
              >
                <span className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    profile?.is_on_duty ? "bg-green-500 animate-pulse" : "bg-slate-300"
                  )} />
                  {profileUpdating ? 'Updating...' : (profile?.is_on_duty ? 'Active on Duty' : 'Off Duty')}
                </span>
                <Badge className={cn(
                  "border-none",
                  profile?.is_on_duty ? "bg-green-600" : "bg-slate-400"
                )}>
                  {profile?.is_on_duty ? 'ON' : 'OFF'}
                </Badge>
              </button>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You are currently visible to administration as an active
                volunteer for assignments in Nagar City area.
              </p>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )
}
