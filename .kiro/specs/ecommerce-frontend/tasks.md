# Implementation Plan

- [x] 1. Update layout to conditionally show sidebar based on route
  - Modify src/app/layout.tsx to detect dashboard routes and conditionally render Sidenav
  - Create route detection logic using usePathname or similar
  - Ensure public routes (/, /login, /register) use full-width layout
  - _Requirements: 1.1, 7.1_

- [x] 2. Create enhanced ProductCard component
  - Build reusable ProductCard component with hover effects and proper styling
  - Implement star rating display using product average_rating
  - Add price formatting and category badge display
  - Include responsive image handling with Next.js Image component
  - Do not write any tests for this task
  - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [ ] 3. Implement ProductGrid component
  - Create responsive grid layout component for displaying products
  - Implement loading states with skeleton cards
  - Add empty state handling for when no products are available
  - Ensure responsive behavior (1 col mobile, 2-3 tablet, 4+ desktop)
  - Do not write any tests for this task
  - _Requirements: 4.1, 4.2, 5.3_

- [x] 4. Build ProductCarousel component
  - Create interactive carousel component with navigation arrows and dots
  - Implement touch/swipe support for mobile devices
  - Add auto-play functionality with pause on hover
  - Ensure responsive design showing different numbers of items per screen size
  - Do not write any tests for this task
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.2_

- [x] 5. Create CategoryFilter component
  - Do not write any tests for this task
  - Build horizontal category filter with all wig categories from placeholder data
  - Implement active state styling and selection logic
  - Add "All Products" option to clear category filters
  - Ensure mobile-friendly horizontal scrolling
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6. Enhance TopBar with search functionality
  - Do not write any tests for this task
  - Add search input field to existing TopBar component
  - Implement debounced search functionality to prevent excessive calls
  - Maintain existing cart and authentication features
  - Ensure responsive design for mobile devices
  - _Requirements: 7.2, 5.1_

- [x] 7. Update homepage to use new e-commerce components
  - Do not write any tests for this task
  - Replace dashboard content in src/app/page.tsx with e-commerce layout
  - Integrate ProductCarousel, CategoryFilter, and ProductGrid components
  - Implement product fetching and state management for filtering and search
  - Enhance existing HeroCard component for better e-commerce presentation
  - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.2_

- [ ] 8. Implement product filtering and search logic
  - Do not write any tests for this task
  - Create custom hooks for managing product filtering by category
  - Implement search functionality that filters products by name and description
  - Add state management for selected category and search query
  - Ensure filtering works with both carousel and grid components
  - _Requirements: 3.2, 3.3, 7.2_

- [ ] 9. Add promotional sections and visual enhancements
  - Enhance HeroCard component with better call-to-action buttons
  - Add promotional banners or special offer sections
  - Implement visual hierarchy and spacing for all homepage sections
  - Add loading states and error handling for all components
  - Do not write any tests for this task
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 10. Implement responsive design and mobile optimizations
  - Ensure all components work properly on mobile devices
  - Test and refine touch interactions for carousel
  - Optimize layout spacing and typography for different screen sizes
  - Verify accessibility features like keyboard navigation and screen reader support
  - Do not write any tests for this task
  - _Requirements: 5.1, 5.2, 5.3, 5.4_