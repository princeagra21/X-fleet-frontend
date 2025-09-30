# Frontend API Integration Guide

## 🎯 **Frontend-Only Project - External API Calls**

This guide shows **exactly how to call external APIs** from your X-Fleet frontend application. This is a **frontend-only** project that consumes APIs from your backend services.

## 🚀 **Quick Start: Making API Calls**

### 1. Basic API Call Example

```typescript
import { apiService } from '@/lib/api-client'

// GET request to your backend API
const getVehicles = async () => {
  try {
    const response = await apiService.get<Vehicle[]>('/fleet/vehicles')
    
    if (response.success && response.data) {
      console.log('Vehicles:', response.data)
      return response.data
    }
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
```

### 2. Using React Hooks for API Calls

```tsx
import { useFetch, useMutation } from '@/hooks/useApi'

function VehicleList() {
  // Automatically fetch data when component mounts
  const { data: vehicles, loading, error, refetch } = useFetch<Vehicle[]>('/fleet/vehicles')

  // Create mutation for POST/PUT/DELETE
  const { mutate: createVehicle, loading: creating } = useMutation<Vehicle, CreateVehicleData>()

  const handleCreateVehicle = async (vehicleData: CreateVehicleData) => {
    try {
      await createVehicle('POST', '/fleet/vehicles', vehicleData)
      refetch() // Refresh the list
    } catch (error) {
      console.error('Failed to create vehicle:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {vehicles?.map(vehicle => (
        <div key={vehicle.id}>{vehicle.make} {vehicle.model}</div>
      ))}
    </div>
  )
}
```

## 🔧 **API Configuration**

### Environment Variables (.env.local)

```bash
# Your backend API base URL
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

# Environment identifier
NEXT_PUBLIC_APP_ENV=development
```

### API Client Configuration

```typescript
// src/constants/index.ts
export const API_CONFIG = {
  // Your backend API URL
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.xfleet.com/v1',
  timeout: 10000,
} as const
```

## 📡 **API Service Examples**

### Authentication API Calls

```typescript
import { authService } from '@/lib/api/auth'

// Login to your backend
const login = async (email: string, password: string) => {
  try {
    // Calls: POST https://your-api.com/api/auth/login
    const response = await authService.login({ email, password })
    
    // Tokens are automatically stored
    console.log('User logged in:', response.user)
    return response
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

// Get current user from your backend
const getCurrentUser = async () => {
  try {
    // Calls: GET https://your-api.com/api/auth/me
    const user = await authService.getCurrentUser()
    return user
  } catch (error) {
    console.error('Failed to get user:', error)
    throw error
  }
}
```

### Fleet Management API Calls

```typescript
import { fleetService } from '@/lib/api/fleet'

// Get vehicles with filters
const getVehicles = async () => {
  try {
    // Calls: GET https://your-api.com/api/fleet/vehicles?status=active
    const vehicles = await fleetService.getVehicles({ status: 'active' })
    return vehicles
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    throw error
  }
}

// Create a new vehicle
const createVehicle = async (vehicleData: CreateVehicleData) => {
  try {
    // Calls: POST https://your-api.com/api/fleet/vehicles
    const newVehicle = await fleetService.createVehicle(vehicleData)
    return newVehicle
  } catch (error) {
    console.error('Failed to create vehicle:', error)
    throw error
  }
}

// Upload vehicle document
const uploadDocument = async (vehicleId: string, file: File) => {
  try {
    // Calls: POST https://your-api.com/api/fleet/vehicles/:id/documents
    const result = await fleetService.uploadVehicleDocument(
      vehicleId, 
      file, 
      'insurance',
      (progress) => console.log(`Upload progress: ${progress}%`)
    )
    return result
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
```

## 🛠️ **React Component Examples**

### 1. Data Fetching Component

