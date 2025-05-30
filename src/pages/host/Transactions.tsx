import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Transactions = () => {
  const navigate = useNavigate();
  
  const [uploadData, setUploadData] = useState({
    notes: '',
    file: null as File | null
  });

  // Mock data for uploaded proofs
  const uploadedProofs = [
    {
      id: 'U001',
      date: '2024-01-15',
      notes: 'Payment received for downtown slot reservation',
      fileName: 'receipt_jan15.pdf',
      fileType: 'pdf'
    },
    {
      id: 'U002', 
      date: '2024-01-12',
      notes: 'Monthly parking payment proof',
      fileName: 'payment_proof.jpg',
      fileType: 'image'
    },
    {
      id: 'U003',
      date: '2024-01-08',
      notes: '',
      fileName: 'bank_transfer.pdf',
      fileType: 'pdf'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Payment Proof Uploaded",
      description: "Your proof has been successfully uploaded.",
    });
    setUploadData({ notes: '', file: null });
    
    // Reset file input
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleDownload = (fileName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`,
    });
  };

  return (
    <Layout title="Transactions & Payouts">
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard-host')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SECTION - Upload Form */}
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
                  <Label htmlFor="notes">Notes/Comments (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes about this upload..."
                    value={uploadData.notes}
                    onChange={(e) => setUploadData(prev => ({ 
                      ...prev, 
                      notes: e.target.value 
                    }))}
                  />
                </div>

                <Button type="submit" className="w-full bg-[#FF6B00] hover:bg-[#FF914D] text-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Proof
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* RIGHT SECTION - Uploaded Proofs */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Proofs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedProofs.map(proof => (
                  <div key={proof.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-primary">#{proof.id}</span>
                      <span className="text-sm text-gray-600">{proof.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{proof.fileName}</span>
                    </div>
                    
                    {proof.notes && (
                      <p className="text-sm text-gray-600 mb-3">{proof.notes}</p>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(proof.fileName)}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      View/Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
