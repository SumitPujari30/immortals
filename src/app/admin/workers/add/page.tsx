'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  UserPlus, 
  IdCard, 
  Phone, 
  User, 
  Camera,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { supabase } from '@/lib/supabase-client-singleton'
import { toast } from 'sonner'

const GOV_ID_TYPES = [
  'Aadhaar Card',
  'PAN Card',
  'Voter ID',
  'Driving License'
]

const BANGALORE_AREAS = [
  'Indiranagar',
  'Koramangala',
  'Whitefield',
  'Jayanagar',
  'HSR Layout',
  'Malleshwaram',
  'Bannerghatta Road',
  'Electronic City',
  'Rajajinagar',
  'Frazer Town'
].sort()

export default function AddWorkerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [docPhoto, setDocPhoto] = useState<File | null>(null)
  const [docPhotoPreview, setDocPhotoPreview] = useState<string | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleDocPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocPhoto(file)
      setDocPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('--- Worker Submission Started ---')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = (formData.get('name') as string) || ''
    const ageRaw = formData.get('age') as string
    const age = ageRaw ? parseInt(ageRaw) : null
    const gender = (formData.get('gender') as string) || null
    const idType = (formData.get('idType') as string) || null
    const phone = (formData.get('phone') as string) || ''
    const area = (formData.get('area') as string) || null

    try {
      let photoUrl = null
      let docPhotoUrl = null

      console.log('--- Submission Started ---')
      console.log('Form data:', { name, phone, age, gender, idType, photo: photo?.name, docPhoto: docPhoto?.name })

      if (!name || !phone) {
        throw new Error('Name and Phone are required for registration.')
      }

      if (photo) {
        console.log('Uploading worker photo...')
        const fileExt = photo.name.split('.').pop()
        const fileName = `headshot_${Math.random()}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('workers')
          .upload(filePath, photo)

        if (uploadError) {
          console.error('Photo upload failed:', uploadError)
          throw new Error(`Photo Upload Error: ${uploadError.message}`)
        }
        photoUrl = filePath
        console.log('Photo uploaded to:', photoUrl)
      }

      if (docPhoto) {
        console.log('Uploading document photo...')
        const fileExt = docPhoto.name.split('.').pop()
        const fileName = `doc_${Math.random()}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('workers')
          .upload(filePath, docPhoto)

        if (uploadError) {
          console.error('Doc upload failed:', uploadError)
          throw new Error(`Document Upload Error: ${uploadError.message}`)
        }
        docPhotoUrl = filePath
        console.log('Doc uploaded to:', docPhotoUrl)
      }

      console.log('Inserting worker into DB...')

      const { data: newWorker, error: workerError } = await supabase
        .from('workers')
        .insert({
          full_name: name,
          age: isNaN(age as number) ? null : age,
          gender,
          gov_id_type: idType,
          phone,
          area,
          photo_url: photoUrl,
          gov_id_url: docPhotoUrl
        })
        .select()
        .single()

      if (workerError) {
        console.error('Database insertion error:', workerError)
        throw new Error(`Database Error: ${workerError.message}`)
      }

      console.log('Worker inserted successfully:', newWorker)
      toast.success('Worker added successfully!')
      
      // Auto-assign logic
      console.log('Triggering round robin...')
      try {
        await triggerRoundRobin()
      } catch (rrErr) {
        console.error('Round Robin failed (non-critical):', rrErr)
      }

      console.log('Redirecting to /admin/workers...')
      setTimeout(() => {
        router.push('/admin/workers') 
      }, 1000)
    } catch (error: any) {
      console.error('CRITICAL SUBMISSION ERROR:', error)
      toast.error(error.message || 'Failed to add worker')
      alert(`Error during registration: ${error.message}`) // Fallback for visibility
    } finally {
      console.log('--- Submission Ended ---')
      setLoading(false)
    }
  }

  const triggerRoundRobin = async () => {
    try {
      // Get all active workers ordered by assigned_count asc
      const { data: workers } = await supabase
        .from('workers')
        .select('id, assigned_count')
        .eq('is_active', true)
        .order('assigned_count', { ascending: true })

      if (!workers || workers.length === 0) return

      // Get all complaints without a worker
      const { data: pendingComplaints } = await supabase
        .from('complaints')
        .select('id')
        .is('assigned_worker_id', null)

      if (!pendingComplaints || pendingComplaints.length === 0) return

      // Round Robin Assignment
      for (let i = 0; i < pendingComplaints.length; i++) {
        const workerIndex = i % workers.length
        const worker = workers[workerIndex]
        const complaint = pendingComplaints[i]

        await supabase
          .from('complaints')
          .update({ assigned_worker_id: worker.id })
          .eq('id', complaint.id)

        await supabase
          .from('workers')
          .update({ assigned_count: worker.assigned_count + 1 })
          .eq('id', worker.id)
      }
    } catch (err) {
      console.error('Round Robin error:', err)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-display text-slate-900 tracking-tight">Add New Worker</h1>
        <p className="text-slate-500 font-medium">Register a new field worker for the NagarSeva force.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Upload Card */}
          <Card className="lg:col-span-1 border-none shadow-sm overflow-hidden bg-slate-50">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Worker Photo</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative w-40 h-40 group cursor-pointer">
                <div className="absolute inset-0 bg-slate-200 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed border-slate-300 overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handlePhotoChange}
                  required={false}
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">
                Upload formal ID photo <br /> (JPEG/PNG)
              </p>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-600">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="name" name="name" placeholder="John Doe" className="pl-10 h-12 rounded-xl border-slate-200" required={false} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="phone" name="phone" placeholder="+91 98765 43210" className="pl-10 h-12 rounded-xl border-slate-200" required={false} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-xs font-bold uppercase tracking-widest text-slate-500">Age</Label>
                <Input id="age" name="age" type="number" placeholder="25" className="h-12 rounded-xl border-slate-200" required={false} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-widest text-slate-500">Gender</Label>
                <Select name="gender" required={false}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="area" className="text-xs font-bold uppercase tracking-widest text-slate-500">Assigned Area</Label>
                <Select name="area" required={false}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select Locality / Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {BANGALORE_AREAS.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Identification Card */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-600">Government Identification</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="idType" className="text-xs font-bold uppercase tracking-widest text-slate-500">ID Type</Label>
              <Select name="idType" required={false}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select Document Type" />
                </SelectTrigger>
                <SelectContent>
                  {GOV_ID_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-4 pt-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Document Front Photo</Label>
              <div 
                className="relative w-full h-48 rounded-[2rem] bg-slate-50 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer group hover:border-emerald-500/50 transition-colors overflow-hidden"
              >
                {docPhotoPreview ? (
                  <img src={docPhotoPreview} alt="Doc Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-slate-300 group-hover:scale-110 transition-transform" />
                    <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to upload document photo</p>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleDocPhotoChange}
                  required={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            className="rounded-xl h-12 px-8 font-bold"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="rounded-xl h-12 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Register Worker
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
