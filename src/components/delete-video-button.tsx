'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteVideoButtonProps {
  videoId: string;
}

export function DeleteVideoButton({ videoId }: DeleteVideoButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.localStorage.getItem('adminToken')) {
      const token = prompt('Enter admin token:');
      if (!token) return;
      window.localStorage.setItem('adminToken', token);
    }

    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/videos/${videoId}/delete`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': window.localStorage.getItem('adminToken') || '',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.localStorage.removeItem('adminToken');
          toast.error('Unauthorized. Please try again.');
          return;
        }
        throw new Error('Failed to delete video');
      }

      toast.success('Video deleted successfully');
      router.push('/browse');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete video');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn-secondary text-sm flex items-center gap-2"
    >
      {isDeleting ? (
        <>
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
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
          <span>Delete</span>
        </>
      )}
    </button>
  );
} 