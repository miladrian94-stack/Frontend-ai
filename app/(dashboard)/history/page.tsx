'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSongs } from '@/hooks/use-songs';
import {
  Clock,
  Music2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const { songs, loading } = useSongs();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (songs) {
      setHistory(songs.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  }, [songs]);

  const statusIcon = {
    COMPLETED: CheckCircle2,
    PROCESSING: Loader2,
    FAILED: XCircle,
    PENDING: Clock,
    CANCELLED: AlertCircle,
  };

  const statusColor = {
    COMPLETED: 'text-green-400',
    PROCESSING: 'text-blue-400',
    FAILED: 'text-red-400',
    PENDING: 'text-yellow-400',
    CANCELLED: 'text-gray-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Generation History</h1>
        <p className="text-gray-400 mt-1">
          Track all your song generations and their status
        </p>
      </motion.div>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item: any, index: number) => {
            const StatusIcon = statusIcon[item.status as keyof typeof statusIcon] || Clock;
            const colorClass = statusColor[item.status as keyof typeof statusColor] || 'text-gray-400';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:border-purple-500/40 transition-all duration-300 group cursor-pointer"
                  onClick={() => router.push(`/songs/${item.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg bg-gray-900 ${colorClass}`}>
                          <StatusIcon className={`h-5 w-5 ${item.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {item.genre}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {item.mood}
                            </Badge>
                            <span className="text-gray-500 text-xs">
                              {item.duration}s
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={
                            item.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            item.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }>
                            {item.status}
                          </Badge>
                          <p className="text-gray-600 text-xs mt-1">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Music2 className="h-20 w-20 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl text-gray-400 mb-2">No generation history</h3>
          <p className="text-gray-600 mb-6">
            Start creating songs to see your generation history here.
          </p>
          <Button onClick={() => router.push('/studio')}>
            Create First Song
          </Button>
        </Card>
      )}
    </div>
  );
}
