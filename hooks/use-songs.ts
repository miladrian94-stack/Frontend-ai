'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

export const useSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/songs');
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data = await res.json();
      setSongs(data.songs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSong = async (songData: any) => {
    const res = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData),
    });
    if (!res.ok) throw new Error('Failed to create song');
    const data = await res.json();
    setSongs([data.song, ...songs]);
    return data;
  };

  const deleteSong = async (id: string) => {
    const res = await fetch(`/api/songs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete song');
    setSongs(songs.filter((s: any) => s.id !== id));
  };

  const toggleFavorite = async (id: string) => {
    const res = await fetch(`/api/songs/${id}/favorite`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle favorite');
    const data = await res.json();
    setSongs(songs.map((s: any) => 
      s.id === id ? { ...s, isFavorite: data.song.isFavorite } : s
    ));
  };

  useEffect(() => {
    if (user) fetchSongs();
  }, [user]);

  return {
    songs,
    loading,
    error,
    createSong,
    deleteSong,
    toggleFavorite,
    refreshSongs: fetchSongs,
  };
};
