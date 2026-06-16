'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SongCard } from '@/components/songs/song-card';
import { useSongs } from '@/hooks/use-songs';
import {
  Heart,
  Music2,
  Loader2,
} from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const { songs, loading, toggleFavorite, deleteSong } = useSongs();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (songs) {
      setFavorites(songs.filter((s: any) => s.isFavorite));
    }
  }, [songs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <Heart className="h-8 w-8 text-red-400 fill-red-400" />
          <h1 className="text-3xl font-bold text-white">Favorites</h1>
        </div>
        <p className="text-gray-400">
          {favorites.length} favorite songs
        </p>
      </motion.div>

      {favorites.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {favorites.map((song: any) => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={(s) => router.push(`/songs/${s.id}`)}
              onFavorite={toggleFavorite}
              onDelete={deleteSong}
            />
          ))}
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <Heart className="h-20 w-20 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl text-gray-400 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-6">
            Songs you mark as favorite will appear here.
          </p>
          <Button onClick={() => router.push('/songs')}>
            Browse Songs
          </Button>
        </Card>
      )}
    </div>
  );
}
