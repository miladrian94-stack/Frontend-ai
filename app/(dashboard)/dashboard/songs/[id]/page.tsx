'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SongPreview } from '@/components/studio/song-preview';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Heart,
  Download,
  Share2,
  Edit2,
  Trash2,
  Clock,
  Calendar,
  Music2,
  Loader2,
} from 'lucide-react';

export default function SongDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSong();
  }, [params.id]);

  const fetchSong = async () => {
    try {
      const res = await fetch(`/api/songs/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch song');
      const data = await res.json();
      setSong(data.song);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/songs/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete song');
      toast({
        title: 'Song Deleted',
        description: 'The song has been permanently deleted.',
      });
      router.push('/songs');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete song.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (song?.audioUrl) {
      window.open(song.audioUrl, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: song?.title,
        text: `Check out "${song?.title}" created with Melody AI!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'Song link has been copied to your clipboard.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Music2 className="h-24 w-24 text-gray-700 mb-6" />
        <h2 className="text-2xl text-white mb-2">Song Not Found</h2>
        <p className="text-gray-400 mb-6">The song you're looking for doesn't exist or was deleted.</p>
        <Button onClick={() => router.push('/songs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Songs
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => router.push('/songs')}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Songs
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <SongPreview
            song={song}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Title & Actions */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-white">{song.title}</h1>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Heart className={`h-5 w-5 ${song.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                {song.genre}
              </Badge>
              <Badge variant="secondary">{song.mood}</Badge>
              <Badge variant="secondary">{song.language}</Badge>
              <Badge variant="secondary">{song.voiceType}</Badge>
              <Badge
                className={
                  song.status === 'COMPLETED'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }
              >
                {song.status}
              </Badge>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {song.duration}s
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(song.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Card>

          {/* Lyrics */}
          {song.lyrics && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Lyrics</h3>
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {song.lyrics}
              </pre>
            </Card>
          )}

          {/* Job History */}
          {song.jobs && song.jobs.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Processing History</h3>
              <div className="space-y-3">
                {song.jobs.map((job: any) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{job.type}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(job.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Danger Zone */}
          <Card className="p-6 border-red-500/20">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-gray-400 text-sm mb-4">
              Once you delete a song, there is no going back. Please be certain.
            </p>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Song
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
