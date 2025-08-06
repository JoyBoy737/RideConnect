# BikeTouring App

## Overview

BikeTouring is a full-stack web application for organizing and managing bicycle touring groups. The platform enables users to create tours, join existing tours, communicate through real-time chat, and share community content. Built with modern web technologies, it provides a comprehensive solution for cycling enthusiasts to connect and plan group adventures.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 2025)

### Theme System Implementation
- Added comprehensive dark mode support with three theme options:
  - Light theme (default)
  - Dark theme (standard dark mode)
  - Pure Dark (AMOLED black background for OLED displays)
- Implemented ThemeProvider with localStorage persistence and system preference detection
- Added theme toggle buttons to all major pages (Home, Community, Map, Profile)
- Updated all components with proper dark mode color variants

### Profile Page & Navigation Enhancements
- Created dedicated Profile page (/profile) with user statistics and theme controls
- Made profile section in header clickable to navigate to profile page
- Added user avatar with fallback icon in profile button
- Integrated comprehensive theme selection interface in profile page

### Photo Upload Functionality
- Fixed "Add Photo" button in Community page with working file input
- Added image preview functionality with remove option
- Implemented proper file handling with FileReader for image preview
- Added visual feedback for photo upload attempts

### Map Display Improvements
- Enhanced map visualization with simulated interactive elements
- Added animated tour markers showing live tour locations
- Improved visual design with gradient backgrounds and road simulations
- Added proper dark mode support for map interface
- Created more engaging "Enable GPS" call-to-action

### UI/UX Improvements
- Added comprehensive dark mode classes across all pages
- Improved button hover states and transitions
- Enhanced visual hierarchy with proper color contrast
- Added theme-aware styling for cards, buttons, and text elements

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API endpoints with WebSocket support for real-time features
- **Real-time Communication**: WebSocket server for live chat functionality
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for runtime type validation

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless provider
- **Schema Management**: Drizzle migrations for version control
- **Core Entities**:
  - Users (authentication, profiles, statistics)
  - Tours (trip details, scheduling, participation limits)
  - Tour Memberships (user-tour relationships)
  - Chat Messages (real-time communication)
  - Community Posts (content sharing)

### Authentication & Authorization
- Session-based authentication with secure cookie management
- Role-based access control (tour creators vs. members)
- User verification for tour membership before chat access

### Real-time Features
- WebSocket implementation for live chat functionality
- Tour-specific chat rooms with membership validation
- Automatic reconnection logic with exponential backoff
- Message broadcasting to connected clients

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Development server and build tool with React plugin
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking and enhanced developer experience

### Form & Validation
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Date & Time
- **date-fns**: Lightweight date utility library for formatting and manipulation

### Real-time Communication
- **WebSocket (ws)**: Node.js WebSocket implementation for server-side real-time features
- Custom WebSocket client with reconnection logic for frontend