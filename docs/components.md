# Components Documentation

This document provides an overview of the key components used in Discord Clips.

## Core Components

### VideoCard

Located in `src/components/video-card.tsx`

A card component that displays video information including thumbnail, title, and metadata.

**Props**

```typescript
{
  id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
}
```

### VideoPlayer

Located in `src/components/video-player.tsx`

Custom video player component with controls and playback features.

**Props**

```typescript
{
  src: string;
  poster?: string;
  autoPlay?: boolean;
}
```

### UploadForm

Located in `src/components/upload-form.tsx`

Form component for handling video uploads with drag-and-drop support.

**Props**

```typescript
{
  onUploadComplete?: (videoId: string) => void;
}
```

### DeleteVideoButton

Located in `src/components/delete-video-button.tsx`

Button component for deleting videos with confirmation dialog.

**Props**

```typescript
{
  videoId: string;
  onDelete?: () => void;
}
```

## Layout Components

### Header

Located in `src/components/header.tsx`

Main navigation header with theme toggle and links.

### Footer

Located in `src/components/footer.tsx`

Site footer with links and information.

## UI Components

All base UI components are located in `src/components/ui/`.

### Button

```typescript
type ButtonProps = {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}
```

### Other UI Components

- Input
- Dialog
- Toast
- Dropdown
- Card

## Usage Examples

### Video Card

```tsx
import { VideoCard } from '@/components/video-card';

function VideoGrid() {
  return (
    <VideoCard
      id="video-123"
      title="My Video"
      thumbnailUrl="/thumbnails/123.jpg"
      createdAt="2023-12-25T12:00:00Z"
    />
  );
}
```

### Upload Form

```tsx
import { UploadForm } from '@/components/upload-form';

function UploadPage() {
  return (
    <UploadForm
      onUploadComplete={(videoId) => {
        console.log('Upload completed:', videoId);
      }}
    />
  );
}
```

## Styling

Components use TailwindCSS for styling with the following conventions:

- Consistent spacing using Tailwind's spacing scale
- Dark mode support using `dark:` variant
- Responsive design using Tailwind breakpoints
- Component variants using clsx/tailwind-merge

## Best Practices

1. Always provide alt text for images
2. Use semantic HTML elements
3. Ensure keyboard navigation support
4. Include proper ARIA attributes
5. Handle loading and error states
6. Implement proper type checking
7. Follow the established design system 