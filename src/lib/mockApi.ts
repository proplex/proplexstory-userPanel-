type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
  };
  
  type AadharOtpResponse = {
    otpReference: string;
    maskedPhone: string;
  };
  
  type OtpVerificationResponse = {
    isVerified: boolean;
    token: string;
  };
  
  type PanVerificationResponse = {
    isVerified: boolean;
    panDetails: {
      name: string;
      panNumber: string;
      dateOfBirth: string;
    };
  };
  
  // Custom error classes for specific error types
  class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  
  class ApiError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  // Utility functions for validation
  const validateAadharNumber = (aadhar: string): boolean => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };
  
  const validateOtp = (otp: string): boolean => {
    const otpRegex = /^\d{4}$/;
    return otpRegex.test(otp);
  };
  
  const validatePanNumber = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };
  
  // Mock database for OTP verification
  const mockOtpStore: Map<string, { otp: string; aadhar: string }> = new Map();
  
  /**
   * Generate and send OTP for Aadhar verification
   * @param aadharNumber - 12 digit Aadhar number
   * @returns Promise with OTP reference and masked phone number
   */
  export const sendAadharOtp = async (
    aadharNumber: string
  ): Promise<ApiResponse<AadharOtpResponse>> => {
    try {
      // Validate Aadhar number format
      if (!validateAadharNumber(aadharNumber)) {
        throw new ValidationError('Invalid Aadhar number format. Must be 12 digits.');
      }
  
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Generate a random 4 digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const otpReference = Math.random().toString(36).substring(2, 15);
  
      // Store OTP for verification
      mockOtpStore.set(otpReference, { otp, aadhar: aadharNumber });
  
      // Create masked phone number (last 4 digits shown)
      const maskedPhone = `XXXXXXXX${Math.floor(1000 + Math.random() * 9000)}`;
  
      return {
        success: true,
        data: {
          otpReference,
          maskedPhone,
        },
        message: 'OTP sent successfully',
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ApiError('Failed to send OTP. Please try again later.');
    }
  };
  
  /**
   * Verify OTP for Aadhar verification
   * @param otpReference - Reference ID received from sendAadharOtp
   * @param otp - 4 digit OTP entered by user
   * @returns Promise with verification status and token
   */
  export const verifyAadharOtp = async (
    otpReference: string,
    otp: string
  ): Promise<ApiResponse<OtpVerificationResponse>> => {
    try {
      // Validate OTP format
      if (!validateOtp(otp)) {
        throw new ValidationError('Invalid OTP format. Must be 4 digits.');
      }
  
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Check if OTP reference exists
      const storedData = mockOtpStore.get(otpReference);
      if (!storedData) {
        throw new ValidationError('Invalid OTP reference. Please request a new OTP.');
      }
  
      // Verify OTP
      if (storedData.otp !== otp) {
        throw new ValidationError('Invalid OTP. Please try again.');
      }
  
      // Clear OTP from store after successful verification
      mockOtpStore.delete(otpReference);
  
      return {
        success: true,
        data: {
          isVerified: true,
          token: Math.random().toString(36).substring(2, 15),
        },
        message: 'OTP verified successfully',
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ApiError('Failed to verify OTP. Please try again later.');
    }
  };
  
  /**
   * Verify PAN number
   * @param panNumber - PAN number to verify
   * @returns Promise with verification status and PAN details
   */
  export const verifyPanNumber = async (
    panNumber: string
  ): Promise<ApiResponse<PanVerificationResponse>> => {
    try {
      // Validate PAN format
      if (!validatePanNumber(panNumber)) {
        throw new ValidationError(
          'Invalid PAN format. Must be 10 characters (e.g., AAAAA1234A).'
        );
      }
  
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Mock PAN verification
      return {
        success: true,
        data: {
          isVerified: true,
          panDetails: {
            name: 'John Doe',
            panNumber: panNumber,
            dateOfBirth: '1990-01-01',
          },
        },
        message: 'PAN verified successfully',
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ApiError('Failed to verify PAN. Please try again later.');
    }
  };