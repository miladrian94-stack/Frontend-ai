'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
  Share2,
  Heart,
  Music2,
  Repeat,
  Shuffle,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface SongPreviewProps {
  song: {
    id: string;
    title: string;
    genre: string;
    mood: string;
    duration: number;
    audioUrl: string;
    waveformData?: any;
  };
  onDownload: () => void;
  onShare: () => void;
  onFavorite?: () => void;
}

export function SongPreview({ song, onDownload, onShare, onFavorite }: SongPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (song.audioUrl) {
      window.open(song.audioUrl, '_blank');
      onDownload();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: song.title,
        text: `Check out "${song.title}" created with Melody AI!`,
        url: `${window.location.origin}/songs/${song.id}`,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/songs/${song.id}`
      );
      toast({
        title: 'Link Copied!',
        description: 'Song link has been copied to your clipboard.',
      });
    }
    onShare();
  };

  return (
    <Card className={`${
      isFullscreen 
        ? 'fixed inset-0 z-50 m-0 rounded-none'
        : 'p-6 bg-gradient-to-br from-gray-900 to-black border-purple-500/20'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{song.title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              {song.genre}
            </Badge>
            <Badge variant="secondary">{song.mood}</Badge>
            <span className="text-gray-500 text-sm">
              {formatTime(song.duration)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onFavorite}>
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Waveform / Album Art */}
      <div className="relative mb-6">
        <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl flex items-center justify-center overflow-hidden">
          <Music2 className={`h-32 w-32 text-purple-400/30 ${isPlaying ? 'animate-pulse' : ''}`} />
          {/* Animated bars overlay */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-end justify-center space-x-2 p-8">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-full"
                  animate={{
                    height: [
                      Math.random() * 40 + 20,
                      Math.random() * 80 + 40,
                      Math.random() * 40 + 20,
                    ],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audio Element (Hidden) */}
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <Slider
          value={[currentTime]}
          max={song.duration}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(song.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon">
          <Shuffle className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <SkipBack className="h-6 w-6" />
          </Button>
          
          <Button
            onClick={togglePlay}
            size="lg"
            className="rounded-full w-14 h-14"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon">
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>

        <Button variant="ghost" size="icon">
          <Repeat className="h-4 w-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 mb-6">
        <Volume2 className="h-4 w-4 text-gray-400" />
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button onClick={handleDownload} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" onClick={handleShare} className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </Card>
  );
}
