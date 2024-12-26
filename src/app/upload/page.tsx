import { Metadata } from 'next';
import { UploadForm } from '@/components/upload-form';

export const metadata: Metadata = {
  title: 'Upload',
  description: 'Upload and share your gaming clips.',
};

const maxSize = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 100 * 1024 * 1024;

export default function UploadPage(): React.ReactElement {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload a Clip</h1>
        <p className="text-muted-foreground">
          Share your gaming moments with your Discord community.
        </p>
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Guidelines</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Only upload gaming-related content</li>
              <li>Ensure you have the rights to share the content</li>
              <li>No inappropriate or offensive content</li>
              <li>
                <span>Maximum file size: <strong>{(maxSize / 1024 / 1024).toFixed(0)}MB</strong></span>
              </li>
              <li>Supported formats: MP4, WebM</li>
            </ul>
          </div>

          <UploadForm />
        </div>
      </div>
    </div>
  );
} 