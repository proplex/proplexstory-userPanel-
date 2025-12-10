'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Phone, MapIcon } from 'lucide-react';
import useMobileOtp from '@/hooks/kyc/useMobileOtp';

type PhoneNumberUpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mobileNumber: string;
  onContinue: (mobileNumber: string) => void;
};

const PhoneNumberUpdateDialog = ({
    open,
    onOpenChange,
    mobileNumber,
    onContinue,
  }: PhoneNumberUpdateDialogProps) => {
    const { handleMobileOtp, loading, error } = useMobileOtp();
    const [newMobileNumber, setNewMobileNumber] = useState(mobileNumber);
    const [validationError, setValidationError] = useState<string | null>(null);
  
    // Reset phone number and errors on dialog open
    useEffect(() => {
      if (open) {
        setNewMobileNumber(mobileNumber);
        setValidationError(null);
      }
    }, [open, mobileNumber]);
  
    const handlePhoneOtp = async () => {
      // Clear previous errors
      setValidationError(null);

      // Validate phone number
      if (!newMobileNumber.trim()) {
        setValidationError('Phone number is required');
        return;
      }
      if (!/^\d{10}$/.test(newMobileNumber)) {
        setValidationError('Please enter a valid 10-digit mobile number');
        return;
      }
      if (newMobileNumber === mobileNumber) {
        setValidationError('New phone number must be different from current number');
        return;
      }

      // Try to send OTP
      const success = await handleMobileOtp(newMobileNumber, '+91');
      
      if (success) {
        onContinue(newMobileNumber);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="bg-gray-100 p-4 space-y-1">
            <div className="flex items-center gap-2">
              <MapIcon size={16} />
              <DialogTitle className="text-xl">Edit Mobile Number</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Enter your new mobile number below.
            </DialogDescription>
          </DialogHeader>
  
          <div className="px-4 py-6 bg-white space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="phone"
                placeholder="Enter 10-digit number"
                value={newMobileNumber}
                onChange={(e) => setNewMobileNumber(e.target.value)}
                maxLength={10}
                className="pl-10 py-5 border-gray-300 rounded-lg"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              {(validationError || error) && (
                <p className="text-sm text-red-500 mt-1">{validationError || error}</p>
              )}
            </div>
          </div>
  
          <div className="w-full px-4 pb-2">
            <Button
              onClick={handlePhoneOtp}
              disabled={loading}
              className="bg-black hover:bg-gray-800 rounded-full w-full"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
  
          <DialogFooter className="px-4 py-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default PhoneNumberUpdateDialog;
  

