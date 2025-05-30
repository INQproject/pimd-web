
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Transactions = () => {
  const [uploadData, setUploadData] = useState({
    notes: '',
    file: null as File | null
  });

  const transactions = [
    {
      id: 'T001',
      date: '2024-01-15',
      amount: '$25.00',
      status: 'approved',
      notes: 'Payment received for downtown slot'
    },
    {
      id: 'T002',
      date: '2024-01-14',
      amount: '$50.00',
      status: 'pending',
      notes: 'Proof uploaded, awaiting approval'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Payment Proof Uploaded",
      description: "Your transaction is pending admin approval.",
    });
    setUploadData({ notes: '', file: null });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Transactions & Payouts">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Payment Proof</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Upload Receipt/Proof</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setUploadData(prev => ({ 
                    ...prev, 
                    file: e.target.files?.[0] || null 
                  }))}
                />
                <p className="text-sm text-gray-500">Upload image or PDF proof of payment</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes/Comments</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this transaction..."
                  value={uploadData.notes}
                  onChange={(e) => setUploadData(prev => ({ 
                    ...prev, 
                    notes: e.target.value 
                  }))}
                />
              </div>

              <Button type="submit" className="w-full btn-primary">
                <Upload className="mr-2 h-4 w-4" />
                Upload Proof
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map(transaction => (
                <div key={transaction.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">#{transaction.id}</span>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                      <p className="text-sm text-gray-500">{transaction.notes}</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">{transaction.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
