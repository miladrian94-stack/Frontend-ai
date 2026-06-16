"use client";

import { useEffect, useRef, useCallback } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket-client';
import { useAuth } from './use-auth';

export function useWebSocket() {
  const { user } = useAuth();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      // Get token from cookie (simplified)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      if (token) {
        socketRef.current = getSocket(token);
      }
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  const subscribeToSong = useCallback((songId: string) => {
    socketRef.current?.emit('subscribe:song', songId);
  }, []);

  const onProgress = useCallback((callback: (data: any) => void) => {
    socketRef.current?.on('song:progress', callback);
    return () => {
      socketRef.current?.off('song:progress', callback);
    };
  }, []);

  return { subscribeToSong, onProgress };
}
