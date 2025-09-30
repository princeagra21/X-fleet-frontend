'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useFetch, useMutation, useFileUpload, usePagination, useApiCall } from '@/hooks/useApi'
import { fleetService, type Vehicle, type Driver } from '@/lib/api/fleet'
import { authService } from '@/lib/api/auth'
import { Loader2, Upload, RefreshCw, Plus, Search } from 'lucide-react'

// ===============================================
// 1. BASIC DATA FETCHING EXAMPLE
// ===============================================
export function VehicleListExample() {
  // Automatically fetch vehicles when component mounts
  const { data: vehicles, loading, error, refetch } = useFetch<Vehicle[]>('/fleet/vehicles')

  // Show loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading vehicles from API...
        </CardContent>
      </Card>
    )
  }

  // Show error state
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="py-8">
          <div className="text-red-600 text-center">
            <p>Error loading vehicles: {error}</p>
            <Button onClick={refetch} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vehicle List (API Data)</CardTitle>
        <CardDescription>
          Data loaded from: GET /api/fleet/vehicles
        </CardDescription>
        <Button onClick={refetch} size="sm" className="w-fit">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </CardHeader>
      <CardContent>
        {vehicles && vehicles.length > 0 ? (
          <div className="grid gap-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="border rounded-lg p-4">
                <h3 className="font-semibold font-secondary">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </h3>
                <p className="text-sm text-gray-600 font-mono">VIN: {vehicle.vin}</p>
                <p className="text-sm text-gray-600">Status: {vehicle.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No vehicles found</p>
        )}
      </CardContent>
    </Card>
  )
}

// ===============================================
// 2. FORM MUTATION EXAMPLE
// ===============================================
export function CreateVehicleExample() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 2024,
    vin: '',
    licensePlate: ''
  })

  // Use mutation hook for creating vehicles
  const { mutate: createVehicle, loading: creating, error } = useMutation<
    Vehicle,
    Omit<Vehicle, 'id'>
  >()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Call API to create vehicle
      const newVehicle = await createVehicle('POST', '/fleet/vehicles', {
        ...formData,
        status: 'active' as const,
        mileage: 0,
        fuelLevel: 100,
        location: {
          latitude: 0,
          longitude: 0,
          address: 'Unknown',
          timestamp: new Date().toISOString()
        }
      })

      console.log('Vehicle created:', newVehicle)
      alert('Vehicle created successfully!')
      
      // Reset form
      setFormData({
        make: '',
        model: '',
        year: 2024,
        vin: '',
        licensePlate: ''
      })
    } catch (err) {
      console.error('Failed to create vehicle:', err)
      alert('Failed to create vehicle. Please try again.')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Vehicle</CardTitle>
        <CardDescription>
          POST /api/fleet/vehicles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={formData.make}
              onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
              placeholder="Toyota, Ford, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Camry, F-150, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value }))}
              placeholder="17-character VIN"
              className="font-mono"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">Error: {error}</p>
          )}

          <Button type="submit" disabled={creating} className="w-full">
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Vehicle...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Vehicle
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ===============================================
// 3. FILE UPLOAD EXAMPLE
// ===============================================
export function DocumentUploadExample() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [vehicleId, setVehicleId] = useState('')
  
  const { upload, progress, loading, error, data } = useFileUpload()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !vehicleId) {
      alert('Please select a file and enter vehicle ID')
      return
    }

    try {
      // Upload file with progress tracking
      const result = await upload(`/fleet/vehicles/${vehicleId}/documents`, selectedFile)
      console.log('Upload result:', result)
      alert('Document uploaded successfully!')
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed. Please try again.')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload Vehicle Document</CardTitle>
        <CardDescription>
          POST /api/fleet/vehicles/:id/documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Vehicle ID</Label>
          <Input
            id="vehicleId"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            placeholder="Enter vehicle ID"
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Document File</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        {selectedFile && (
          <div className="text-sm text-gray-600">
            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </div>
        )}

        {loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm">Error: {error}</p>
        )}

        {!!data && (
          <p className="text-green-600 text-sm">Upload successful!</p>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={loading || !selectedFile || !vehicleId}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading... {progress}%
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// ===============================================
// 4. PAGINATED DATA EXAMPLE
// ===============================================
export function PaginatedDriversExample() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Use pagination hook for drivers
  const { data: drivers, loading, error, hasMore, loadMore, refresh } = usePagination<Driver>(
    '/fleet/drivers',
    10 // page size
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Drivers List (Paginated)</CardTitle>
        <CardDescription>
          GET /api/fleet/drivers?page=1&limit=10
        </CardDescription>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={refresh} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {drivers && drivers.length > 0 ? (
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div key={driver.id} className="border rounded-lg p-4">
                <h3 className="font-semibold font-secondary">{driver.name}</h3>
                <p className="text-sm text-gray-600">{driver.email}</p>
                <p className="text-sm text-gray-600 font-mono">
                  License: {driver.licenseNumber}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  driver.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {driver.status}
                </span>
              </div>
            ))}

            {hasMore && (
              <div className="text-center">
                <Button 
                  onClick={loadMore} 
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    'Load More Drivers'
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No drivers found</p>
        )}

        {error && (
          <p className="text-red-600 text-center">Error: {error}</p>
        )}
      </CardContent>
    </Card>
  )
}