```tsx
// src/components/VehicleList.tsx
import { useFetch } from '@/hooks/useApi'
import { Vehicle } from '@/lib/api/fleet'

export function VehicleList() {
  const { data: vehicles, loading, error, refetch } = useFetch<Vehicle[]>('/fleet/vehicles')

  if (loading) return <div>Loading vehicles from API...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <button onClick={refetch}>Refresh Data</button>
      {vehicles?.map(vehicle => (
        <div key={vehicle.id}>
          {vehicle.make} {vehicle.model} - {vehicle.status}
        </div>
      ))}
    </div>
  )
}
```

### 2. Form with API Mutation

```tsx
// src/components/CreateVehicleForm.tsx
import { useMutation } from '@/hooks/useApi'
import { Vehicle } from '@/lib/api/fleet'

export function CreateVehicleForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: createVehicle, loading, error } = useMutation<Vehicle, CreateVehicleData>()

  const handleSubmit = async (formData: CreateVehicleData) => {
    try {
      // This calls your backend API
      await createVehicle('POST', '/fleet/vehicles', formData)
      onSuccess() // Refresh parent component
    } catch (err) {
      console.error('Failed to create vehicle:', err)
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.target as HTMLFormElement)
      handleSubmit({
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        // ... other fields
      })
    }}>
      <input name="make" placeholder="Vehicle Make" required />
      <input name="model" placeholder="Vehicle Model" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Vehicle'}
      </button>
      {error && <div>Error: {error}</div>}
    </form>
  )
}
```

### 3. File Upload Component

```tsx
// src/components/DocumentUpload.tsx
import { useFileUpload } from '@/hooks/useApi'

export function DocumentUpload({ vehicleId }: { vehicleId: string }) {
  const { upload, progress, loading, error } = useFileUpload()

  const handleFileUpload = async (file: File) => {
    try {
      // Uploads to your backend API
      await upload(`/fleet/vehicles/${vehicleId}/documents`, file)
      alert('Document uploaded successfully!')
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
        accept=".pdf,.jpg,.png"
      />
      
      {loading && (
        <div>
          Uploading... {progress}%
          <div style={{ width: '100%', background: '#f0f0f0' }}>
            <div style={{ 
              width: `${progress}%`, 
              background: '#007bff', 
              height: '20px' 
            }} />
          </div>
        </div>
      )}
      
      {error && <div>Upload error: {error}</div>}
    </div>
  )
}
```

## 🔐 **Authentication Integration**

### Login Flow with Your Backend

```tsx
// src/components/LoginForm.tsx
import { authService } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    try {
      // This calls your backend authentication API
      console.log('🚀 Calling API: POST /auth/login')
      
      const response = await authService.login({ email, password })
      
      // JWT tokens are automatically stored and managed
      console.log('✅ Login successful:', response.user)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('❌ Login failed:', error)
      // Handle login error (show message to user)
    }
  }

  // ... render form
}
```

### Protected Route Example

```tsx
// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react'
import { isAuthenticated, authService } from '@/lib/api-client'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Verify token with your backend
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          console.error('Authentication failed:', error)
          // Redirect to login
          window.location.href = '/login'
        }
      } else {
        window.location.href = '/login'
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) return <div>Checking authentication...</div>

  return <>{children}</>
}
```

## 📊 **Real-time Data Example**

```tsx
// src/components/VehicleTracker.tsx
import { useEffect, useState } from 'react'
import { fleetService } from '@/lib/api/fleet'

export function VehicleTracker() {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    // Fetch real-time locations every 30 seconds
    const interval = setInterval(async () => {
      try {
        // Calls: GET /fleet/vehicles/locations/real-time
        const realTimeLocations = await fleetService.getRealTimeVehicleLocations()
        setLocations(realTimeLocations)
      } catch (error) {
        console.error('Failed to fetch real-time data:', error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h3>Live Vehicle Tracking</h3>
      {locations.map(({ vehicleId, location }) => (
        <div key={vehicleId}>
          Vehicle {vehicleId}: {location.address}
          <br />
          Speed: {location.speed} mph | Updated: {location.timestamp}
        </div>
      ))}
    </div>
  )
}
```

