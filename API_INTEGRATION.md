# X-Fleet API Integration Guide

## 🔧 Professional API Client Architecture

This document outlines the professional API integration setup for the X-Fleet frontend application.

## 📚 Core Components

### 1. API Client (`src/lib/api-client.ts`)

A robust Axios-based HTTP client with:

- **Automatic Token Management**: JWT tokens are automatically attached to requests
- **Token Refresh**: Automatic token refresh on 401 errors
- **Request/Response Interceptors**: Comprehensive logging and error handling
- **TypeScript Support**: Fully typed requests and responses
- **Upload Support**: File upload with progress tracking

```typescript
import { apiService } from '@/lib/api-client'

// GET request
const users = await apiService.get<User[]>('/users')

// POST request  
const newUser = await apiService.post<User>('/users', userData)

// File upload with progress
const uploadResult = await apiService.uploadFile('/upload', file, (progress) => {
  console.log(`Upload progress: ${progress}%`)
})
```

### 2. Authentication Service (`src/lib/api/auth.ts`)

Comprehensive authentication service with:

- **Login/Registration**: Full user authentication flow
- **Token Management**: Secure token storage and refresh
- **Password Reset**: Complete password reset workflow
- **Profile Management**: User profile CRUD operations
- **Email Verification**: Email verification functionality

```typescript
import { authService } from '@/lib/api/auth'

// Login user
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123',
  remember: true
})

// Register new user
const registerResponse = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123'
})

// Logout user
await authService.logout()
```

## 🔒 Security Features

### Token Management
- **Access Token**: Short-lived JWT token for API requests
- **Refresh Token**: Long-lived token for obtaining new access tokens
- **Automatic Refresh**: Seamless token refresh on expiration
- **Secure Storage**: Tokens stored in localStorage with proper cleanup

### Request Security
- **HTTPS Only**: All API requests use HTTPS in production
- **CSRF Protection**: Built-in CSRF token handling
- **Rate Limiting**: Client-side request throttling
- **Error Sanitization**: Secure error message handling

## 📊 Error Handling

### Error Types
1. **Network Errors**: Connection issues, timeouts
2. **Authentication Errors**: Invalid tokens, unauthorized access
3. **Validation Errors**: Invalid request data
4. **Server Errors**: 5xx server responses

### Error Response Format
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

### Example Error Handling
```typescript
try {
  const result = await apiService.post('/endpoint', data)
} catch (error) {
  if (error.message.includes('Network error')) {
    // Handle network issues
    showNotification('Please check your internet connection')
  } else if (error.message.includes('timeout')) {
    // Handle timeouts
    showNotification('Request timed out, please try again')
  } else {
    // Handle other errors
    showNotification(error.message)
  }
}
```

## 🔄 Request/Response Flow

### Request Flow
1. **Request Preparation**: Add headers, token, timestamp
2. **Validation**: Client-side validation before sending
3. **Sending**: HTTP request via Axios
4. **Logging**: Development request logging
5. **Error Handling**: Automatic error processing

### Response Flow
1. **Response Reception**: Axios response processing
2. **Token Refresh**: Automatic refresh on 401 errors
3. **Data Extraction**: Extract data from response wrapper
4. **Logging**: Development response logging
5. **Error Processing**: Convert API errors to user-friendly messages

## 📝 TypeScript Integration

### Type Definitions
All API interactions are fully typed:

```typescript
// Request types
interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

// Response types
interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
}

// Generic API response wrapper
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

### Usage Examples
```typescript
// Typed service calls
const loginData: LoginCredentials = {
  email: 'user@example.com',
  password: 'password123'
}

const response: LoginResponse = await authService.login(loginData)
const user: User = response.user
```

## 🌐 Environment Configuration

### API Configuration
```typescript
// src/constants/index.ts
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
} as const
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.xfleet.com/v1
NEXT_PUBLIC_APP_ENV=production
```

## 📖 Service Extensions

### Adding New Services
1. Create service class extending base functionality
2. Define TypeScript interfaces
3. Implement CRUD operations
4. Add error handling
5. Export singleton instance

```typescript
// Example: Fleet Service
export class FleetService {
  private baseUrl = '/fleet'

  async getVehicles(): Promise<Vehicle[]> {
    const response = await apiService.get<Vehicle[]>(`${this.baseUrl}/vehicles`)
    return response.data || []
  }

  async createVehicle(vehicle: CreateVehicleRequest): Promise<Vehicle> {
    const response = await apiService.post<Vehicle>(`${this.baseUrl}/vehicles`, vehicle)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || 'Failed to create vehicle')
  }
}
```

## 🔧 Development Tools

### API Debugging
- **Request Logging**: All requests logged in development
- **Response Logging**: Detailed response information
- **Error Logging**: Comprehensive error details
- **Network Tab**: Browser dev tools integration

### Testing API Calls
```typescript
// Mock API responses for testing
import { apiService } from '@/lib/api-client'

// Mock successful response
jest.spyOn(apiService, 'post').mockResolvedValueOnce({
  success: true,
  data: mockUserData
})
```

## 📈 Performance Optimization

### Caching Strategy
- **Request Deduplication**: Prevent duplicate simultaneous requests
- **Response Caching**: Cache frequently accessed data
- **Optimistic Updates**: Update UI before API confirmation

### Bundle Optimization
- **Tree Shaking**: Only import used API methods
- **Code Splitting**: Lazy load API services
- **Compression**: Gzip/Brotli compression for requests

## 🔍 Monitoring & Analytics

### Request Tracking
- **Request Duration**: Track API response times
- **Error Rates**: Monitor API error frequencies  
- **Usage Analytics**: Track API endpoint usage
- **User Flows**: Monitor authentication flows

### Health Checks
```typescript
// API health check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiService.get('/health')
    return true
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
}
```

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Monitoring setup complete

### Production Configuration
```typescript
// Production API client settings
const productionConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  retries: 3,
  retryDelay: 1000,
}
```

---

**Professional API integration for enterprise-grade applications** 🚀
