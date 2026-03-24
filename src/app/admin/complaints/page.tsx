'use client'
 
import React, { useState } from 'react'
import {
  useRecentComplaints,
  useUpdateComplaintStatus,
  useProfileList,
  useUserProfile,
  useDeleteComplaint,
  useWorkerList,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Users,
  MoreHorizontal,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserPlus,
  Search,
  Eye,
  XCircle,
  MapPin,
  Camera,
  Video,
  FileText,
  AlertTriangle,
  Activity,
  User,
  Trash2,
  Filter,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
 
export default function AdminComplaintsPage() {
  const { data: complaints, isLoading: complaintsLoading } =
    useRecentComplaints(100)
  const { mutateAsync: updateStatus } = useUpdateComplaintStatus()
  const { mutateAsync: deleteComplaint } = useDeleteComplaint()
  const { data: workers } = useWorkerList()
 
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [complaintToDelete, setComplaintToDelete] = useState<string | null>(null)
  
  // Fetch reporter profile for selected complaint
  const { data: reporterProfile } = useUserProfile(selectedComplaint?.user_id)
 
  const handleUpdateStatus = async (
    id: string,
    status: any,
    volunteerId?: string | null,
    workerId?: string | null
  ) => {
    try {
      await updateStatus({ 
        id, 
        status, 
        assignedVolunteerId: volunteerId,
        assignedWorkerId: workerId
      })
      toast.success(`Status updated to ${status.replace('_', ' ')}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status')
    }
  }
 
  const handleDelete = async (id: string) => {
    try {
      await deleteComplaint(id)
      toast.success('Report has been permanently removed from records')
      setIsDeleteDialogOpen(false)
      setComplaintToDelete(null)
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete record')
    }
  }
 
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Awaiting Review</Badge>
      case 'under_review':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Under Review</Badge>
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
 
  const filteredComplaints = complaints?.filter((c: any) => {
    const matchesSearch =
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      c.category.toLowerCase() === selectedCategory.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')
      
    return matchesSearch && matchesCategory
  })

  const categories = [
    "Pothole & Road Damage",
    "Garbage & Waste Collection",
    "Water Leakage",
    "Street Light Issue",
    "Public Encroachment",
    "Stray Animal Issue",
    "Other Civic Issue"
  ]
 
  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-slate-900 mb-2">
              Complaints Management
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-slate-500 font-medium">
                Detailed review and resolution of civic reports.
              </p>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-2 px-3 py-1">
                <Users className="w-3.5 h-3.5" />
                <span className="font-bold">{workers?.length || 0} Workers Active</span>
              </Badge>
            </div>
          </div>
        </header>
 
        <Card className="border-none shadow-lg overflow-hidden rounded-2xl">
          <CardHeader className="bg-white border-b px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <CardTitle className="text-2xl font-display font-bold text-slate-800">All Submissions</CardTitle>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="pl-10 h-11 border-2 bg-slate-50 focus:bg-white rounded-xl">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-2xl border-slate-200">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by ID or details..."
                    className="pl-10 h-11 border-2 bg-slate-50 focus:bg-white transition-colors rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            {complaintsLoading ? (
              <div className="p-20 text-center"><Clock className="w-10 h-10 animate-spin mx-auto text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[100px] px-8 py-4 font-bold text-slate-700">Media</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Complaint Details</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Status</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700 text-center">Assigned Force</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Incident Location</TableHead>
                      <TableHead className="text-right px-8 py-4 font-bold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints?.map((complaint: any) => (
                      <TableRow key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 py-4">
                          {complaint.image_url ? (
                            <div 
                              className="w-14 h-14 rounded-lg overflow-hidden border-2 border-slate-100 shadow-sm group relative cursor-pointer"
                              onClick={() => {
                                setSelectedComplaint(complaint)
                                setIsDetailsOpen(true)
                              }}
                            >
                              <img src={complaint.image_url} alt="Evidence" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                              <AlertCircle className="w-6 h-6" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900">
                              {complaint.category.replace('_', ' ').toUpperCase()}
                            </p>
                            <p className="text-sm text-slate-500 line-clamp-1 max-w-md">{complaint.description}</p>
                            <p className="text-[10px] font-mono text-slate-400">ID: {complaint.id.toUpperCase()}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getStatusBadge(complaint.status)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          {complaint.assigned_worker_id ? (
                            <div className="flex flex-col items-center gap-1">
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                                {workers?.find(w => w.id === complaint.assigned_worker_id)?.full_name || 'Assigned'}
                              </Badge>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Field Agent</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                                <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-200 font-medium px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                                Unassigned
                                </Badge>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Awaiting Force</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group bg-slate-100">
                              {complaint.latitude && complaint.longitude ? (
                                <>
                                  <img 
                                    src={`https://static-maps.yandex.ru/1.x/?ll=${complaint.longitude},${complaint.latitude}&size=150,110&z=15&l=map&pt=${complaint.longitude},${complaint.latitude},pm2rdm`}
                                    alt="Map"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                  />
                                  <a 
                                    href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] font-bold text-white uppercase tracking-tighter"
                                  >
                                    Open Maps
                                  </a>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <MapPin className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="max-w-[150px]">
                              <p className="text-[10px] font-bold text-slate-900 leading-tight line-clamp-2">
                                {complaint.location_address || 'Manual Entry'}
                              </p>
                              <p className="text-[9px] font-mono text-slate-400 mt-1">
                                {complaint.latitude?.toFixed(4)}, {complaint.longitude?.toFixed(4)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-9 px-4 rounded-lg border-2"
                              onClick={() => {
                                setSelectedComplaint(complaint)
                                setIsDetailsOpen(true)
                              }}
                            >
                              View
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                className={cn(
                                  buttonVariants({
                                    variant: 'ghost',
                                    size: 'icon',
                                    className: 'hover:bg-slate-100',
                                  })
                                )}
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-slate-200">
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel className="text-xs uppercase tracking-widest text-slate-400 py-3">Quick Actions</DropdownMenuLabel>
                                  <DropdownMenuItem className="py-2.5" onClick={() => handleUpdateStatus(complaint.id, 'under_review')}>
                                    <Clock className="mr-3 h-4 w-4 text-purple-500" /> Start Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="py-2.5" onClick={() => handleUpdateStatus(complaint.id, 'in_progress')}>
                                    <Activity className="mr-3 h-4 w-4 text-blue-500" /> Mark In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="py-2.5" onClick={() => handleUpdateStatus(complaint.id, 'resolved')}>
                                    <CheckCircle className="mr-3 h-4 w-4 text-green-500" /> Resolve Issue
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="py-2.5 text-red-600 focus:text-red-700" onClick={() => handleUpdateStatus(complaint.id, 'rejected')}>
                                    <XCircle className="mr-3 h-4 w-4" /> Terminate/Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="py-2.5 text-rose-600 font-bold focus:bg-rose-50" 
                                    onClick={() => {
                                      setComplaintToDelete(complaint.id)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="mr-3 h-4 w-4" /> Permanently Delete
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
 
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-[1500px] sm:max-w-none w-[95vw] h-[85vh] p-0 overflow-hidden border-none overflow-y-hidden shadow-2xl bg-[#F8FAFC] outline-none rounded-[3.5rem] ring-0" showCloseButton={false}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-8 right-8 z-50 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group"
            onClick={() => setIsDetailsOpen(false)}
          >
            <XCircle className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
          </Button>
          {selectedComplaint && (
            <div className="flex w-full h-full overflow-hidden">
              {/* Wireframe Sidebar - Left Column (Weighted for Width) */}
              <div className="w-[450px] h-full bg-white border-r border-slate-100 flex flex-col p-8 lg:p-10 justify-between shrink-0 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] z-20 overflow-y-auto custom-scrollbar">
                <div className="space-y-6 lg:space-y-8 pt-4">
                  <header className="space-y-4 lg:space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20">
                        N
                      </div>
                      <span className="font-display font-black text-slate-300 text-xs uppercase tracking-[.5em]">NagarSeva</span>
                    </div>
                    
                    <div className="space-y-4">
                      <Badge className="bg-primary/5 text-primary border-none text-[9px] font-black tracking-[.25em] px-4 py-1.5 rounded-full">
                        {selectedComplaint.category.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 leading-[0.9] tracking-tighter">
                        Incident<br />Analysis
                      </h2>
                    </div>
                  </header>
 
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[.3em]">Operational Status</p>
                      <div className="w-fit scale-100 origin-left">
                        {getStatusBadge(selectedComplaint.status)}
                      </div>
                    </div>
 
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[.3em]">Temporal Tracking</p>
                      <div className="space-y-0.5 pt-0">
                        <p className="font-bold text-slate-900 text-xl tracking-tight">{new Date(selectedComplaint.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{new Date(selectedComplaint.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                      </div>
                    </div>
 
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[.3em]">Source Identity</p>
                      <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none">{reporterProfile?.full_name || 'Anonymous Reporter'}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Verified Citizen</p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-100 truncate">
                          {selectedComplaint.user_email || 'Identity Masked'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
 
                <footer className="space-y-6">
                   <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[.3em]">System Reference</p>
                    <code className="text-[10px] font-mono font-bold text-slate-400 break-all opacity-60">
                      {selectedComplaint.id}
                    </code>
                  </div>
                  <Button variant="outline" className="w-full h-18 rounded-[1.5rem] border-2 border-slate-100 hover:bg-slate-50 transition-all font-bold text-slate-400 hover:text-slate-900 flex items-center justify-center gap-4 group py-6" onClick={() => setIsDetailsOpen(false)}>
                    <XCircle className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    Close Analysis
                  </Button>
                </footer>
              </div>
 
              {/* Wireframe Main Stage - Wide Horizontal Flow */}
              <div className="flex-1 h-full p-8 lg:p-12 flex flex-col relative overflow-y-auto custom-scrollbar bg-slate-50/30">
                <div className="w-full max-w-[1050px] mx-auto py-8 lg:py-12 space-y-12 lg:space-y-16">
                  {/* The Cinematic Centered Card - Horizontal Shape */}
                  <div className="w-full aspect-[21/9] bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-white flex items-center justify-center p-8 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 opacity-100" />
                    
                    {selectedComplaint.image_url ? (
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img 
                          src={selectedComplaint.image_url} 
                          alt="Incident Evidence" 
                          className="max-h-full max-w-full object-contain rounded-3xl shadow-2xl transition-all duration-1000 group-hover:scale-[1.03]" 
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-8 text-slate-200">
                        <Camera className="w-40 h-40 stroke-[1]" />
                        <p className="text-sm font-black uppercase tracking-[0.6em] opacity-50">Evidence Missing</p>
                      </div>
                    )}
                  </div>
 
                  {/* Horizontal Info Flow */}
                  <div className="grid grid-cols-12 gap-16 px-10">
                    <div className="col-span-12 lg:col-span-7 space-y-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="h-px flex-1 bg-slate-200" />
                          <h4 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-300">Briefing</h4>
                        </div>
                        <p className="text-slate-700 text-3xl font-medium leading-[1.2] tracking-tight">
                          {selectedComplaint.description}
                        </p>
                      </div>

                      {/* Incident Parameters - NEW */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2 flex flex-col items-center text-center justify-center min-h-[140px]">
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-500" /> Priority
                          </p>
                          <Badge className={cn(
                            "text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase",
                            selectedComplaint.priority_level === 'high' ? "bg-red-50 text-red-600" :
                            selectedComplaint.priority_level === 'medium' ? "bg-amber-50 text-amber-600" :
                            "bg-blue-50 text-blue-600"
                          )}>
                            {selectedComplaint.priority_level}
                          </Badge>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2 flex flex-col items-center text-center justify-center min-h-[140px]">
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-2.5 h-2.5 text-cyan-500" /> Impact
                          </p>
                          <p className="text-xl font-black text-slate-900 flex items-baseline gap-1">
                            {selectedComplaint.people_affected} <span className="text-[9px] text-slate-400">CITIZENS</span>
                          </p>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2 flex flex-col items-center text-center justify-center min-h-[140px]">
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-2.5 h-2.5 text-rose-500" /> Health
                          </p>
                          <Badge className={cn(
                            "text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase",
                            selectedComplaint.health_risk === 'high' ? "bg-rose-50 text-rose-600" :
                            "bg-slate-50 text-slate-500"
                          )}>
                            {selectedComplaint.health_risk} Risk
                          </Badge>
                        </div>
                      </div>

                      {/* Supplemental Artifacts - NEW */}
                      {(selectedComplaint.video_url || selectedComplaint.doc_url) && (
                        <div className="space-y-6 pt-4">
                          <div className="flex items-center gap-6">
                            <div className="h-px flex-1 bg-slate-200" />
                            <h4 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-300">Supplemental Artifacts</h4>
                          </div>
                          <div className="flex gap-6">
                            {selectedComplaint.video_url && (
                              <a href={selectedComplaint.video_url} target="_blank" rel="noopener noreferrer" className="flex-1 p-6 bg-slate-900 rounded-3xl flex items-center justify-between group/vid hover:scale-[1.02] transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                    <Video className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-white font-bold text-sm">Incident Video</p>
                                    <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">MP4 Artifact</p>
                                  </div>
                                </div>
                                <Activity className="w-5 h-5 text-white/20 group-hover/vid:text-primary transition-colors" />
                              </a>
                            )}
                            {selectedComplaint.doc_url && (
                              <a href={selectedComplaint.doc_url} target="_blank" rel="noopener noreferrer" className="flex-1 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between group/doc hover:scale-[1.02] transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-slate-900 font-bold text-sm">Supporting PDF</p>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Document Evidence</p>
                                  </div>
                                </div>
                                <FileText className="w-5 h-5 text-slate-100 group-hover/doc:text-primary transition-colors" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-span-12 lg:col-span-5 space-y-10">
                      <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-white flex items-center gap-6 group/loc cursor-default">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-primary shadow-2xl transition-all duration-500 group-hover/loc:scale-110 group-hover/loc:rotate-6">
                          <MapPin className="w-8 h-8" />
                        </div>
                        <div className="flex-1 space-y-1 overflow-hidden">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Geolocation Intelligence</p>
                          <p className="font-bold text-slate-900 text-xl leading-snug">
                            {selectedComplaint.location_address || 'Unmapped Coordinate Area'}
                          </p>
                          <code className="text-[10px] font-black text-slate-400 opacity-50 block mt-2">
                            {selectedComplaint.latitude} / {selectedComplaint.longitude}
                          </code>
                        </div>
                      </div>
 
                      <div className="p-8 bg-amber-50/50 rounded-[2.5rem] border border-amber-100 space-y-6">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          <h4 className="text-[10px] font-black uppercase tracking-[.3em] text-amber-700">Risk Mitigation Note</h4>
                        </div>
                        <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                          This incident has been flagged for environmental impact. Prioritize resolution if the impact score exceeds 10 affected citizens. 
                        </p>
                      </div>

                      {/* Force Assignment Section */}
                      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-emerald-500" />
                          <h4 className="text-[10px] font-black uppercase tracking-[.3em] text-slate-400">Force Assignment</h4>
                        </div>
                        <div className="space-y-4">
                          <Select 
                            value={selectedComplaint.assigned_worker_id || "none"} 
                            onValueChange={(val) => handleUpdateStatus(selectedComplaint.id, selectedComplaint.status, null, val === "none" ? null : val)}
                          >
                            <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50 font-bold text-slate-700">
                              <SelectValue placeholder="Assign Field Agent" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-200">
                              <SelectItem value="none" className="font-bold text-slate-400">Unassigned</SelectItem>
                              {workers?.map(worker => (
                                <SelectItem key={worker.id} value={worker.id} className="font-bold">
                                  {worker.full_name} ({worker.assigned_count} Active)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                            {selectedComplaint.assigned_worker_id ? "Worker successfully linked to task" : "Select an agent to begin field operation"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        {selectedComplaint.status === 'pending' && (
                          <Button className="w-full h-24 rounded-[2.5rem] text-2xl font-black bg-purple-600 text-white shadow-2xl shadow-purple-200 hover:shadow-purple-300 transition-all hover:-translate-y-2 flex items-center justify-center group/btn" onClick={() => handleUpdateStatus(selectedComplaint.id, 'under_review')}>
                            <Clock className="w-8 h-8 mr-4 stroke-[3] transition-transform group-hover/btn:scale-125" /> 
                            START REVIEW
                          </Button>
                        )}
                        
                        {selectedComplaint.status === 'under_review' && (
                          <Button className="w-full h-24 rounded-[2.5rem] text-2xl font-black bg-blue-600 text-white shadow-2xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-2 flex items-center justify-center group/btn" onClick={() => handleUpdateStatus(selectedComplaint.id, 'in_progress')}>
                            <Activity className="w-8 h-8 mr-4 stroke-[3] transition-transform group-hover/btn:scale-125" /> 
                            MARK IN PROGRESS
                          </Button>
                        )}

                        {selectedComplaint.status === 'in_progress' && (
                          <Button className="w-full h-24 rounded-[2.5rem] text-2xl font-black bg-emerald-600 text-white shadow-2xl shadow-emerald-200 hover:shadow-emerald-300 transition-all hover:-translate-y-2 flex items-center justify-center group/btn" onClick={() => handleUpdateStatus(selectedComplaint.id, 'resolved')}>
                            <CheckCircle2 className="w-8 h-8 mr-4 stroke-[3] transition-transform group-hover/btn:scale-125" /> 
                            RESOLVE PROJECT
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-[2rem] border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <AlertDialogHeader className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 mx-auto sm:mx-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-2xl font-display font-black text-slate-900">Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium text-sm">
                This will permanently remove the incident report and all associated evidence from the database. This action is <span className="text-rose-600 font-bold">irreversible</span>.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-2xl border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50">
              Abort Mission
            </AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-lg shadow-rose-200"
              onClick={() => complaintToDelete && handleDelete(complaintToDelete)}
            >
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
