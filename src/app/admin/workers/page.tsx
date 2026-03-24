'use client'

import React, { useState } from 'react'
import {
  useWorkerList,
  useDeleteWorker,
  useAllComplaints,
  useUpdateComplaintStatus
} from '@/hooks'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  UserPlus,
  Search,
  Phone,
  Clock,
  User,
  MoreHorizontal,
  Mail,
  ShieldCheck,
  MapPin,
  Trash2,
  ClipboardList,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client-singleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function AllWorkersPage() {
  const router = useRouter()
  const { data: workers, isLoading } = useWorkerList()
  const { mutateAsync: deleteWorker } = useDeleteWorker()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Action States
  const [workerToDelete, setWorkerToDelete] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const [workerForAssign, setWorkerForAssign] = useState<any>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [assignSearch, setAssignSearch] = useState('')
  
  const { data: allComplaints } = useAllComplaints()
  const { mutateAsync: updateComplaint } = useUpdateComplaintStatus()

  const filteredWorkers = workers?.filter((w: any) =>
    w.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.phone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPublicImageUrl = (path: string | null) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    
    const { data } = supabase.storage.from('workers').getPublicUrl(path)
    let url = data.publicUrl
    
    // Ensure the URL correctly points to the public endpoint
    if (url && !url.includes('/public/')) {
      url = url.replace('/v1/object/workers/', '/v1/object/public/workers/')
    }
    
    return url
  }

  const handleDeleteWorker = async () => {
    if (!workerToDelete) return
    try {
      await deleteWorker(workerToDelete.id)
      toast.success(`${workerToDelete.full_name} has been removed from the force.`)
      setIsDeleteDialogOpen(false)
      setWorkerToDelete(null)
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete worker')
    }
  }

  const handleAssignTask = async (complaintId: string) => {
    if (!workerForAssign) return
    try {
      await updateComplaint({
        id: complaintId,
        status: 'in_progress',
        // @ts-ignore - assigned_worker_id is supported but may not be in the hook type yet
        assigned_worker_id: workerForAssign.id
      })
      
      // Update the worker's assigned count manually for immediate UI feedback
      await supabase.rpc('increment_worker_assigned_count', { worker_id: workerForAssign.id })
      
      toast.success(`Task assigned to ${workerForAssign.full_name}`)
      setIsAssignDialogOpen(false)
      setWorkerForAssign(null)
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign task')
    }
  }

  const filteredPendingComplaints = allComplaints?.filter((c: any) => 
    (c.status === 'pending' || c.status === 'under_review') &&
    (c.description.toLowerCase().includes(assignSearch.toLowerCase()) ||
     c.id.toLowerCase().includes(assignSearch.toLowerCase()) ||
     c.category.toLowerCase().includes(assignSearch.toLowerCase()))
  )

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-slate-900 mb-2">
              Field Workers
            </h1>
            <p className="text-slate-500 font-medium">
              Manage and track the active NagarSeva workforce.
            </p>
          </div>
          <Button 
            className="rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
            onClick={() => router.push('/admin/workers/add')}
          >
            <UserPlus className="w-5 h-5" />
            Add New Worker
          </Button>
        </header>

        <Card className="border-none shadow-lg overflow-hidden rounded-2xl">
          <CardHeader className="bg-white border-b px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <CardTitle className="text-2xl font-display font-bold text-slate-800">Force Overview</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or contact..."
                className="pl-10 h-11 border-2 bg-slate-50 focus:bg-white transition-colors rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            {isLoading ? (
              <div className="p-20 text-center"><Clock className="w-10 h-10 animate-spin mx-auto text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[80px] px-8 py-4 font-bold text-slate-700">Photo</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Worker Identity</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Area</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Contact</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Demographics</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700 text-center">Load</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Status</TableHead>
                      <TableHead className="text-right px-8 py-4 font-bold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkers?.map((worker: any) => (
                      <TableRow key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 py-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
                            {worker.photo_url ? (
                              <img 
                                src={getPublicImageUrl(worker.photo_url) || ''} 
                                alt={worker.full_name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <User className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 leading-none">{worker.full_name}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Badge variant="outline" className="text-[9px] font-black tracking-widest px-1.5 py-0 rounded-md uppercase bg-slate-50 text-slate-500 border-slate-200">
                                {worker.gov_id_type}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600 font-bold">
                            <MapPin className="w-4 h-4 text-primary/60" />
                            {worker.area || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                              <Phone className="w-3.5 h-3.5 text-emerald-500" />
                              {worker.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-tighter">
                            <span>{worker.age} Y/O</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{worker.gender}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-black text-slate-900">{worker.assigned_count || 0}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Tasks Active</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                            Active Duty
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-100">
                                <MoreHorizontal className="w-5 h-5 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-100">
                              <DropdownMenuItem 
                                className="gap-2 font-bold text-slate-600 py-3 cursor-pointer"
                                onClick={() => {
                                  setWorkerForAssign(worker)
                                  setIsAssignDialogOpen(true)
                                }}
                              >
                                <ClipboardList className="w-4 h-4" />
                                Assign Task
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2 font-bold text-destructive py-3 cursor-pointer"
                                onClick={() => {
                                  setWorkerToDelete(worker)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Worker
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <AlertDialogTitle>Remove worker from force?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark <strong>{workerToDelete?.full_name}</strong> as inactive. 
              They will no longer be assigned new tasks, but their previous records will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteWorker}
              className="bg-red-500 hover:bg-red-600 rounded-xl font-bold"
            >
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Task Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-6 bg-slate-50 border-b">
            <DialogTitle className="text-2xl font-display font-black text-slate-900">Assign Investigation</DialogTitle>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Assigning to {workerForAssign?.full_name}</p>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search eligible complaints (Pending/Under Review)..."
                className="pl-10 h-11 border-2 bg-slate-50 focus:bg-white transition-colors rounded-xl"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredPendingComplaints?.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                  <p className="font-bold text-slate-900">All caught up!</p>
                  <p className="text-xs text-slate-500">No pending complaints found.</p>
                </div>
              ) : (
                filteredPendingComplaints?.map((complaint: any) => (
                  <div 
                    key={complaint.id}
                    onClick={() => handleAssignTask(complaint.id)}
                    className="group p-4 border-2 border-slate-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-900 text-[8px] font-black tracking-widest px-1.5 py-0 rounded-md">
                          {complaint.category.split('_').join(' ').toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-black text-slate-300">#{complaint.id?.slice(0, 8)}</span>
                      </div>
                      <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{complaint.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3 h-3" />
                        {complaint.location_address || 'Location Unknown'}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-lg font-bold group-hover:bg-primary group-hover:text-white">
                      Assign
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
