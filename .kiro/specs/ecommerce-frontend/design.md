# Design Document

## Overview

The Virtual Wig Boutique homepage will be transformed from a dashboard interface into a modern e-commerce storefront. The design focuses on creating an engaging customer experience with product discovery through carousels, category filtering, and responsive product grids. The layout will maintain the existing top navigation while removing the sidebar dashboard navigation for public-facing pages.

## Architecture

### Layout Structure
- **Header**: Existing TopBar component with enhanced search functionality
- **Main Content**: Full-width layout without sidebar for public pages
- **Hero Section**: Promotional banner with call-to-action
- **Product Carousel**: Featured products with interactive navigation
- **Category Filter**: Horizontal category navigation
- **Product Grid**: Responsive grid displaying all products
- **Footer**: Additional navigation and information (future enhancement)

### Component Hierarchy
```
HomePage
├── TopBar (existing, enhanced)
├── HeroSection (enhanced existing HeroCard)
├── ProductCarousel (new)
├── CategoryFilter (new)
├── ProductGrid (new)
└── ProductCard (enhanced existing)
```

## Components and Interfaces

### 1. Layout Modifications
**Purpose**: Conditionally render sidebar only for dashboard routes

**Interface**:
```typescript
// Layout component will detect route and conditionally show sidebar
const isDashboardRoute = pathname.startsWith('/dashboard')
```

**Behavior**:
- Public routes (`/`, `/login`, `/register`): Full-width layout without sidebar
- Dashboard routes (`/dashboard/*`): Existing sidebar + main content layout

### 2. Enhanced TopBar Component
**Purpose**: Add search functionality while maintaining existing features

**New Props**:
```typescript
interface TopBarProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}
```

**Features**:
- Search input field with debounced search
- Responsive design for mobile
- Maintain existing cart and auth functionality

### 3. ProductCarousel Component
**Purpose**: Display featured products in an interactive carousel

**Props**:
```typescript
interface ProductCarouselProps {
  products: ProductField[];
  autoPlay?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
}
```

**Features**:
- Touch/swipe support for mobile
- Auto-play with pause on hover
- Navigation dots and arrows
- Responsive design (1 item on mobile, 3-4 on desktop)

### 4. CategoryFilter Component
**Purpose**: Allow users to filter products by category

**Props**:
```typescript
interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}
```

**Features**:
- Horizontal scrollable on mobile
- Active state styling
- "All Products" option to clear filters

### 5. ProductGrid Component
**Purpose**: Display products in a responsive grid layout

**Props**:
```typescript
interface ProductGridProps {
  products: ProductField[];
  loading?: boolean;
  emptyMessage?: string;
}
```

**Features**:
- Responsive grid (1 col mobile, 2-3 tablet, 4+ desktop)
- Loading states with skeleton cards
- Empty state handling

### 6. Enhanced ProductCard Component
**Purpose**: Display individual product information with improved styling

**Props**:
```typescript
interface ProductCardProps {
  product: ProductField;
  showCategory?: boolean;
  showRating?: boolean;
  onClick?: (productId: string) => void;
}
```

**Features**:
- Hover effects and animations
- Star rating display
- Price formatting
- Category badges
- Responsive image handling

## Data Models

### Product Display Data
```typescript
interface ProductDisplayData extends ProductField {
  formattedPrice: string;
  categoryBadge: string;
  ratingStars: number;
  isNew?: boolean;
  isFeatured?: boolean;
}
```

### Category Data
```typescript
interface CategoryData {
  name: string;
  slug: string;
  count: number;
  featured: boolean;
}
```

### Carousel State
```typescript
interface CarouselState {
  currentIndex: number;
  isAutoPlaying: boolean;
  touchStart: number | null;
  touchEnd: number | null;
}
```

## Error Handling

### Data Fetching Errors
- **Product Loading Failure**: Display error message with retry button
- **Empty Product List**: Show placeholder content with sample products
- **Image Loading Failure**: Fallback to placeholder images

### User Interaction Errors
- **Search Errors**: Graceful degradation with client-side filtering
- **Navigation Errors**: Fallback to product list page
- **Touch/Swipe Errors**: Fallback to button navigation

### Performance Considerations
- **Image Optimization**: Use Next.js Image component with proper sizing
- **Lazy Loading**: Implement for product images below the fold
- **Debounced Search**: Prevent excessive API calls during typing

## Testing Strategy

### Unit Tests
- ProductCard component rendering with different props
- CategoryFilter selection and filtering logic
- ProductCarousel navigation and state management
- Search functionality and debouncing

### Integration Tests
- Homepage data fetching and display
- Category filtering with product updates
- Carousel interaction and navigation
- Responsive layout behavior

### Visual Tests
- Component styling across different screen sizes
- Hover states and animations
- Loading states and skeleton screens
- Error states and empty content

### User Experience Tests
- Touch/swipe functionality on mobile devices
- Keyboard navigation accessibility
- Screen reader compatibility
- Performance on slower connections

## Implementation Notes

### Styling Approach
- Continue using Tailwind CSS for consistency
- Create reusable component classes for common patterns
- Implement CSS modules for component-specific styles
- Use CSS Grid and Flexbox for responsive layouts

### State Management
- Use React useState for local component state
- Implement custom hooks for search and filtering logic
- Consider React Context for global product data if needed

### Performance Optimizations
- Implement virtual scrolling for large product lists
- Use React.memo for expensive component renders
- Optimize images with Next.js Image component
- Implement proper caching strategies for product data

### Accessibility
- Ensure proper ARIA labels for interactive elements
- Implement keyboard navigation for carousel
- Maintain proper heading hierarchy
- Provide alt text for all product images