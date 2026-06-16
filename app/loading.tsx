import { Loader2, Music } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="relative mb-8">
          <Music className="h-16 w-16 text-purple-500/50 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-48 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 animate-pulse rounded-full" />
          </div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
}
