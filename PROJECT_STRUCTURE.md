# X-Fleet Frontend - Professional Project Structure

## 🏗️ Expert-Level Architecture

This project follows enterprise-grade frontend architecture patterns and best practices for a scalable, maintainable, and performant Next.js application.

## 📁 Folder Structure

```
x-fleet/
├── public/                     # Static assets
│   ├── fonts/                  # Custom font files
│   │   ├── Satoshi-Bold.woff
│   │   └── Satoshi-Bold.woff2
│   ├── icons/                  # Icon assets
│   └── images/                 # Image assets
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── (auth)/            # Auth route group
│   │   │   └── login/         # Login page
│   │   ├── (dashboard)/       # Dashboard route group
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   └── common/           # Common components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── fonts.ts         # Font configurations
│   │   ├── utils.ts         # General utilities
│   │   └── validations.ts   # Form validation schemas
│   ├── stores/               # State management
│   ├── styles/               # Additional styles
│   ├── types/                # TypeScript type definitions
│   ├── constants/            # Application constants
│   └── utils/                # Utility functions
├── components.json           # shadcn/ui configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Design System

### Colors
- **Primary Color**: Dynamic CSS variable `--primary-color`
- **Secondary Color**: Dynamic CSS variable `--secondary-color`
- **Theme Support**: Light and dark mode ready

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Secondary Font**: Satoshi Bold (Local font)
- **Monospace Font**: IBM Plex Mono (Google Fonts)

### Font Usage Examples
```tsx
// Primary font (default)
<p className="font-sans">This uses Inter font</p>

// Secondary font (headings, buttons)
<h1 className="font-secondary">This uses Satoshi Bold</h1>

// Monospace font (code, numbers)
<code className="font-mono">This uses IBM Plex Mono</code>
```

## 🔧 Technology Stack

### Core
- **Framework**: Next.js 15.5.4
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui

### Forms & Validation
- **Form Library**: React Hook Form
- **Validation**: Zod
- **Resolver**: @hookform/resolvers

### Icons & Assets
- **Icons**: Lucide React
- **Fonts**: Next.js Font Optimization

## 📱 Features Implemented

### Authentication System
- ✅ Professional login form
- ✅ Form validation with Zod
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Accessibility features

### UI/UX Features
- ✅ Dynamic color system
- ✅ Custom font integration
- ✅ Animated backgrounds
- ✅ Glass morphism effects
- ✅ Hover animations
- ✅ Loading indicators

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Development URLs
- **Login Page**: http://localhost:3000/login
- **Home Page**: http://localhost:3000

## 🎯 Best Practices Implemented

### Code Organization
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **Component Composition**: Reusable, composable components
- **Type Safety**: Comprehensive TypeScript types
- **Consistent Naming**: Clear, descriptive naming conventions

### Performance
- **Font Optimization**: Next.js font optimization
- **Bundle Splitting**: Automatic code splitting
- **Image Optimization**: Next.js image optimization ready
- **CSS Optimization**: Tailwind CSS purging

### Accessibility
- **Semantic HTML**: Proper HTML semantics
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators

### Security
- **Form Validation**: Client and server-side validation
- **Type Safety**: TypeScript for runtime safety
- **Environment Variables**: Secure configuration management

## 📚 Additional Documentation

### Extending the Project
1. **Adding New Pages**: Create under `src/app/`
2. **Adding Components**: Place in appropriate `src/components/` subdirectory
3. **Adding Types**: Define in `src/types/index.ts`
4. **Adding Constants**: Define in `src/constants/index.ts`

### Customizing Themes
Edit the CSS variables in `src/app/globals.css`:
```css
:root {
  --primary-color: your-color-here;
  --secondary-color: your-color-here;
}
```

### Adding New Fonts
1. Add font files to `public/fonts/`
2. Configure in `src/lib/fonts.ts`
3. Update CSS variables in `globals.css`
4. Add to Tailwind config if needed

## 🤝 Contributing

1. Follow the established folder structure
2. Maintain TypeScript types
3. Follow naming conventions
4. Add proper documentation
5. Test thoroughly before committing

---

**Built with ❤️ using modern web technologies**
