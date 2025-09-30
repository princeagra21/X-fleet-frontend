# X-Fleet Fonts Integration Guide

## 🎨 Professional Typography System

This guide details the complete font setup and usage for the X-Fleet application, implementing a professional typography hierarchy.

## 📁 Font Structure

```
src/assets/fonts/
├── inter/                     # Primary font family
│   ├── Inter-Regular.woff2     # 400 weight
│   ├── Inter-Medium.woff2      # 500 weight
│   └── Inter-Bold.woff2        # 700 weight
├── satoshi/                    # Secondary font family  
│   ├── Satoshi-Regular.woff2   # 400 weight
│   └── Satoshi-Bold.woff2      # 700 weight
└── ibm-plex-mono/             # Monospace font family
    └── IBMPlexMono-Regular.woff2 # 400 weight
```

## 🔧 Font Configuration

### Local Font Setup (`src/lib/fonts.ts`)

```typescript
import localFont from 'next/font/local'

// Primary font - Inter
export const inter = localFont({
  src: [
    {
      path: '../assets/fonts/inter/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/inter/Inter-Medium.woff2', 
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/inter/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})
```

### CSS Variables Integration

Fonts are integrated into the Tailwind CSS system via CSS variables:

```css
/* globals.css */
@theme inline {
  --font-sans: var(--font-inter);
  --font-secondary: var(--font-satoshi-bold);
  --font-mono: var(--font-ibm-plex-mono);
}
```

## 🎯 Typography Hierarchy

### Font Usage Guidelines

| Purpose | Font Family | Weight | CSS Class | Use Cases |
|---------|-------------|--------|-----------|-----------|
| **Primary Text** | Inter | 400 | `font-sans` | Body text, descriptions, labels |
| **Medium Text** | Inter | 500 | `font-sans font-medium` | Subheadings, emphasized text |
| **Bold Text** | Inter | 700 | `font-sans font-bold` | Strong emphasis, warnings |
| **Headings** | Satoshi | 400-700 | `font-secondary` | Page titles, section headers |
| **Numbers/Code** | IBM Plex Mono | 400 | `font-mono` | Counters, codes, data display |

## 📖 Usage Examples

### React Components

```tsx
// Primary heading with Satoshi
<h1 className="font-secondary text-3xl font-bold text-gray-900">
  Welcome to X-Fleet
</h1>

// Body text with Inter
<p className="font-sans text-base text-gray-600">
  This is the primary body text using Inter font.
</p>

// Emphasized text
<span className="font-sans font-medium text-gray-800">
  Important information
</span>

// Numbers and codes
<code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
  VIN: 1HGBH41JXMN109186
</code>

// Data display
<div className="font-mono text-lg font-bold text-blue-600">
  $1,234.56
</div>
```

### Form Elements

```tsx
// Form labels
<Label className="font-sans font-medium text-gray-700">
  Email Address
</Label>

// Input placeholders use the same font as input text
<Input 
  placeholder="Enter your email"
  className="font-sans"
/>

// Button text with secondary font for emphasis
<Button className="font-secondary font-bold">
  Sign In
</Button>
```

## 🌐 Font Loading Strategy

### Performance Optimization

1. **Local Hosting**: All fonts are self-hosted for better performance
2. **WOFF2 Format**: Modern format with superior compression
3. **Font Display**: `swap` strategy for improved loading experience
4. **Preloading**: Critical fonts can be preloaded in `<head>`

### Preloading Critical Fonts

Add to your `layout.tsx` or `_document.tsx`:

```tsx
<head>
  <link
    rel="preload"
    href="/assets/fonts/inter/Inter-Regular.woff2"
    as="font"
    type="font/woff2"
    crossOrigin=""
  />
  <link
    rel="preload" 
    href="/assets/fonts/satoshi/Satoshi-Bold.woff2"
    as="font"
    type="font/woff2"
    crossOrigin=""
  />
</head>
```

## 📱 Responsive Typography

### Mobile-First Approach

```tsx
// Responsive heading sizes
<h1 className="font-secondary text-2xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

// Responsive body text
<p className="font-sans text-sm md:text-base lg:text-lg">
  Responsive body text that scales with screen size.
</p>
```

### Typography Scale

| Screen Size | Small Text | Body Text | Large Text | Heading |
|-------------|------------|-----------|------------|---------|
| **Mobile** | `text-xs` (12px) | `text-sm` (14px) | `text-base` (16px) | `text-xl` (20px) |
| **Tablet** | `text-sm` (14px) | `text-base` (16px) | `text-lg` (18px) | `text-2xl` (24px) |
| **Desktop** | `text-base` (16px) | `text-lg` (18px) | `text-xl` (20px) | `text-4xl` (36px) |

