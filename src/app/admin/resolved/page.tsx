'use client'

import React, { useState } from 'react'
import {
  useAllComplaints,
  useWorkerList,
} from '@/hooks'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Eye,
  MapPin,
  Calendar,
  User,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { format } from 'date-fns'

export default function IssuesResolvedPage() {
  const { data: complaints, isLoading } = useAllComplaints({ status: 'resolved' })
  const { data: workers } = useWorkerList()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredComplaints = complaints?.filter((c: any) =>
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold font-display text-slate-900 mb-2">
            Issues Resolved
          </h1>
          <p className="text-slate-500 font-medium">
            Review all successfully addressed citizen complaints and investigations.
          </p>
        </header>

        <Card className="border-none shadow-lg overflow-hidden rounded-2xl">
          <CardHeader className="bg-white border-b px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <CardTitle className="text-2xl font-display font-bold text-slate-800">Resolution History</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search resolved issues..."
                className="pl-10 h-11 border-2 bg-slate-50 focus:bg-white transition-colors rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            {isLoading ? (
              <div className="p-20 text-center"><Clock className="w-10 h-10 animate-spin mx-auto text-primary" /></div>
            ) : filteredComplaints?.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 opacity-20" />
                <p className="text-slate-400 font-bold">No resolved issues found matching your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[100px] px-8 py-4 font-bold text-slate-700">Media</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Complaint Details</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Resolution Date</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700 text-center">Force Assigned</TableHead>
                      <TableHead className="px-6 py-4 font-bold text-slate-700">Location</TableHead>
                      <TableHead className="text-right px-8 py-4 font-bold text-slate-700">Status</TableHead>
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
                              {complaint.category.split('_').join(' ').toUpperCase()}
                            </p>
                            <p className="text-sm text-slate-500 line-clamp-1 max-w-md">{complaint.description}</p>
                            <p className="text-[10px] font-mono text-slate-400">ID: {complaint.id.toUpperCase()}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {complaint.updated_at ? format(new Date(complaint.updated_at), 'MMM dd, yyyy') : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          {complaint.assigned_worker_id ? (
                            <div className="flex flex-col items-center gap-1">
                              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                                {workers?.find(w => w.id === complaint.assigned_worker_id)?.full_name || 'Field Agent'}
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-slate-300 border-slate-100 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                              Direct System
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="line-clamp-1">{complaint.location_address || 'Bangalore, KA'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8 py-4">
                          <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 justify-center w-fit ml-auto">
                            <CheckCircle2 className="w-3 h-3" />
                            Resolved
                          </Badge>
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
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-0 overflow-hidden">
          {selectedComplaint && (
            <div className="flex flex-col">
              <div className="relative h-64 bg-slate-900">
                {selectedComplaint.image_url ? (
                  <img src={selectedComplaint.image_url} alt="Evidence" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">
                    <AlertCircle className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-bold text-[10px] uppercase tracking-widest mb-3">
                    COMPLETED INVESTIGATION
                  </Badge>
                  <h2 className="text-3xl font-bold text-white font-display">
                    {selectedComplaint.category.split('_').join(' ').toUpperCase()}
                  </h2>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Reporter</p>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-50 rounded-lg">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="font-bold text-slate-900">Citizen Witness</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved On</p>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="font-bold text-slate-900">
                        {selectedComplaint.updated_at ? format(new Date(selectedComplaint.updated_at), 'PPP') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investigation Summary</p>
                  <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm font-bold text-emerald-800">This case has been successfully resolved and closed.</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
