import { UploadForm } from '@/components/upload-form';

export const metadata = {
  title: 'Upload Video - Discord Clips',
  description: 'Upload your video to share on Discord',
};

export default function UploadPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Upload Video</h1>
          <p className="mt-2 text-gray-600">
            Share your videos with Discord-compatible playback
          </p>
        </div>
        
        <UploadForm />
      </div>
    </main>
  );
} 