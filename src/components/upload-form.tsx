'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { Button, Input, Textarea } from '@/components/ui';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const MAX_FILE_SIZE = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 104857600; // 100MB

const uploadRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  contentType: z.enum(['video/mp4', 'video/webm'], {
    errorMap: () => ({ message: 'Only MP4 and WebM files are supported' }),
  }),
  size: z.number().max(MAX_FILE_SIZE, 'File size must be less than 100MB'),
});

interface UploadResponse {
  url: string;
  fields: Record<string, string>;
  id: string;
  message?: string;
}

export function UploadForm(): JSX.Element {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      uploadRequestSchema.parse({
        title: 'Validation', // Dummy title for file validation
        contentType: file.type,
        size: file.size,
      });
      setFile(file);
      // Auto-fill title from filename without extension
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || isUploading) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const validation = uploadRequestSchema.parse({
        title,
        description,
        contentType: file.type,
        size: file.size,
      });

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation),
      });

      const data = (await response.json()) as UploadResponse;

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get upload URL');
      }

      const { url, fields, id } = data;

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      // Use XMLHttpRequest for upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };

        xhr.open('POST', url);
        xhr.send(formData);
      });

      toast.success('Video uploaded successfully!');
      router.push(`/videos/${id}`);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to upload video');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : file 
              ? 'border-primary/50 bg-primary/5' 
              : 'border-border hover:border-primary/30 hover:bg-card-hover'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {file ? (
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center animate-pulse">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="font-medium">Drop your video here</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-full bg-border/50 mx-auto flex items-center justify-center">
                <svg className="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="font-medium">Drag and drop your video here</p>
              <p className="text-sm text-muted">MP4 or WebM, max 100MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-muted mb-1">
            Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Enter a title for your clip"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-muted mb-1">
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

      <div>
        <Button 
          type="submit" 
          disabled={!file || !title || isUploading}
          className="w-full relative"
        >
          <span className={isUploading ? 'opacity-0' : 'opacity-100'}>
            Upload Video
          </span>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
} 