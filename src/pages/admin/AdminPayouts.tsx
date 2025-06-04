
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { DollarSign, Upload, Eye, Check, Clock, User } from 'lucide-react';

const AdminPayouts = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [uploadData, setUploadData] = useState({
    transactionId: '',
    notes: '',
    proofImage: null
  });

  // Mock payout data
  const payouts = [
    {
      id: 1,
      hostName: 'Sarah Johnson',
      hostEmail: 'sarah@example.com',
      amount: 450.00,
      period: 'January 2024',
      requestDate: '2024-02-01',
      status: 'pending',
      bookings: 15,
      commission: 67.50
    },
    {
      id: 2,
      hostName: 'Mike Chen',
      hostEmail: 'mike@example.com',
      amount: 320.00,
      period: 'January 2024',
      requestDate: '2024-02-01',
      status: 'completed',
      bookings: 12,
      commission: 48.00,
      transactionId: 'TXN-2024-001',
      completedDate: '2024-02-03'
    },
    {
      id: 3,
      hostName: 'Emma Wilson',
      hostEmail: 'emma@example.com',
      amount: 675.00,
      period: 'January 2024',
      requestDate: '2024-01-30',
      status: 'processing',
      bookings: 22,
      commission: 101.25
    },
    {
      id: 4,
      hostName: 'David Brown',
      hostEmail: 'david@example.com',
      amount: 280.00,
      period: 'December 2023',
      requestDate: '2024-01-28',
      status: 'pending',
      bookings: 9,
      commission: 42.00
    }
  ];

  const handleProcessPayout = (payout) => {
    setSelectedPayout(payout);
    setShowUploadModal(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Payout Processed",
      description: `Payout for ${selectedPayout.hostName} has been marked as completed.`,
    });
    setShowUploadModal(false);
    setSelectedPayout(null);
    setUploadData({
      transactionId: '',
      notes: '',
      proofImage: null
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout title="Payout Management">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayouts.length}</div>
              <p className="text-xs text-muted-foreground">
                Total: ${totalPendingAmount.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,150</div>
              <p className="text-xs text-muted-foreground">
                Across 45 transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$322.50</div>
              <p className="text-xs text-muted-foreground">
                15% platform fee
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payouts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Host Payout Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Host</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Period</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Bookings</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Commission</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Request Date</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{payout.hostName}</div>
                            <div className="text-sm text-gray-600">{payout.hostEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{payout.period}</td>
                      <td className="border border-gray-200 px-4 py-2 font-medium">${payout.amount.toFixed(2)}</td>
                      <td className="border border-gray-200 px-4 py-2">{payout.bookings}</td>
                      <td className="border border-gray-200 px-4 py-2">${payout.commission.toFixed(2)}</td>
                      <td className="border border-gray-200 px-4 py-2">{getStatusBadge(payout.status)}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{payout.requestDate}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {payout.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleProcessPayout(payout)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Process
                            </Button>
                          )}
                          {payout.status === 'completed' && payout.transactionId && (
                            <Badge variant="outline" className="text-xs">
                              {payout.transactionId}
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upload Proof Modal */}
        {showUploadModal && selectedPayout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Process Payout</CardTitle>
                <p className="text-sm text-gray-600">
                  Processing payout for {selectedPayout.hostName} - ${selectedPayout.amount.toFixed(2)}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      placeholder="TXN-2024-XXX"
                      value={uploadData.transactionId}
                      onChange={(e) => setUploadData({...uploadData, transactionId: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="proofImage">Transaction Proof (Image)</Label>
                    <Input
                      id="proofImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadData({...uploadData, proofImage: e.target.files[0]})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <textarea
                      id="notes"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Add any additional notes..."
                      value={uploadData.notes}
                      onChange={(e) => setUploadData({...uploadData, notes: e.target.value})}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Complete Payout
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowUploadModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPayouts;
