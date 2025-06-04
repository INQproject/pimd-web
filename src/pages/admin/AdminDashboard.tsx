import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Car, Calendar, DollarSign, MapPin, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const quickActions = [
    { title: 'Manage Hosts', path: '/admin-manage-hosts', icon: Users, color: 'bg-blue-500' },
    { title: 'Manage Seekers', path: '/admin-manage-seekers', icon: Users, color: 'bg-green-500' },
    { title: 'Manage Listings', path: '/admin-manage-listings', icon: MapPin, color: 'bg-purple-500' },
    { title: 'Manage Events', path: '/admin-manage-events', icon: Calendar, color: 'bg-orange-500' },
    { title: 'Admin Booking', path: '/admin-book-for-seeker', icon: Car, color: 'bg-indigo-500' },
    { title: 'Refund Requests', path: '/admin-refunds', icon: DollarSign, color: 'bg-red-500' },
  ];

  const recentActivity = [
    { action: 'New host registration', user: 'John Smith', time: '2 hours ago', type: 'success' },
    { action: 'Booking cancelled', user: 'Sarah Wilson', time: '4 hours ago', type: 'warning' },
    { action: 'Listing approved', user: 'Mike Johnson', time: '6 hours ago', type: 'success' },
    { action: 'Refund processed', user: 'Emma Davis', time: '1 day ago', type: 'info' },
    { action: 'New seeker registered', user: 'Alex Brown', time: '2 days ago', type: 'success' },
  ];

  const pendingApprovals = [
    {
      id: 1,
      title: 'Downtown Parking Spot',
      host: 'Sarah Johnson',
      submitted: 'Today',
      type: 'listing'
    },
    {
      id: 2,
      title: 'Mall Parking Space',
      host: 'Mike Chen',
      submitted: 'Yesterday',
      type: 'listing'
    },
    {
      id: 3,
      title: 'Payout Request',
      host: 'Emma Wilson',
      submitted: '2 days ago',
      type: 'payout'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings Today</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Across all locations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Seekers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path}>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2 w-full hover:scale-105 transition-transform"
                  >
                    <div className={`p-2 rounded-full ${action.color} text-white`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-center">{action.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Pending Approvals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{approval.title}</h4>
                      <p className="text-sm text-gray-600">
                        {approval.type === 'listing' ? `Host: ${approval.host}` : approval.host}
                      </p>
                      <p className="text-xs text-gray-500">Submitted: {approval.submitted}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        {approval.type === 'payout' ? 'Deny' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={
                          activity.type === 'success' ? 'border-green-200 text-green-800' :
                          activity.type === 'warning' ? 'border-orange-200 text-orange-800' :
                          'border-blue-200 text-blue-800'
                        }
                      >
                        {activity.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
