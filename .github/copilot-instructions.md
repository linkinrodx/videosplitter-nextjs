# Video Splitter - Workspace Instructions

## Project Overview

**Video Splitter** is a Progressive Web App (PWA) built with Next.js and React that enables client-side video splitting. Users can upload videos and split them into segments of specified duration. The entire video processing pipeline runs in the browser using FFmpeg, making it fully functional offline after the initial load.

## Code Style

- **Language**: TypeScript with strict mode enabled (`"strict": true` in tsconfig)
- **Note**: Build errors are intentionally ignored (`"ignoreBuildErrors": true`) - rely on IDE type checking
- **Import Style**: Use path alias `@/*` for all imports (points to project root)
  - Example: `import { Button } from "@/components/ui/button"`
- **Client Components**: Always add `"use client"` directive to interactive components
- **Formatting**: Tailwind CSS utilities with `cn()` utility from `@/lib/utils` for conditional classes
- **Components**: Use component composition over prop drilling

## Architecture

### Core Components Structure

| Component | Purpose |
|-----------|---------|
| [video-splitter.tsx](components/video-splitter.tsx) | Main orchestrator - manages FFmpeg loading, state, and video processing |
| [video-upload.tsx](components/video-upload.tsx) | File upload UI with drag-and-drop, video preview, and metadata display |
| [processing-status.tsx](components/processing-status.tsx) | Real-time progress indicator during video splitting |
| [split-results.tsx](components/split-results.tsx) | Displays split video segments with download capabilities |
| [sw-register.tsx](components/sw-register.tsx) | Service Worker initialization for offline support |
| [install-prompt.tsx](components/install-prompt.tsx) | PWA installation prompt |

### UI Component Library
All reusable UI components are in [components/ui/](components/ui/) - built on Radix UI primitives with Tailwind styling. Use these components for consistency:
- `Button`, `Input`, `Label`, `Card`, `Dialog`, `Alert`, `Tabs`, `Accordion`, etc.

### State Management & Processing Flow

```
1. VideoSplitter (main) loads FFmpeg via unpkg CDN
2. User uploads video → VideoUpload component
3. FFmpeg gets video metadata (duration)
4. User specifies split duration → ProcessingStatus monitors progress
5. FFmpeg processes video in segments
6. SplitResults displays downloadable files
```

### Key Dependencies
- **@ffmpeg/ffmpeg**: Client-side video processing - loaded from unpkg CDN
- **@hookform/resolvers + react-hook-form**: Form validation with Zod schema support
- **@radix-ui/***: Headless UI components with accessibility built-in
- **Tailwind CSS v4**: Utility-first styling with config at [tailwind.config.ts](tsconfig.json)
- **lucide-react**: Icons throughout the UI
- **sonner**: Toast notifications
- **zod**: Schema validation

## Build and Test

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:3000)
pnpm run dev

# Production build
pnpm run build

# Start production server
pnpm run start

# Linting (ESLint)
pnpm run lint
```

**Development Note**: FFmpeg is loaded from unpkg CDN in development - ensure browser console doesn't show CORS errors.

## Project Conventions

### FFmpeg Client Initialization
- FFmpeg instance is loaded once in [VideoSplitter](components/video-splitter.tsx) with `useCallback` + `useRef`
- Loading state prevents duplicate FFmpeg initialization
- FFmpeg files are loaded from `https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd`

### Utility Functions
- [lib/utils.ts](lib/utils.ts) contains `cn()` for class merging - use this for conditional Tailwind classes
- Video metadata formatting (duration, file size) is handled in component-level utility functions

### Error Handling Pattern
```tsx
// Set error state and display via Alert component
setErrorMessage("User-friendly error message")
setAppState("error")
```

### Progress Tracking
- Main `appState` tracks lifecycle: `idle` → `loading-ffmpeg` → `processing` → `done` or `error`
- Use `setProgress` (0-100) and `setCurrentSegment`/`setTotalSegments` for ProcessingStatus component
- FFmpeg progress events are captured and mapped to UI state

## Integration Points

### PWA Features
- **Manifest**: [public/manifest.json](public/manifest.json) - configure PWA metadata (name, icons, colors)
- **Service Worker**: [public/sw.js](public/sw.js) - registered via [sw-register.tsx](components/sw-register.tsx)
- **CORS Headers**: Next.js configured with `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` required for FFmpeg

### External Resources
- FFmpeg Core: unpkg CDN (URL configurable in `video-splitter.wrapFFmpeg()`)
- Icons: SVG files in [public/icons/](public/icons/)

### Theming
- [components/theme-provider.tsx](components/theme-provider.tsx) wraps app with next-themes
- Use Tailwind CSS variables and semantic tokens (e.g., `bg-background`, `text-foreground`)

## Key Patterns & Anti-Patterns

### ✅ DO
- Add `"use client"` to interactive components
- Use `useCallback` for video processing event handlers
- Use `@/` path alias in imports
- Leverage Radix UI components from [components/ui/](components/ui/)
- Keep FFmpeg operations in refs to avoid re-initialization
- Format output as clean JSON/blob for segment downloads

### ❌ DON'T
- Import from `node_modules` directly - components should use alias paths
- Mutate FFmpeg instance multiple times
- Ignore TypeScript errors without investigation
- Create UI components outside of [components/](components/) directory
- Call FFmpeg synchronously - always await promises
- Forget `"use client"` in interactive components

## Testing & Validation

- Use React Hook Form for input validation with Zod schemas
- Test FFmpeg functionality with various video formats (MP4, WebM, etc.)
- Verify Service Worker offline capabilities in DevTools
- Check PWA installation on actual mobile devices

## Performance Considerations

- FFmpeg loading is async and cached to avoid reload overhead
- Video processing runs in browser to reduce server load
- Segment downloads are generated as blob files from processed video chunks
- Lazy load Service Worker registration to not block initial page render

