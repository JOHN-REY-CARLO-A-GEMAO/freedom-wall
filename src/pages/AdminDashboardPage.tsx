import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, 
  Flag, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Trash2,
  Ban
} from 'lucide-react';
import Button from '../components/ui/Button';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DashboardStats {
  totalUsers: number;
  totalConfessions: number;
  reportedConfessions: number;
  activeUsers: number;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalConfessions: 0,
    reportedConfessions: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch total confessions
        const { count: totalConfessions } = await supabase
          .from('confessions')
          .select('*', { count: 'exact' });

        // Fetch reported confessions
        const { count: reportedConfessions } = await supabase
          .from('confessions')
          .select('*', { count: 'exact' })
          .eq('is_reported', true);

        // Fetch total users
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact' });

        // Calculate active users (users who posted in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { count: activeUsers } = await supabase
          .from('confessions')
          .select('*', { count: 'exact' })
          .gte('created_at', sevenDaysAgo.toISOString());

        setStats({
          totalUsers: totalUsers || 0,
          totalConfessions: totalConfessions || 0,
          reportedConfessions: reportedConfessions || 0,
          activeUsers: activeUsers || 0,
        });
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Total Confessions</h2>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalConfessions}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Reported Confessions</h2>
              <Flag className="h-5 w-5 text-red-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.reportedConfessions}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Active Users (7d)</h2>
              <Users className="h-5 w-5 text-teal-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.activeUsers}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="danger"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => {/* Handle delete reported confessions */}}
            >
              Delete Reported
            </Button>
            <Button
              variant="secondary"
              icon={<Ban className="h-4 w-4" />}
              onClick={() => {/* Handle ban users */}}
            >
              Ban Users
            </Button>
            <Button
              icon={<CheckCircle className="h-4 w-4" />}
              onClick={() => {/* Handle approve confessions */}}
            >
              Approve All
            </Button>
            <Button
              variant="ghost"
              icon={<XCircle className="h-4 w-4" />}
              onClick={() => {/* Handle reject confessions */}}
            >
              Reject All
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add recent activity items here */}
            <p className="text-gray-500 text-sm italic">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;