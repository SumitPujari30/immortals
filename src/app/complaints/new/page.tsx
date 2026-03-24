'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useRegisterComplaint } from '@/hooks'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Camera,
  MapPin,
  AlertCircle,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Trash2,
  ShieldAlert,
  RotateCcw,
  Activity,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

export default function NewComplaintPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { mutateAsync: registerComplaint, isPending } = useRegisterComplaint()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    address: '',
    locationMode: 'auto' as 'auto' | 'manual',
    priority: 'medium',
    riskAssessment: '',
    peopleAffected: '',
  })

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationMode, setLocationMode] = useState<'auto' | 'manual'>('auto')
  const [isGeocoding, setIsGeocoding] = useState(false)

  // Auto-detect location on load
  React.useEffect(() => {
    detectLocation()
  }, [])

  const categories = [
    { value: 'pothole_road_damage', label: 'Pothole & Road Damage' },
    { value: 'garbage_waste_collection', label: 'Garbage & Waste Collection' },
    { value: 'water_leakage', label: 'Water Leakage' },
    { value: 'street_light_issue', label: 'Street Light Issue' },
    { value: 'public_encroachment', label: 'Public Encroachment' },
    { value: 'stray_animal_issue', label: 'Stray Animal Issue' },
    { value: 'other_civic_issue', label: 'Other Civic Issue' },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      
      // Validate file sizes (10MB limit each)
      const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        toast.error(`Files must be under 10MB each. Found: ${oversizedFiles.map(f => f.name).join(', ')}`)
        return
      }
      
      setFiles((prev) => [...prev, ...newFiles])

      const newPreviews = newFiles.map((file) => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file)
        }
        // Placeholder for non-image files (videos/docs)
        return '/file-placeholder.png' 
      })
      setPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const geocodeLocation = async () => {
    if (!formData.address) {
      toast.error('Please enter an address first')
      return
    }

    setIsGeocoding(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=1`
      )
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          address: display_name,
        }))
        toast.success('Address verified and mapped!')
      } else {
        toast.error('Could not find coordinates for this address')
      }
    } catch (error) {
      console.error('Error geocoding address:', error)
      toast.error('An error occurred while verifying the address')
    } finally {
      setIsGeocoding(false)
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setIsDetectingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }))

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          if (data.display_name) {
            setFormData((prev) => ({ ...prev, address: data.display_name }))
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error)
        } finally {
          setIsDetectingLocation(false)
          toast.success('Location detected successfully!')
        }
      },
      (error) => {
        setIsDetectingLocation(false)
        toast.error('Could not detect location: ' + error.message)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.category || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const imageFile = files.find(f => f.type.startsWith('image/'))
    const videoFile = files.find(f => f.type.startsWith('video/'))
    const docFile = files.find(f => !f.type.startsWith('image/') && !f.type.startsWith('video/'))

    try {
      const result = await registerComplaint({
        userId: user.id,
        userEmail: user.email || '',
        userName: '',
        category: formData.category,
        description: formData.description,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        locationAddress: formData.address,
        priorityLevel: formData.priority as 'low' | 'medium' | 'high',
        imageFile,
        videoFile,
        docFile,
        onProgress: (progress) => setUploadProgress(progress),
      })

      if (result.success) {
        toast.success('Complaint registered successfully!')
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Failed to register complaint')
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="hover:bg-primary/5 group justify-start"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Button>
        <div className="text-right sm:text-left">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground bg-muted px-2 sm:px-3 py-1 rounded-full">
            Step 1 of 1: Complaint Registration
          </span>
        </div>
      </div>

      <div
        className="grid grid-cols-1 gap-8 sm:gap-12 animate-in"
        style={{ animationDelay: '100ms' }}
      >
        <Card className="civic-card border-none shadow-lg sm:shadow-xl overflow-hidden">
          <div className="bg-primary h-2" />
          <CardHeader className="pt-8 sm:pt-10 px-6 sm:px-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldAlert className="w-6 h-6 sm:w-10 sm:h-10" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-display font-bold">
                  Register New Complaint
                </CardTitle>
                <CardDescription className="text-sm sm:text-base sm:text-lg">
                  Provide detailed information to help our volunteers address
                  the issue.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6 lg:px-10 pb-8 sm:pb-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Category & Description */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-display border-b pb-2">
                  1. Complaint Details
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-base font-semibold"
                    >
                      Issue Category{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      onValueChange={(val: string) =>
                        setFormData((p) => ({ ...p, category: val }))
                      }
                    >
                      <SelectTrigger className="h-12 border-2 focus:ring-primary">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-base font-semibold"
                  >
                    Detailed Description{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail. Include landmarks or specific observations."
                    className="min-h-[120px] sm:min-h-[150px] border-2 focus:ring-primary resize-none p-3 sm:p-4 text-sm sm:text-base"
                    maxLength={1000}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                  <div className="flex justify-end">
                    <span className={cn(
                      "text-xs font-medium",
                      formData.description.length > 900 ? "text-red-500" : 
                      formData.description.length > 700 ? "text-amber-500" : "text-muted-foreground"
                    )}>
                      {formData.description.length}/1000
                    </span>
                  </div>
                </div>
              </div>

              {/* Multimedia Uploads */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-display border-b pb-2">
                  2. Visual Evidence & Documentation
                </h3>
                <div 
                  className="p-8 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/[0.02] text-center hover:bg-primary/[0.04] transition-colors group cursor-pointer relative"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload files for complaint evidence"
                >
                  <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        Click to upload photos, videos or documents
                      </p>
                      <p className="text-muted-foreground">
                        Images (JPG, PNG), Videos (MP4), Documents (PDF, DOC)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Up to 5 files (Max 10MB each)
                      </p>
                    </div>
                    <Button type="button" variant="outline" className="mt-2 pointer-events-none">
                      <Upload className="w-4 h-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden group border-2 border-primary/10 shadow-sm flex items-center justify-center bg-slate-50"
                      >
                        {file.type.startsWith('image/') ? (
                          <img
                            src={previews[i]}
                            alt={`Preview ${i}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-4 text-center">
                            {file.type.startsWith('video/') ? (
                              <Loader2 className="w-8 h-8 text-primary animate-pulse" />
                            ) : (
                              <Upload className="w-8 h-8 text-primary" />
                            )}
                            <span className="text-[10px] font-medium truncate max-w-full px-2">
                              {file.name}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-display border-b pb-2">
                  3. Location Information
                </h3>
                <div className="space-y-6">
                  <div className="flex bg-slate-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-inner mb-4 sm:mb-6">
                    <button
                      type="button"
                      onClick={() => setLocationMode('auto')}
                      className={cn(
                        "flex-1 py-3 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                        locationMode === 'auto' 
                          ? "bg-white text-primary shadow-md translate-y-[-1px]" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                      role="radio"
                      aria-checked={locationMode === 'auto'}
                      aria-label="Use current GPS location"
                    >
                      <Activity className="w-4 h-4" /> Current GPS
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationMode('manual')}
                      className={cn(
                        "flex-1 py-3 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                        locationMode === 'manual' 
                          ? "bg-white text-primary shadow-md translate-y-[-1px]" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                      role="radio"
                      aria-checked={locationMode === 'manual'}
                      aria-label="Enter location manually"
                    >
                      <MapPin className="w-4 h-4" /> Manual Entry
                    </button>
                  </div>

                  <div className="space-y-6">
                    {locationMode === 'auto' ? (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          type="button"
                          onClick={detectLocation}
                          disabled={isDetectingLocation}
                          className="flex-1 h-14 btn-highlight-civic shadow-lg"
                        >
                          {isDetectingLocation ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          ) : (
                            <Activity className="w-5 h-5 mr-2" />
                          )}
                          {isDetectingLocation
                            ? 'Syncing GPS Coordinates...'
                            : 'Auto-Detect My Location'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Input
                            placeholder="Type street name, landmark, or area..."
                            className="h-14 border-2 focus:ring-primary flex-1"
                            value={formData.address}
                            onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                          />
                          <Button
                            type="button"
                            onClick={geocodeLocation}
                            disabled={isGeocoding}
                            className="h-14 px-8 btn-primary-civic shadow-lg"
                          >
                            {isGeocoding ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 mr-2" />
                            )}
                            {isGeocoding ? 'Verifying...' : 'Verify & Map'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {formData.latitude && formData.longitude && (
                    <div className="w-full h-56 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl relative animate-in fade-in zoom-in duration-500">
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${(parseFloat(formData.longitude) - 0.01).toFixed(4)},${(parseFloat(formData.latitude) - 0.01).toFixed(4)},${(parseFloat(formData.longitude) + 0.01).toFixed(4)},${(parseFloat(formData.latitude) + 0.01).toFixed(4)}&layer=mapnik`}
                        className="w-full h-full border-0"
                        title="Location Preview"
                      />
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur px-5 py-3 rounded-2xl text-[10px] font-black text-slate-800 border border-slate-100 shadow-2xl flex items-center justify-between uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="max-w-[300px] truncate">
                            <p className="text-primary opacity-60 text-[8px] mb-0.5">Anchored Location</p>
                            <p className="line-clamp-1">{formData.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                          <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Data
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="address-display"
                        className="text-base font-semibold"
                      >
                        Final Verified Address
                      </Label>
                      <Input
                        id="address-display"
                        readOnly
                        placeholder="Location details will appear here after verification..."
                        className="h-12 border-2 bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
                        value={formData.address}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-10 border-t space-y-6">
                {isPending && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>
                        Registering complaint and uploading files...
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Button
                    type="submit"
                    className="flex-1 h-14 btn-primary-civic text-xl shadow-xl"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 mr-2" />
                    )}
                    {isPending ? 'Processing...' : 'Register Complaint'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 px-8 text-lg hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
                    onClick={() => router.push('/dashboard')}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Your IP address and location will be logged for verification.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
