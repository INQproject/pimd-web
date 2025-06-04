
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Calendar, DollarSign, Eye, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface RefundRequest {
  id: string;
  bookingId: string;
  spotName: string;
  slotTime: string;
  cancelledTime: string;
  amount: number;
  status: 'pending' | 'refunded';
  refundImage?: string;
  refundNotes?: string;
  customerName: string;
}

const AdminRefunds = () => {
  const { toast } = useToast();
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: 'R001',
      bookingId: 'B001',
      spotName: 'Downtown Driveway - Sarah\'s Place',
      slotTime: '2024-06-15 9:00 AM - 11:00 AM',
      cancelledTime: '2024-06-10 2:30 PM',
      amount: 25.00,
      status: 'pending',
      customerName: 'John Doe'
    },
    {
      id: 'R002',
      bookingId: 'B005',
      spotName: 'City Center Parking',
      slotTime: '2024-06-18 2:00 PM - 4:00 PM',
      cancelledTime: '2024-06-12 10:15 AM',
      amount: 30.00,
      status: 'refunded',
      refundImage: 'refund-proof-002.jpg',
      refundNotes: 'Refund processed via bank transfer',
      customerName: 'Jane Smith'
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [refundImage, setRefundImage] = useState<File | null>(null);
  const [refundNotes, setRefundNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'refunded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUploadRefund = (request: RefundRequest) => {
    setSelectedRequest(request);
    setRefundNotes(request.refundNotes || '');
    setIsEditing(false);
    setShowUploadModal(true);
  };

  const handleEditRefund = (request: RefundRequest) => {
    setSelectedRequest(request);
    setRefundNotes(request.refundNotes || '');
    setIsEditing(true);
    setShowUploadModal(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRefundImage(file);
    }
  };

  const handleSubmitRefund = () => {
    if (!selectedRequest) return;

    if (!isEditing && !refundImage) {
      toast({
        title: "Error",
        description: "Please upload a refund proof image.",
        variant: "destructive",
      });
      return;
    }

    setRefundRequests(prev => prev.map(request => 
      request.id === selectedRequest.id 
        ? { 
            ...request, 
            status: 'refunded' as const,
            refundImage: refundImage?.name || request.refundImage,
            refundNotes: refundNotes
          }
        : request
    ));

    setShowUploadModal(false);
    setSelectedRequest(null);
    setRefundImage(null);
    setRefundNotes('');

    toast({
      title: "Refund Processed",
      description: `Refund for booking ${selectedRequest.bookingId} has been marked as processed.`,
    });
  };

  const pendingRequests = refundRequests.filter(r => r.status === 'pending');
  const processedRequests = refundRequests.filter(r => r.status === 'refunded');

  return (
    <Layout title="Refund Management">
      <div className="space-y-6">
        {/* Pending Refunds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Pending Refund Requests ({pendingRequests.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Spot Name</TableHead>
                    <TableHead>Slot Time</TableHead>
                    <TableHead>Cancelled</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.bookingId}</TableCell>
                      <TableCell>{request.customerName}</TableCell>
                      <TableCell>{request.spotName}</TableCell>
                      <TableCell>{request.slotTime}</TableCell>
                      <TableCell>{request.cancelledTime}</TableCell>
                      <TableCell>${request.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleUploadRefund(request)}
                          className="flex items-center space-x-1"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload Refund</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No pending refund requests
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processed Refunds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Processed Refunds ({processedRequests.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {processedRequests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Spot Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.bookingId}</TableCell>
                      <TableCell>{request.customerName}</TableCell>
                      <TableCell>{request.spotName}</TableCell>
                      <TableCell>${request.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditRefund(request)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No processed refunds yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload/Edit Refund Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Refund Details' : 'Upload Refund Proof'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update refund information' : 'Upload proof of refund transaction'} for booking {selectedRequest?.bookingId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="refund-amount">Refund Amount</Label>
              <Input
                id="refund-amount"
                value={`$${selectedRequest?.amount.toFixed(2) || '0.00'}`}
                disabled
                className="bg-gray-100"
              />
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="refund-image">
                  Upload Refund Proof <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="refund-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
            )}

            {isEditing && selectedRequest?.refundImage && (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {selectedRequest.refundImage}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-refund-image">Upload New Image (Optional)</Label>
                  <Input
                    id="new-refund-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="refund-notes">Notes (Optional)</Label>
              <Textarea
                id="refund-notes"
                placeholder="Add any notes about the refund process..."
                value={refundNotes}
                onChange={(e) => setRefundNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRefund}>
              {isEditing ? 'Update Refund' : 'Process Refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminRefunds;
