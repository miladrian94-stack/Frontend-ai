'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Mic,
  Square,
  Pause,
  Play,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number;
}

export function AudioRecorder({ onRecordingComplete, maxDuration = 180 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 2,
          sampleRate: 44100,
          sampleSize: 16,
        } 
      });
      streamRef.current = stream;
      setPermission(true);
      return stream;
    } catch (err) {
      setPermission(false);
      setError('Microphone access denied. Please allow microphone access to record.');
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access in your browser settings.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const startRecording = async () => {
    setError(null);
    const stream = streamRef.current || await requestPermission();
    
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm',
    });

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      onRecordingComplete(blob);
      stopTimer();
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    };

    mediaRecorder.start(1000); // Collect data every second
    setIsRecording(true);
    setDuration(0);
    startTimer();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration(prev => {
        if (prev >= maxDuration) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const discardRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDuration(0);
    setError(null);
    chunksRef.current = [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {permission === false && (
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-medium">Microphone Access Required</h4>
              <p className="text-red-300/70 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setPermission(null);
                  setError(null);
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-black/50 border-gray-700">
        <AnimatePresence mode="wait">
          {!audioUrl ? (
            <motion.div
              key="recorder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Recording Visualization */}
              {isRecording && (
                <div className="flex items-center justify-center space-x-1 h-20">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full"
                      animate={{
                        height: isPaused ? 4 : [4, Math.random() * 60 + 10, 4],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Duration & Progress */}
              {isRecording && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {isPaused ? 'Paused' : 'Recording...'}
                    </span>
                    <span className="text-purple-400 font-mono">
                      {formatTime(duration)} / {formatTime(maxDuration)}
                    </span>
                  </div>
                  <Progress 
                    value={(duration / maxDuration) * 100} 
                    className="h-1"
                  />
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 animate-pulse-glow"
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={discardRecording}
                      className="rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {isPaused ? (
                      <Button
                        onClick={resumeRecording}
                        size="lg"
                        className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseRecording}
                        size="lg"
                        className="rounded-full w-16 h-16 bg-yellow-500 hover:bg-yellow-600"
                      >
                        <Pause className="h-6 w-6" />
                      </Button>
                    )}

                    <Button
                      onClick={stopRecording}
                      size="lg"
                      className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
                    >
                      <Square className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  Recording Complete
                </Badge>
                <span className="text-gray-400 text-sm">
                  Duration: {formatTime(duration)}
                </span>
              </div>

              <audio controls className="w-full">
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={discardRecording}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    toast({
                      title: 'Recording Ready',
                      description: 'Your recording has been saved and is ready to use.',
                    });
                  }}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Use Recording
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
