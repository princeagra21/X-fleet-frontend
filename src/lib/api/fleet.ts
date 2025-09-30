import { apiService } from '@/lib/api-client'
import type { ApiResponse } from '@/types'

// Fleet-related types for external API responses
export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  status: 'active' | 'maintenance' | 'retired'
  mileage: number
  fuelLevel: number
  location: {
    latitude: number
    longitude: number
    address: string
    timestamp: string
  }
  driver?: {
    id: string
    name: string
    phone: string
  }
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  status: 'active' | 'inactive' | 'suspended'
  assignedVehicle?: string
}

export interface Trip {
  id: string
  vehicleId: string
  driverId: string
  startLocation: string
  endLocation: string
  distance: number
  duration: number // in minutes
  startTime: string
  endTime: string
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled'
}

// Example API service for Fleet Management
// This shows how to call external backend APIs
export class FleetService {
  private baseUrl = '/fleet'

  // ========================================
  // VEHICLE MANAGEMENT EXAMPLES
  // ========================================

  /**
   * Get all vehicles from external API
   * Example call: GET https://your-api.com/api/fleet/vehicles
   */
  async getVehicles(filters?: {
    status?: string
    make?: string
    location?: string
  }): Promise<Vehicle[]> {
    try {
      const queryParams = new URLSearchParams()
      
      // Add filters to query parameters
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.make) queryParams.append('make', filters.make)
      if (filters?.location) queryParams.append('location', filters.location)

      const url = `${this.baseUrl}/vehicles?${queryParams.toString()}`
      const response = await apiService.get<Vehicle[]>(url)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch vehicles')
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      throw error
    }
  }

  /**
   * Get single vehicle by ID
   * Example call: GET https://your-api.com/api/fleet/vehicles/123
   */
  async getVehicleById(vehicleId: string): Promise<Vehicle> {
    try {
      const response = await apiService.get<Vehicle>(`${this.baseUrl}/vehicles/${vehicleId}`)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch vehicle')
    } catch (error) {
      console.error(`Error fetching vehicle ${vehicleId}:`, error)
      throw error
    }
  }

  /**
   * Create new vehicle
   * Example call: POST https://your-api.com/api/fleet/vehicles
   */
  async createVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    try {
      const response = await apiService.post<Vehicle>(`${this.baseUrl}/vehicles`, vehicleData)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to create vehicle')
    } catch (error) {
      console.error('Error creating vehicle:', error)
      throw error
    }
  }

  /**
   * Update existing vehicle
   * Example call: PUT https://your-api.com/api/fleet/vehicles/123
   */
  async updateVehicle(vehicleId: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const response = await apiService.put<Vehicle>(`${this.baseUrl}/vehicles/${vehicleId}`, updates)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to update vehicle')
    } catch (error) {
      console.error(`Error updating vehicle ${vehicleId}:`, error)
      throw error
    }
  }

  /**
   * Delete vehicle
   * Example call: DELETE https://your-api.com/api/fleet/vehicles/123
   */
  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const response = await apiService.delete(`${this.baseUrl}/vehicles/${vehicleId}`)

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete vehicle')
      }
    } catch (error) {
      console.error(`Error deleting vehicle ${vehicleId}:`, error)
      throw error
    }
  }

  // ========================================
  // DRIVER MANAGEMENT EXAMPLES
  // ========================================

  /**
   * Get all drivers with pagination
   * Example call: GET https://your-api.com/api/fleet/drivers?page=1&limit=20
   */
  async getDrivers(page = 1, limit = 20, search?: string): Promise<{
    drivers: Driver[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (search) {
        queryParams.append('search', search)
      }

      const url = `${this.baseUrl}/drivers?${queryParams.toString()}`
      const response = await apiService.get<{
        drivers: Driver[]
        pagination: {
          page: number
          limit: number
          total: number
          totalPages: number
        }
      }>(url)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch drivers')
    } catch (error) {
      console.error('Error fetching drivers:', error)
      throw error
    }
  }

  /**
   * Assign driver to vehicle
   * Example call: POST https://your-api.com/api/fleet/vehicles/123/assign-driver
   */
  async assignDriverToVehicle(vehicleId: string, driverId: string): Promise<void> {
    try {
      const response = await apiService.post(`${this.baseUrl}/vehicles/${vehicleId}/assign-driver`, {
        driverId
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to assign driver')
      }
    } catch (error) {
      console.error('Error assigning driver to vehicle:', error)
      throw error
    }
  }

  // ========================================
  // TRIP MANAGEMENT EXAMPLES
  // ========================================

  /**
   * Get trips with filters
   * Example call: GET https://your-api.com/api/fleet/trips?vehicleId=123&status=in-progress
   */
  async getTrips(filters?: {
    vehicleId?: string
    driverId?: string
    status?: string
    startDate?: string
    endDate?: string
  }): Promise<Trip[]> {
    try {
      const queryParams = new URLSearchParams()
      
      // Add all filters to query parameters
      Object.entries(filters || {}).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const url = `${this.baseUrl}/trips?${queryParams.toString()}`
      const response = await apiService.get<Trip[]>(url)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch trips')
    } catch (error) {
      console.error('Error fetching trips:', error)
      throw error
    }
  }

  /**
   * Start a new trip
   * Example call: POST https://your-api.com/api/fleet/trips/start
   */
  async startTrip(tripData: {
    vehicleId: string
    driverId: string
    startLocation: string
    plannedEndLocation: string
  }): Promise<Trip> {
    try {
      const response = await apiService.post<Trip>(`${this.baseUrl}/trips/start`, tripData)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to start trip')
    } catch (error) {
      console.error('Error starting trip:', error)
      throw error
    }
  }

  /**
   * End a trip
   * Example call: PUT https://your-api.com/api/fleet/trips/123/end
   */
  async endTrip(tripId: string, endData: {
    endLocation: string
    mileage: number
    notes?: string
  }): Promise<Trip> {
    try {
      const response = await apiService.put<Trip>(`${this.baseUrl}/trips/${tripId}/end`, endData)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to end trip')
    } catch (error) {
      console.error(`Error ending trip ${tripId}:`, error)
      throw error
    }
  }

  // ========================================
  // REAL-TIME DATA EXAMPLES
  // ========================================

  /**
   * Get real-time vehicle locations
   * Example call: GET https://your-api.com/api/fleet/vehicles/locations/real-time
   */
  async getRealTimeVehicleLocations(): Promise<{
    vehicleId: string
    location: {
      latitude: number
      longitude: number
      address: string
      speed: number
      heading: number
      timestamp: string
    }
  }[]> {
    try {
      const response = await apiService.get<{
        vehicleId: string
        location: {
          latitude: number
          longitude: number
          address: string
          speed: number
          heading: number
          timestamp: string
        }
      }[]>(`${this.baseUrl}/vehicles/locations/real-time`)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch real-time locations')
    } catch (error) {
      console.error('Error fetching real-time locations:', error)
      throw error
    }
  }

  /**
   * Get vehicle analytics/stats
   * Example call: GET https://your-api.com/api/fleet/analytics/dashboard
   */
  async getDashboardAnalytics(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<{
    totalVehicles: number
    activeTrips: number
    totalDrivers: number
    fuelConsumption: number
    maintenanceDue: number
    recentTrips: Trip[]
    alertsCount: number
  }> {
    try {
      const response = await apiService.get<{
        totalVehicles: number
        activeTrips: number
        totalDrivers: number
        fuelConsumption: number
        maintenanceDue: number
        recentTrips: Trip[]
        alertsCount: number
      }>(`${this.baseUrl}/analytics/dashboard?timeRange=${timeRange}`)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch dashboard analytics')
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error)
      throw error
    }
  }

  // ========================================
  // FILE UPLOAD EXAMPLES
  // ========================================

  /**
   * Upload vehicle document (insurance, registration, etc.)
   * Example call: POST https://your-api.com/api/fleet/vehicles/123/documents
   */
  async uploadVehicleDocument(
    vehicleId: string, 
    file: File, 
    documentType: string,
    onProgress?: (progress: number) => void
  ): Promise<{ documentId: string; url: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)
      formData.append('vehicleId', vehicleId)

      const response = await apiService.uploadFile(
        `${this.baseUrl}/vehicles/${vehicleId}/documents`,
        file,
        onProgress
      )

      if (response.success && response.data) {
        return response.data as { documentId: string; url: string }
      }

      throw new Error(response.message || 'Failed to upload document')
    } catch (error) {
      console.error('Error uploading vehicle document:', error)
      throw error
    }
  }
}

