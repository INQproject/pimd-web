
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Password Reset</DialogTitle>
          <DialogDescription className="space-y-4">
            <p>Please contact support or use the login page to reset your password.</p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Contact Support:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-blue-800">
                  <Phone className="h-4 w-4" />
                  <span>Phone: (123) 456-7890</span>
                </div>
                <div className="flex items-center gap-2 text-blue-800">
                  <Mail className="h-4 w-4" />
                  <span>Email: support@parkinmydriveway.com</span>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
