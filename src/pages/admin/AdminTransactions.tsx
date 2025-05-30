
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 'T001',
      hostName: 'Sarah Host',
      amount: '$25.00',
      uploadDate: '2024-01-15',
      status: 'pending',
      notes: 'Payment received for downtown slot',
      hasImage: true
    },
    {
      id: 'T002',
      hostName: 'John Smith',
      amount: '$50.00',
      uploadDate: '2024-01-14',
      status: 'approved',
      notes: 'Mall parking payment confirmed',
      hasImage: true
    },
    {
      id: 'T003',
      hostName: 'Jane Doe',
      amount: '$20.00',
      uploadDate: '2024-01-13',
      status: 'rejected',
      notes: 'Invalid payment proof',
      hasImage: false
    }
  ]);

  const updateTransactionStatus = (transactionId: string, newStatus: string) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === transactionId ? { ...transaction, status: newStatus } : transaction
    ));
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
    <Layout title="Transaction Management">
      <Card>
        <CardHeader>
          <CardTitle>Host Payment Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold">#{transaction.id}</span>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Host:</span> {transaction.hostName}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Amount:</span> {transaction.amount}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Upload Date:</span> {transaction.uploadDate}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Notes:</span> {transaction.notes}
                    </p>
                    {transaction.hasImage && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Image Uploaded</Badge>
                        <Button size="sm" variant="link" className="p-0 h-auto">
                          View Image
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {transaction.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="btn-primary"
                        onClick={() => updateTransactionStatus(transaction.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateTransactionStatus(transaction.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AdminTransactions;
