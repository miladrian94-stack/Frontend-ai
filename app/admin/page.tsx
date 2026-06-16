'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Music2,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Server,
  HardDrive,
  Cpu,
  Database,
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">System overview and management</p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-400 px-4 py-2">
          Admin Access
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {analytics?.overview?.totalUsers || 0}
                </p>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analytics?.overview?.newUsers || 0} this month
                </p>
              </div>
              <Users className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Songs</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {analytics?.overview?.totalSongs || 0}
                </p>
              </div>
              <Music2 className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${analytics?.overview?.revenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Subs</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {analytics?.overview?.activeSubscriptions || 0}
                </p>
              </div>
              <Activity className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'API Server', status: 'healthy', icon: Server },
                { label: 'Database', status: 'healthy', icon: Database },
                { label: 'Redis Cache', status: 'healthy', icon: Cpu },
                { label: 'Storage (S3)', status: 'healthy', icon: HardDrive },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300">{item.label}</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Songs by Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.songsByGenre && Object.entries(analytics.songsByGenre).map(([genre, count]: any) => (
                <div key={genre} className="flex items-center justify-between">
                  <span className="text-gray-300">{genre}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                        style={{
                          width: `${(count / analytics.overview.totalSongs) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-white text-sm">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
