import { Navbar } from '@/components/navbar';
import { UploadForm } from '@/components/upload-form';

export const metadata = {
  title: 'Upload Video - Discord Clips',
  description: 'Upload your gaming clips to share on Discord',
};

export default function UploadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-4">Upload Your Clip</h1>
            <p className="text-muted">
              Share your best gaming moments with perfect Discord playback
            </p>
          </div>

          <div className="card">
            <UploadForm />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold">Supported Formats</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted">
                <li>MP4 (H.264 + AAC)</li>
                <li>WebM (VP8 + Vorbis)</li>
                <li>Maximum size: 100MB</li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Best Practices</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted">
                <li>Use descriptive titles</li>
                <li>Add relevant descriptions</li>
                <li>Keep clips under 3 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 