// Export singleton instance
export const fleetService = new FleetService()

// Example usage in components:
/*
import { fleetService } from '@/lib/api/fleet'
import { useFetch, useMutation } from '@/hooks/useApi'

// In a component:
function VehicleList() {
  // Fetch vehicles on component mount
  const { data: vehicles, loading, error, refetch } = useFetch<Vehicle[]>(
    '/fleet/vehicles'
  )

  // Create mutation for adding new vehicle
  const { mutate: createVehicle, loading: creating } = useMutation<Vehicle, Omit<Vehicle, 'id'>>()

  const handleCreateVehicle = async (vehicleData) => {
    try {
      await createVehicle('POST', '/fleet/vehicles', vehicleData)
      refetch() // Refresh the list
    } catch (error) {
      console.error('Failed to create vehicle:', error)
    }
  }

  // Direct service call
  const handleDirectCall = async () => {
    try {
      const vehicles = await fleetService.getVehicles({ status: 'active' })
      console.log('Vehicles:', vehicles)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      {loading && <div>Loading vehicles...</div>}
      {error && <div>Error: {error}</div>}
      {vehicles && vehicles.map(vehicle => (
        <div key={vehicle.id}>{vehicle.make} {vehicle.model}</div>
      ))}
    </div>
  )
}
*/
