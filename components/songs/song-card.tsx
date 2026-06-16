'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Heart,
  Download,
  Share2,
  MoreVertical,
  Music2,
  Clock,
} from 'lucide-react';

interface SongCardProps {
  song: any;
  onPlay: (song: any) => void;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SongCard({ song, onPlay, onFavorite, onDelete }: SongCardProps) {
  const statusColors = {
    COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:border-purple-500/40 transition-all duration-300 group">
        {/* Cover Image */}
        <div className="relative aspect-square bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
          <Music2 className="h-20 w-20 text-purple-400/30 group-hover:scale-110 transition-transform" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              size="icon"
              className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-700"
              onClick={() => onPlay(song)}
            >
              <Play className="h-6 w-6 ml-1" />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={statusColors[song.status] || ''}>
              {song.status}
            </Badge>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(song.id);
            }}
            className="absolute top-2 left-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                song.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold truncate group-hover:text-purple-400 transition-colors">
            {song.title}
          </h3>
          
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {song.genre}
            </Badge>
            <span className="text-gray-500 text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {song.duration}s
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <span className="text-gray-500 text-xs">
              {new Date(song.createdAt).toLocaleDateString()}
            </span>
            
            {song.status === 'COMPLETED' && (
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