## 🌐 **API Response Handling**

### Standard Response Format

Your backend should return responses in this format:

```typescript
// Success Response
{
  "success": true,
  "data": {
    // Your actual data here
  },
  "message": "Operation completed successfully"
}

// Error Response  
{
  "success": false,
  "error": "Error message for display",
  "message": "Detailed error information"
}
```

### Error Handling Pattern

```typescript
// Standard error handling in API services
try {
  const response = await apiService.get<DataType>('/your-endpoint')
  
  if (response.success && response.data) {
    return response.data
  }
  
  throw new Error(response.message || 'API call failed')
} catch (error) {
  console.error('API Error:', error)
  
  // Re-throw for component handling
  throw error
}
```

## 🔄 **Development vs Production**

### Development Setup

```typescript
// .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_ENV=development
```

### Production Setup

```typescript
// .env.production (production)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/v1
NEXT_PUBLIC_APP_ENV=production
```

## 📝 **Testing API Calls**

### Using Browser Console

```javascript
// Test API calls in browser console
// Open DevTools → Console and run:

// Test authentication
await authService.login({ email: 'test@example.com', password: 'password' })

// Test data fetching  
await fleetService.getVehicles()

// Test creating data
await fleetService.createVehicle({
  make: 'Toyota',
  model: 'Camry',
  year: 2024,
  vin: '1234567890ABCDEFG',
  licensePlate: 'ABC-123'
})
```

### Mock API for Development

```typescript
// Create mock responses for testing
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    vin: '1234567890ABCDEFG',
    licensePlate: 'ABC-123',
    status: 'active',
    mileage: 15000,
    fuelLevel: 75,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY',
      timestamp: '2024-01-15T10:30:00Z'
    }
  }
]

// Use in components during development
const { data: vehicles } = useMock ? { data: mockVehicles } : useFetch<Vehicle[]>('/fleet/vehicles')
```

## 🎯 **Integration Checklist**

### Backend API Requirements

- [ ] **Authentication endpoints** (`/auth/login`, `/auth/me`, etc.)
- [ ] **CRUD endpoints** for your data models
- [ ] **File upload endpoints** with multipart/form-data support
- [ ] **Pagination support** (`?page=1&limit=20`)
- [ ] **Filtering/search** support (`?status=active&search=toyota`)
- [ ] **CORS configuration** for your frontend domain
- [ ] **JWT token validation** and refresh endpoints

### Frontend Integration Steps

1. [ ] **Update API_CONFIG** with your backend URL
2. [ ] **Set environment variables** (`.env.local`)
3. [ ] **Test authentication flow** with real credentials
4. [ ] **Implement error handling** for your specific API responses
5. [ ] **Add loading states** for better UX
6. [ ] **Test file uploads** if needed
7. [ ] **Implement pagination** for large data sets
8. [ ] **Add real-time updates** if required

## 🚀 **Live API Testing**

Visit the **API Examples page** to see live demonstrations:

```bash
# Run the development server
npm run dev

# Visit the examples page
http://localhost:3000/api-examples
```

The examples show:
- ✅ **GET requests** with loading states
- ✅ **POST requests** with form handling  
- ✅ **File uploads** with progress tracking
- ✅ **Pagination** with load more functionality
- ✅ **Error handling** patterns
- ✅ **Direct service calls** vs React hooks

---

## 🎉 **Ready to Connect Your Backend!**

This frontend is **ready to consume your APIs**. Simply:

1. **Update the API URLs** in `src/constants/index.ts`
2. **Set your environment variables**
3. **Start calling your backend APIs**

All the infrastructure is in place for:
- 🔐 **JWT Authentication**
- 📊 **Data Management** 
- 📁 **File Uploads**
- 🔄 **Real-time Updates**
- 📱 **Responsive UI**

**Your frontend is ready to work with any backend API!** 🚀
