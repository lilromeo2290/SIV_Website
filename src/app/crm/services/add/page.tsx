'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

interface ClientOption {
  id: string
  fullName: string
  phone: string
}

const equipmentTypes = [
  'Generator',
  'Transformer',
  'Engine',
  'Motor',
  'Compressor',
  'Pump',
  'Electrical Panel',
  'HVAC',
  'Vehicle',
  'Other',
]

export default function AddServicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingClients, setFetchingClients] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    clientId: '',
    equipmentName: '',
    equipmentType: '',
    serialNumber: '',
    problemDescription: '',
    assignedEngineer: '',
  })

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/crm/api/clients/list')
        if (!res.ok) throw new Error('Failed to fetch clients')
        const data = await res.json()
        setClients(data)
      } catch (err) {
        console.error(err)
      } finally {
        setFetchingClients(false)
      }
    }
    fetchClients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.clientId || !formData.equipmentName || !formData.problemDescription) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/crm/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create service request')
      }

      router.push('/crm/services')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/crm/services" aria-label="Back to service requests">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              New Service Request
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create a new equipment service or repair request.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Request Details</CardTitle>
          <CardDescription>
            Fill in the equipment and issue information below. Fields marked with{' '}
            <span className="text-red-500">*</span> are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Client Selection */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="clientId">
                Client <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.clientId}
                onValueChange={(val) => updateField('clientId', val)}
                disabled={fetchingClients}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      fetchingClients
                        ? 'Loading clients...'
                        : 'Select a client'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <span>{client.fullName}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs text-slate-400">
                          {client.phone}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {clients.length === 0 && !fetchingClients && (
                    <SelectItem value="_none" disabled>
                      No clients found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Equipment Name & Type */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="equipmentName">
                  Equipment Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="equipmentName"
                  placeholder="e.g. CAT C15 Diesel Engine"
                  value={formData.equipmentName}
                  onChange={(e) =>
                    updateField('equipmentName', e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="equipmentType">Equipment Type</Label>
                <Select
                  value={formData.equipmentType}
                  onValueChange={(val) => updateField('equipmentType', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Serial Number */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                placeholder="Enter equipment serial number"
                value={formData.serialNumber}
                onChange={(e) => updateField('serialNumber', e.target.value)}
              />
            </div>

            {/* Problem Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="problemDescription">
                Problem Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="problemDescription"
                placeholder="Describe the problem, symptoms, and any relevant details..."
                rows={4}
                value={formData.problemDescription}
                onChange={(e) =>
                  updateField('problemDescription', e.target.value)
                }
                className="resize-none"
              />
            </div>

            {/* Assigned Engineer */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="assignedEngineer">Assigned Engineer</Label>
              <Input
                id="assignedEngineer"
                placeholder="e.g. John Smith"
                value={formData.assignedEngineer}
                onChange={(e) =>
                  updateField('assignedEngineer', e.target.value)
                }
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/crm/services')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || fetchingClients}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Service Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
