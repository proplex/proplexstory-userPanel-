"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const SignUpGoogleButton = ({ apiUrl }: { apiUrl: string }) => {
  const router = useRouter();

  return (

      <GoogleLogin
        text="signup_with"
        onSuccess={async (credentialResponse) => {
        console.log(credentialResponse);
        const { credential: token } = credentialResponse;
        const response = await fetch(
          'https://test.fandora.app/api/v2/user/login-with-google-oauth',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          }
        );
        const jsonData = await response.json();
        console.log(jsonData);
        if (jsonData.data.accessToken) {
          const accessToken = jsonData.data.accessToken;
          const refreshToken = jsonData.data.refreshToken;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          router.replace('/');
          
        }
      }}
        onError={() => {
        console.log("Login Failed");
        toast.error("Login Failed");
        }}
      />
 
  );
};

export default SignUpGoogleButton;
