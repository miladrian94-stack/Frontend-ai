'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SongCard } from '@/components/songs/song-card';
import { useSongs } from '@/hooks/use-songs';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  Plus,
  Music2,
  Loader2,
} from 'lucide-react';

export default function SongsPage() {
  const router = useRouter();
  const { songs, loading, deleteSong, toggleFavorite } = useSongs();
  const { toast } = useToast();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredSongs = songs
    ?.filter((song: any) => {
      if (search && !song.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && song.status !== statusFilter) {
        return false;
      }
      if (genreFilter !== 'all' && song.genre !== genreFilter) {
        return false;
      }
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleDelete = async (id: string) => {
    try {
      await deleteSong(id);
      toast({
        title: 'Song Deleted',
        description: 'The song has been permanently deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete song.',
        variant: 'destructive',
      });
    }
  };

  const handlePlay = (song: any) => {
    router.push(`/songs/${song.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">My Songs</h1>
          <p className="text-gray-400 mt-1">
            {filteredSongs?.length || 0} songs total
          </p>
        </div>
        <Button onClick={() => router.push('/studio')} className="animate-glow">
          <Plus className="mr-2 h-5 w-5" />
          Create New Song
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="POP">Pop</SelectItem>
            <SelectItem value="RAP">Rap</SelectItem>
            <SelectItem value="ROCK">Rock</SelectItem>
            <SelectItem value="EDM">EDM</SelectItem>
            <SelectItem value="ARABIC">Arabic</SelectItem>
            <SelectItem value="KHALEEJI">Khaleeji</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          >
            {view === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>

      {/* Songs Grid */}
      {filteredSongs && filteredSongs.length > 0 ? (
        <motion.div
          layout
          className={`grid gap-6 ${
            view === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}
        >
          <AnimatePresence>
            {filteredSongs.map((song: any) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={handlePlay}
                onFavorite={toggleFavorite}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Music2 className="h-24 w-24 text-gray-700 mx-auto mb-6" />
          <h3 className="text-2xl text-gray-400 mb-2">
            {search || statusFilter !== 'all' || genreFilter !== 'all'
              ? 'No songs match your filters'
              : 'No songs yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {search || statusFilter !== 'all' || genreFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first AI-powered song!'}
          </p>
          {!search && statusFilter === 'all' && genreFilter === 'all' && (
            <Button onClick={() => router.push('/studio')}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Song
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
