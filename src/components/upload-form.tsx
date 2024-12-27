'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function UploadForm(): React.ReactElement {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const maxSize = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 100 * 1024 * 1024;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }
    if (!file.type.startsWith('video/')) {
      toast.error('File must be a video');
      return;
    }
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Get upload URL
      const uploadResponse = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { url, fields, id } = await uploadResponse.json();

      // Create form data for S3 upload
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);

      // Upload to S3
      const uploadResult = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResult.ok) {
        throw new Error('Failed to upload to storage');
      }

      // Create video record
      const createResponse = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title,
          description: description || null,
          mimeType: file.type,
          size: file.size,
          url: `videos/${id}${file.type === 'video/mp4' ? '.mp4' : '.webm'}`,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create video record');
      }

      toast.success('Video uploaded successfully!');
      router.push(`/videos/${id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        {...getRootProps()}
        className={`form relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          {file ? (
            <>
              <div className="text-2xl">📹</div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl">📤</div>
              <div className="text-sm">
                <p className="font-medium">
                  {isDragActive ? 'Drop your video here' : 'Drag and drop your video'}
                </p>
                <p className="text-muted">MP4 or WebM, max {(maxSize / 1024 / 1024).toFixed(0)}MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Give your clip a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description (optional)
          </label>
          <Textarea
            id="description"
            placeholder="Add a description to your clip"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!file || !title || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Uploading {uploadProgress}%</span>
          </div>
        ) : (
          'Upload Clip'
        )}
      </Button>
    </form>
  );
} 