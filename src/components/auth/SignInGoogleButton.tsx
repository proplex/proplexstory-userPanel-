"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface SignInGoogleButtonProps {
  apiUrl: string;
  onSuccess?: () => void;
}

const SignInGoogleButton = ({ apiUrl, onSuccess }: SignInGoogleButtonProps) => {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      const { credential: token } = credentialResponse;
      
      // Log the API URL for debugging

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
        console.log('Response:', response);
       

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      const jsonData = await response.json();
      
      if (jsonData.data?.accessToken) {
        const accessToken = jsonData.data.accessToken;
        const sessionId = jsonData.data.sessionId;
        const userId = jsonData.data.user?._id;
        
        // Store tokens in session storage
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('sessionId', sessionId);
        if (userId) {
          sessionStorage.setItem('userId', userId);
        }
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Refresh the page to ensure all states are properly updated
        window.location.reload();
      } else {
        throw new Error('Failed to get access token from server response');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        console.error("Google Login Failed");
        toast.error("Google login failed. Please try again.");
      }}
      useOneTap
      shape="rectangular"
      width="335"
      type="standard"
    />
  );
};

export default SignInGoogleButton;
