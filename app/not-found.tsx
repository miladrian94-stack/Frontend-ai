import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Music className="h-24 w-24 text-gray-700" />
            <span className="absolute -top-2 -right-2 text-6xl font-bold text-purple-500/30">
              404
            </span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/studio">
            <Button variant="outline" className="w-full sm:w-auto">
              <Music className="mr-2 h-4 w-4" />
              Create Music
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