// ===============================================
// 5. DIRECT SERVICE CALL EXAMPLE
// ===============================================
export function DirectApiCallExample() {
  const [vehicleId, setVehicleId] = useState('')
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVehicleById = async () => {
    if (!vehicleId.trim()) {
      alert('Please enter a vehicle ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Direct service call example
      const vehicle = await fleetService.getVehicleById(vehicleId.trim())
      setVehicleData(vehicle)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setVehicleData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Direct API Service Call</CardTitle>
        <CardDescription>
          GET /api/fleet/vehicles/:id using fleetService.getVehicleById()
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter Vehicle ID"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="font-mono"
          />
          <Button 
            onClick={fetchVehicleById}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Fetch'
            )}
          </Button>
        </div>

        {error && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
            Error: {error}
          </div>
        )}

        {vehicleData && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold font-secondary mb-2">Vehicle Found:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Make/Model:</strong> {vehicleData.make} {vehicleData.model}</p>
              <p><strong>Year:</strong> {vehicleData.year}</p>
              <p className="font-mono"><strong>VIN:</strong> {vehicleData.vin}</p>
              <p><strong>Status:</strong> {vehicleData.status}</p>
              <p className="font-mono"><strong>Mileage:</strong> {vehicleData.mileage} miles</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ===============================================
// 6. COMBINED EXAMPLE SHOWCASE
// ===============================================
export function ApiUsageShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-secondary mb-4">
            API Integration Examples
          </h1>
          <p className="text-lg text-gray-600 font-sans">
            Real-world examples of calling external APIs in X-Fleet Frontend
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Data Fetching */}
          <div className="space-y-6">
            <VehicleListExample />
            <CreateVehicleExample />
          </div>

          {/* Advanced Features */}
          <div className="space-y-6">
            <DocumentUploadExample />
            <DirectApiCallExample />
          </div>

          {/* Full Width Examples */}
          <div className="lg:col-span-2 space-y-6">
            <PaginatedDriversExample />
          </div>
        </div>

        {/* API Integration Notes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-secondary">🔧 API Integration Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold font-secondary mb-2">Key Features:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Automatic JWT token management</li>
                  <li>• Request/response interceptors</li>
                  <li>• Loading states and error handling</li>
                  <li>• File upload with progress tracking</li>
                  <li>• Pagination support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold font-secondary mb-2">Usage Patterns:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• useFetch() for automatic data fetching</li>
                  <li>• useMutation() for POST/PUT/DELETE operations</li>
                  <li>• useFileUpload() for file uploads</li>
                  <li>• Direct service calls for complex logic</li>
                  <li>• usePagination() for large datasets</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