## 🎨 Font Pairing Examples

### Login Form Example

```tsx
export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        {/* Logo/Brand - Secondary font */}
        <h1 className="font-secondary text-2xl font-bold text-center">
          X-Fleet
        </h1>
        
        {/* Subtitle - Primary font, medium weight */}
        <p className="font-sans font-medium text-gray-600 text-center">
          Sign in to your account
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Form labels - Primary font, medium weight */}
        <Label className="font-sans font-medium text-gray-700">
          Email Address  
        </Label>
        
        {/* Input text - Primary font, regular weight */}
        <Input className="font-sans" placeholder="john@example.com" />
        
        {/* Error messages - Primary font, medium weight, red color */}
        <p className="font-sans font-medium text-red-600 text-sm">
          Please enter a valid email address
        </p>
        
        {/* Button - Secondary font, bold */}
        <Button className="font-secondary font-bold w-full">
          Sign In
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Dashboard Stats Example

```tsx
export function StatsCard({ title, value, change }) {
  return (
    <Card className="p-6">
      {/* Title - Primary font, medium weight */}
      <h3 className="font-sans font-medium text-gray-600 text-sm uppercase tracking-wide">
        {title}
      </h3>
      
      {/* Large number - Monospace font for alignment */}
      <p className="font-mono text-3xl font-bold text-gray-900 mt-2">
        {value}
      </p>
      
      {/* Change indicator - Primary font, medium weight */}
      <p className="font-sans font-medium text-green-600 text-sm mt-1">
        +{change}% from last month
      </p>
    </Card>
  )
}
```

## 🔧 Font Installation Guide

### 1. Download Required Fonts

#### Inter (Google Fonts)
```bash
# Download Inter from Google Fonts
# https://fonts.google.com/specimen/Inter
# Select weights: 400, 500, 700
# Download as WOFF2 format
```

#### Satoshi (Font Share)
```bash
# Download Satoshi from Font Share
# https://www.fontshare.com/fonts/satoshi
# Select weights: 400, 700
# Convert to WOFF2 if needed
```

#### IBM Plex Mono (Google Fonts)
```bash
# Download IBM Plex Mono from Google Fonts
# https://fonts.google.com/specimen/IBM+Plex+Mono
# Select weight: 400
# Download as WOFF2 format
```

### 2. File Placement

Place downloaded font files in the appropriate directories:

```bash
src/assets/fonts/
├── inter/
│   ├── Inter-Regular.woff2
│   ├── Inter-Medium.woff2  
│   └── Inter-Bold.woff2
├── satoshi/
│   ├── Satoshi-Regular.woff2
│   └── Satoshi-Bold.woff2
└── ibm-plex-mono/
    └── IBMPlexMono-Regular.woff2
```

### 3. Verify Installation

Test font loading by checking in browser dev tools:
1. Open Network tab
2. Filter by "Font"
3. Reload page
4. Verify all font files load successfully

## 🎯 Best Practices

### Do's ✅
- Use Inter for all body text and UI elements
- Use Satoshi for headings and brand elements
- Use IBM Plex Mono for numbers, codes, and data
- Maintain consistent font weights across components
- Test font loading performance regularly

### Don'ts ❌
- Don't mix too many font weights in one component
- Don't use decorative fonts for body text
- Don't ignore font loading performance
- Don't use fonts without proper fallbacks
- Don't forget to test on different devices

## 🔍 Troubleshooting

### Common Issues

1. **Fonts not loading**
   - Check file paths in font configuration
   - Verify WOFF2 files are properly placed
   - Check browser console for font loading errors

2. **Font flash (FOIT/FOUT)**
   - Ensure `font-display: swap` is configured
   - Consider preloading critical fonts
   - Implement proper fallback fonts

3. **Performance issues**
   - Optimize font files (use WOFF2)
   - Limit number of font weights
   - Consider font subsetting for production

### Debug Font Loading

```typescript
// Check if font is loaded
document.fonts.ready.then(() => {
  console.log('All fonts loaded successfully')
})

// Check specific font
document.fonts.load('400 16px Inter').then((fonts) => {
  console.log('Inter font loaded:', fonts.length > 0)
})
```

## 📊 Performance Metrics

### Font Loading Performance
- **First Paint**: < 1.5s with font loading
- **Font Load Time**: < 500ms for critical fonts
- **Cumulative Layout Shift**: < 0.1 with proper fallbacks
- **Bundle Size Impact**: < 200KB total for all fonts

---

**Professional typography for exceptional user experience** ✨
