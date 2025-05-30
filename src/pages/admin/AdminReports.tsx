
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const AdminReports = () => {
  const bookingsData = [
    { date: '2024-01-15', host: 'Sarah Host', seeker: 'John Doe', spot: 'Downtown Driveway', amount: '$25.00' },
    { date: '2024-01-14', host: 'John Smith', seeker: 'Jane Smith', spot: 'Mall Parking', amount: '$50.00' },
    { date: '2024-01-13', host: 'Jane Doe', seeker: 'Mike Johnson', spot: 'Office Complex', amount: '$20.00' }
  ];

  const spotStatusData = [
    { spot: 'Downtown Driveway', host: 'Sarah Host', status: 'Active', bookings: 15 },
    { spot: 'Mall Parking', host: 'John Smith', status: 'Active', bookings: 8 },
    { spot: 'Office Complex', host: 'Jane Doe', status: 'Inactive', bookings: 3 }
  ];

  const handleExport = (reportType: string) => {
    // Simulate export functionality
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <Layout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Earnings Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Earnings Summary</CardTitle>
            <Button size="sm" variant="outline" onClick={() => handleExport('earnings')}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">$2,450</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">$245</p>
                <p className="text-sm text-gray-600">Platform Fees (10%)</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">$2,205</p>
                <p className="text-sm text-gray-600">Host Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bookings Report</CardTitle>
            <Button size="sm" variant="outline" onClick={() => handleExport('bookings')}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Host</th>
                    <th className="text-left p-2">Seeker</th>
                    <th className="text-left p-2">Spot</th>
                    <th className="text-left p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsData.map((booking, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{booking.date}</td>
                      <td className="p-2">{booking.host}</td>
                      <td className="p-2">{booking.seeker}</td>
                      <td className="p-2">{booking.spot}</td>
                      <td className="p-2 font-semibold text-green-600">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Spot Status Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Spot Status Overview</CardTitle>
            <Button size="sm" variant="outline" onClick={() => handleExport('spots')}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Spot Name</th>
                    <th className="text-left p-2">Host</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Total Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {spotStatusData.map((spot, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{spot.spot}</td>
                      <td className="p-2">{spot.host}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          spot.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {spot.status}
                        </span>
                      </td>
                      <td className="p-2">{spot.bookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminReports;
