'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Music,
  Zap,
  Clock,
  TrendingUp,
  Plus,
  Download,
  Star,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { useSongs } from '@/hooks/use-songs';

export default function DashboardPage() {
  const { songs, loading, stats } = useSongs();
  const [userStats, setUserStats] = useState({
    totalSongs: 0,
    credits: 100,
    thisMonth: 0,
    favorites: 0,
    processingTime: 0,
  });

  const recentSongs = songs?.slice(0, 5) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your music overview.</p>
        </div>
        <Link href="/studio">
          <Button size="lg" className="animate-glow">
            <Plus className="mr-2 h-5 w-5" />
            Create New Song
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: Music,
            label: 'Total Songs',
            value: userStats.totalSongs,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
          },
          {
            icon: Zap,
            label: 'Credits',
            value: userStats.credits,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
          },
          {
            icon: TrendingUp,
            label: 'This Month',
            value: userStats.thisMonth,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
          },
          {
            icon: Star,
            label: 'Favorites',
            value: userStats.favorites,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:border-purple-500/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Songs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Songs</CardTitle>
                <Link href="/songs">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentSongs.length > 0 ? (
                <div className="space-y-4">
                  {recentSongs.map((song: any) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Music className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                            {song.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {song.genre}
                            </Badge>
                            <span className="text-gray-500 text-xs">
                              {new Date(song.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {song.status === 'COMPLETED' && (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                            Completed
                          </Badge>
                        )}
                        {song.status === 'PROCESSING' && (
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                            Processing {song.progress}%
                          </Badge>
                        )}
                        {song.status === 'FAILED' && (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                            Failed
                          </Badge>
                        )}
                        {song.audioUrl && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl text-gray-400 mb-2">No songs yet</h3>
                  <p className="text-gray-600 mb-4">Create your first AI-powered song!</p>
                  <Link href="/studio">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Song
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Credits Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credits Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Used this month</span>
                    <span className="text-white">25 / 100</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white">Free</span>
                </div>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full mt-4">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/studio" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  New Song
                </Button>
              </Link>
              <Link href="/songs" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Music className="mr-2 h-4 w-4" />
                  My Songs
                </Button>
              </Link>
              <Link href="/favorites" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Star className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
