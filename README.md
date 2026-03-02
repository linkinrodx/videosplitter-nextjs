# Video Splitter

A Progressive Web App (PWA) for splitting videos into segments directly in your browser. Powered by FFmpeg running client-side, no server required.

## Features

- 🎬 **Client-Side Processing** - All video splitting happens in your browser using FFmpeg
- 📱 **Progressive Web App** - Install as an app on desktop or mobile for offline access
- 🚀 **No Server Required** - Your videos never leave your device
- 📊 **Real-Time Progress** - Watch processing status as videos are split
- 💾 **Batch Download** - Download all segments at once or individually
- 🎨 **Responsive UI** - Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/linkinrodx/videosplitter-react.git
cd videosplitter-react

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a Video** - Drag and drop or click to select a video file (MP4, WebM, etc.)
2. **Specify Duration** - Enter the duration in seconds for each segment
3. **Process** - Click "Split Video" and watch the progress
4. **Download** - Download individual segments or all at once

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Video Processing**: [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **PWA**: Service Worker + Web Manifest

## Development

### Available Scripts

```bash
# Development server with hot reload
pnpm run dev

# Production build
pnpm run build

# Start production server
pnpm run start

# Run ESLint
pnpm run lint
```

### Project Structure

```
components/
├── ui/                    # Reusable Radix UI components
├── video-splitter.tsx    # Main orchestrator component
├── video-upload.tsx      # File upload with drag-and-drop
├── processing-status.tsx # Progress indicator
├── split-results.tsx     # Download segments
├── sw-register.tsx       # Service Worker registration
└── install-prompt.tsx    # PWA installation prompt

lib/
└── utils.ts              # Utility functions (cn for class merging)

public/
├── manifest.json         # PWA metadata
├── sw.js                 # Service Worker
└── icons/                # App icons
```

## How It Works

1. **FFmpeg Loading** - On first load, FFmpeg Core is fetched from unpkg CDN and initialized
2. **Video Upload** - User selects a video file and metadata (duration, size) is extracted
3. **Splitting Logic** - FFmpeg processes the video in-browser and creates segments
4. **Download** - Processed segments are available as downloadable files

FFmpeg runs entirely in your browser through WebAssembly (WASM), ensuring:
- ✅ Privacy - Videos never leave your device
- ✅ Speed - Instant processing without server round-trips
- ✅ Offline - Works offline after PWA installation

## Performance

- **Initial Load**: ~15-20MB for FFmpeg Core (cached by Service Worker)
- **Processing**: Depends on video size and split duration
- **Browser Support**: Modern browsers with WebAssembly support (Chrome, Firefox, Safari, Edge)

## Installation as PWA

1. Open the app in a modern browser
2. Look for the "Install" button or use your browser's menu
3. Confirm the installation dialog
4. Access the app from your home screen or app drawer

## Troubleshooting

### FFmpeg fails to load
- Check browser console for CORS errors
- Ensure unpkg CDN is accessible: `https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd`
- Try clearing browser cache and reloading

### Video processing is slow
- Large videos take longer to process - be patient
- Close other browser tabs to free up memory
- Use shorter segments for faster processing

### Downloads not working
- Check if pop-ups are blocked by browser
- Ensure sufficient disk space
- Try a different browser

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 80+     | ✅ Full Support |
| Firefox | 75+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 80+     | ✅ Full Support |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) - Client-side video processing
- [Vercel](https://vercel.com/) - Deployment platform & Next.js framework
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Search [existing issues](https://github.com/linkinrodx/videosplitter-react/issues)
3. Create a [new issue](https://github.com/linkinrodx/videosplitter-react/issues/new)

---

Made with ❤️ using Next.js and FFmpeg
