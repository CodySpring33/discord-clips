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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="text-sm">
            <p className="font-medium">{file.name}</p>
            <p className="text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : isDragActive ? (
          <p>Drop the video here</p>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>Drag and drop a video here, or click to select</p>
            <p>MP4 or WebM, max 100MB</p>
          </div>
        )}
      </div>

      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        required
        maxLength={100}
      />

      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        maxLength={500}
      />

      <Button type="submit" disabled={!file || !title || isUploading}>
        {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
      </Button>
    </form>
  );
} 